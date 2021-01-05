import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CircularProgress } from '@material-ui/core';
import { Backdrop } from '@styles/components/backdrop.style';

export default function Dashboard(): JSX.Element {
  const router = useRouter();
  const [isAuthenticated] = useState(false);

  useEffect(() => {
    router.push(isAuthenticated ? 'dashboard' : 'login');
  }, [router, isAuthenticated]);
  return (
    <>
      <Head>
        <title>Meu dashboard</title>
      </Head>
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
      <h1>Dashboard</h1>
    </>
  );
}
