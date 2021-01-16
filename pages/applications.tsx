import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  CardActionArea,
  CardMedia,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import { useAuth } from '@context/auth';
import { useManager } from '@context/hooks';
import jullyApiService from '@services/jully-api.service';
import DashboardLayout from 'layouts/dashboard';
import ToastForm from '@components/toasts/toast-form';
import AppRemoveDialog from '@components/dialogs/app-remove-dialog';
import { Backdrop } from '@styles/components/backdrop.style';
import * as S from '@styles/pages/applications.style';

type Application = {
  id: number;
  name: string;
  title: string;
  description: string;
  banner: string;
  icon: string;
};

export default function Applications(): JSX.Element {
  const router = useRouter();
  const { authState } = useAuth();
  const { getManager } = useManager();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [toast, setToast] = useState({
    type: 'error',
    open: false,
    message: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingRemoving, setLoadingRemoving] = useState(false);
  const [apps, setApps] = useState<Application[]>([]);
  const [appSelected, setAppSelected] = useState<Application>(
    {} as Application,
  );

  useEffect(() => {
    if (!authState.accessToken) {
      router.push('signin');
      return;
    }
    setPageIsLoading(false);
  }, [router, authState]);

  useEffect(() => {
    const getApps = async () => {
      try {
        const appsFromApi = await jullyApiService.getManagerApplications();
        setApps(appsFromApi);
      } catch (err) {
        setToast({
          type: 'error',
          open: true,
          message:
            err.response?.data?.message ||
            'Houve um erro ao tentar obter os aplicativos instalados.',
        });
      }
    };

    getApps();
  }, []);

  const handleToastClose = useCallback(() => {
    setToast(oldValue => ({ ...oldValue, open: false, message: '' }));
  }, []);

  const handleClickOpenDialog = useCallback(
    (app: Application) => () => {
      setOpenDialog(true);
      setAppSelected(app);
    },
    [],
  );

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleRemoveApp = useCallback(
    (appId: number) => () => {
      const installApp = async () => {
        try {
          setLoadingRemoving(true);
          await jullyApiService.removeApplication(appId);
          await getManager();
          setApps(oldValue => oldValue.filter(app => app.id !== appId));
          setOpenDialog(false);
          setLoadingRemoving(false);
          setToast({
            type: 'success',
            open: true,
            message: 'Aplicativo removido com sucesso!',
          });
        } catch (err) {
          setLoadingRemoving(false);
          setToast({
            type: 'error',
            open: true,
            message:
              err.response?.data?.message ||
              'Houve um erro ao tentar remover o aplicativo.',
          });
        }
      };

      installApp();
    },
    [getManager],
  );

  return (
    <>
      <Head>
        <title>Loja de Aplicativos | Jully Bot</title>
      </Head>
      <Backdrop open={pageIsLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastForm
        type={toast.type as any}
        toast={{ open: toast.open, message: toast.message }}
        handleClose={handleToastClose}
      />
      {!pageIsLoading && (
        <DashboardLayout>
          <S.Wrapper>
            <S.Header>
              <h4>Meus aplicativos</h4>
            </S.Header>
            <Divider light />
            <S.Main>
              <S.AppsList>
                {apps.length ? (
                  apps.map(app => (
                    <S.AppCard key={app.id}>
                      <CardActionArea onClick={handleClickOpenDialog(app)}>
                        <CardMedia
                          component="img"
                          alt={app.title}
                          image={app.banner}
                          title={app.title}
                        />
                        <S.AppCardContent>
                          <h4>{app.title}</h4>
                          <p>{app.description}</p>
                        </S.AppCardContent>
                        <footer>
                          <p>Remover</p>
                        </footer>
                      </CardActionArea>
                    </S.AppCard>
                  ))
                ) : (
                  <p>Você ainda não instalou nenhum aplicativo.</p>
                )}
              </S.AppsList>
            </S.Main>
          </S.Wrapper>
          <AppRemoveDialog
            open={openDialog}
            handleClose={handleCloseDialog}
            handleSubmit={handleRemoveApp}
            appId={appSelected.id}
            appTitle={appSelected.title}
            loading={loadingRemoving}
          />
        </DashboardLayout>
      )}
    </>
  );
}
