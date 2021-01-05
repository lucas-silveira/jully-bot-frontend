/* eslint-disable react/jsx-props-no-spreading */
import { StylesProvider } from '@material-ui/core';
import { RecoilRoot } from 'recoil';
import GlobalStyle from '../styles/global.style';

export default function MyApp({ Component, pageProps }): JSX.Element {
  return (
    <>
      <GlobalStyle />
      <RecoilRoot>
        <StylesProvider injectFirst>
          <Component {...pageProps} />
        </StylesProvider>
      </RecoilRoot>
    </>
  );
}
