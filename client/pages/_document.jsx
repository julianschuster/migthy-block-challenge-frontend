import {
  Html, Head, Main, NextScript,
} from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="/fonts.googleapis.com" />
        <link rel="preconnect" href="/fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800;900&display=swap"
          rel="stylesheet"
        />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@2.2.0/fonts/remixicon.css" rel="stylesheet" />
        <meta name="description" content="Share your photos with the world" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
