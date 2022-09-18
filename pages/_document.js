import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Quicksand Google Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Kutty Alpine Bundle for Component */}
        <script
          async
          src="https://cdn.jsdelivr.net/npm/kutty@latest/dist/kutty.min.js"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
