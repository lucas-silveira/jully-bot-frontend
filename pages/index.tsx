import Head from 'next/head';
import { CircularProgress } from '@material-ui/core';
import { Backdrop } from '@styles/components/backdrop.style';
import HeaderBrand from '@components/header/header-brand';
import * as S from '@styles/pages/index.style';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Jully Bot - Automatize o atendimento no whatsapp</title>
      </Head>
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
      <S.LayoutWrapper>
        <HeaderBrand />
      </S.LayoutWrapper>
    </>
  );
}
