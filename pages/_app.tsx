/* eslint-disable react/jsx-props-no-spreading */
import GlobalStyle from '../styles/global';

export default function MyApp({ Component, pageProps }): React.ReactNode {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
