import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '../components';
import styles from '../styles/Auth.module.css';

const UnauthorizedScreen = () => {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title="Unauthorized Page">
      <div className={styles.authContainer}>
        <div className="text-center">
          <h1 className="text-3xl text-gray-700 font-semibold">
            Access Denied
          </h1>
          {message && (
            <div className="text-red-500 text-xl mb-4">{message}</div>
          )}
          <Link href="/login">
            <a className="btn btn-light-warning">Login</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default UnauthorizedScreen;
