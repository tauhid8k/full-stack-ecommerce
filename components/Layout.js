import Head from 'next/head';

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
      <div>
        <header>Header</header>
        <main>{children}</main>
        <footer>Footer</footer>
      </div>
    </>
  );
};

export default Layout;
