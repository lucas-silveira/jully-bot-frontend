import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRecoilValue } from 'recoil';
import { CircularProgress } from '@material-ui/core';
import { Backdrop } from '@styles/components/backdrop.style';
import DashboardLayout from '@layouts/dashboard';
import { authState } from '@store/auth';
import * as S from '@styles/pages/bot.style';

type BotProps = {
  bot: {};
};

export default function Bot({ bot }: BotProps): JSX.Element {
  const router = useRouter();
  const auth = useRecoilValue(authState);
  const [pageIsLoading, setPageIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.accessToken) {
      router.push('/signin');
      return;
    }
    setPageIsLoading(false);
  }, [router, auth]);

  if (router.isFallback)
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>;

  return (
    <>
      <Head>
        <title>Meu dashboard | Jully Bot</title>
      </Head>
      <Backdrop open={pageIsLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DashboardLayout>
        <S.Wrapper>
          <S.Header>
            <h4>Bot</h4>
          </S.Header>
        </S.Wrapper>
      </DashboardLayout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const bot = {};

  return {
    props: { bot },
    revalidate: 10,
  };
};
