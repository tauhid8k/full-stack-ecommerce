import Head from 'next/head';
import Navbar from './Navbar';

const Layout = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title ? title : 'Next E-Commerce'}</title>
        <meta
          name="description"
          content="NextJS Full-stack E-Commerce Website"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow">{children}</main>
        <footer>Footer</footer>
      </div>
    </>
  );
};

export default Layout;
