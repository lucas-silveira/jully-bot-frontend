/* eslint-disable react/jsx-props-no-spreading */
import { RecoilRoot } from 'recoil';
import GlobalStyle from '../styles/global';

export default function MyApp({ Component, pageProps }): JSX.Element {
  return (
    <>
      <GlobalStyle />
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </>
  );
}
