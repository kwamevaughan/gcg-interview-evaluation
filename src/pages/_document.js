import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* Add Google Fonts for Questrial */}
                    <link
                        href="https://fonts.googleapis.com/css2?family=Questrial&display=swap"
                        rel="stylesheet"
                    />
                    {/* Favicon Links */}
                    <link rel="icon" href="/favicon.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <title>GCG Personality Evaluation Test</title>
                    {/* Google Tag Manager Script */}
                </Head>
                <body style={{ fontFamily: 'Questrial, sans-serif' }}>
                {/* Google Tag Manager (noscript) */}
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
