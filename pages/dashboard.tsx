import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CircularProgress, Divider } from '@material-ui/core';
import DashboardLayout from 'layouts/dashboard';
import { Backdrop } from '@styles/components/backdrop.style';
import * as S from '@styles/pages/dahsboard.style';
import { useAuth } from '@context/auth';

export default function Dashboard(): JSX.Element {
  const router = useRouter();
  const { authState } = useAuth();
  const [pageIsLoading, setPageIsLoading] = useState(true);

  useEffect(() => {
    if (!authState.accessToken) {
      router.push('signin');
      return;
    }
    setPageIsLoading(false);
  }, [router, authState.accessToken]);

  return (
    <>
      <Head>
        <title>Meu dashboard | Jully Bot</title>
      </Head>
      <Backdrop open={pageIsLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!pageIsLoading && (
        <DashboardLayout>
          <S.Wrapper>
            <S.Header>
              <h4>Visão geral</h4>
            </S.Header>
            <Divider light />
            <S.Main />
          </S.Wrapper>
        </DashboardLayout>
      )}
    </>
  );
}
