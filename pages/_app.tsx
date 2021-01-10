/* eslint-disable react/jsx-props-no-spreading */
import { StylesProvider } from '@material-ui/core';
import { RecoilRoot } from 'recoil';
import AppProvider from '@context/index';
import GlobalStyle from '../styles/global.style';

export default function MyApp({ Component, pageProps }): JSX.Element {
  return (
    <AppProvider>
      <RecoilRoot>
        <GlobalStyle />
        <StylesProvider injectFirst>
          <Component {...pageProps} />
        </StylesProvider>
      </RecoilRoot>
    </AppProvider>
  );
}
