import store from '../redux/store';
import '../styles/globals.css';
import { Provider } from 'react-redux';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=Login Required');
    },
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen grid place-items-center">
        <div class="spinner w-12 h-12" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return children;
}

export default MyApp;
