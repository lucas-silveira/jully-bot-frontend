import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  CardActionArea,
  CardMedia,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import { useAuth } from '@context/auth';
import DashboardLayout from 'layouts/dashboard';
import { Backdrop } from '@styles/components/backdrop.style';
import * as S from '@styles/pages/applications.style';

export default function Applications(): JSX.Element {
  const router = useRouter();
  const { authState } = useAuth();
  const [pageIsLoading, setPageIsLoading] = useState(true);

  useEffect(() => {
    if (!authState.accessToken) {
      router.push('signin');
      return;
    }
    setPageIsLoading(false);
  }, [router, authState]);

  return (
    <>
      <Head>
        <title>Meus aplicativos | Jully Bot</title>
      </Head>
      <Backdrop open={pageIsLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!pageIsLoading && (
        <DashboardLayout>
          <S.Wrapper>
            <S.Header>
              <h4>Meus aplicativos</h4>
            </S.Header>
            <Divider light />
            <S.Main>
              <S.AppsList>
                <S.AppCard>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt="Contemplative Reptile"
                      image="https://yanado.com/blog/wp-content/uploads/2016/02/yanado_banner_03.jpg"
                      title="Contemplative Reptile"
                    />
                    <S.AppCardContent>
                      <h4>Google Agenda</h4>
                      <p>
                        Lizards are a widespread group of squamate reptiles,
                        with over 6,000 species, ranging across all continents
                        except Antarctica
                      </p>
                    </S.AppCardContent>
                    <footer>
                      <p>Instalar agora</p>
                    </footer>
                  </CardActionArea>
                </S.AppCard>
              </S.AppsList>
            </S.Main>
          </S.Wrapper>
        </DashboardLayout>
      )}
    </>
  );
}
