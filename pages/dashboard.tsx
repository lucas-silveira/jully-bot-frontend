import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { Backdrop } from '@styles/components/backdrop.style';
import { useRecoilValue } from 'recoil';
import { authState } from 'store/auth';
import * as S from '@styles/pages/dahsboard.style';
import DashboardLayout from 'layouts/dashboard';

export default function Dashboard(): JSX.Element {
  const router = useRouter();
  const auth = useRecoilValue(authState);
  const [pageIsLoading, setPageIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.accessToken) {
      router.push('signin');
      return;
    }
    setPageIsLoading(false);
  }, [router, auth]);

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
          <S.Wrapper>Carregando...</S.Wrapper>
        </DashboardLayout>
      )}
    </>
  );
}
