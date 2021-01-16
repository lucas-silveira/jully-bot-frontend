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
import { Backdrop } from '@styles/components/backdrop.style';
import * as S from '@styles/pages/store.style';
import AppInstallDialog from '@components/dialogs/app-install-dialog';

type Product = {
  id: number;
  name: string;
  title: string;
  description: string;
  logotipo: string;
  banner: string;
  icon: string;
  siteUrl: string;
  providerId: number;
};

export default function Store(): JSX.Element {
  const router = useRouter();
  const { authState } = useAuth();
  const { getManager, appIsInstalled } = useManager();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [toast, setToast] = useState({
    type: 'error',
    open: false,
    message: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingInstallation, setLoadingInstallation] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSelected, setProductSelected] = useState<Product>({});

  useEffect(() => {
    if (!authState.accessToken) {
      router.push('signin');
      return;
    }
    setPageIsLoading(false);
  }, [router, authState]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const productsFromApi = await jullyApiService.getAllProducts();
        setProducts(productsFromApi);
      } catch (err) {
        setToast({
          type: 'error',
          open: true,
          message:
            err.response?.data?.message ||
            'Houve um erro ao tentar obter os produtos da loja.',
        });
      }
    };

    getAllProducts();
  }, []);

  const handleToastClose = useCallback(() => {
    setToast(oldValue => ({ ...oldValue, open: false, message: '' }));
  }, []);

  const handleClickOpenDialog = useCallback(
    (product: Product) => () => {
      if (appIsInstalled(product.name)) return;
      setOpenDialog(true);
      setProductSelected(product);
    },
    [appIsInstalled],
  );

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleInstallApp = useCallback(
    (appName: string) => () => {
      const installApp = async () => {
        try {
          setLoadingInstallation(true);
          await jullyApiService.installApplication(appName);
          await getManager();
          setOpenDialog(false);
          setLoadingInstallation(false);
        } catch (err) {
          setLoadingInstallation(false);
          setToast({
            type: 'error',
            open: true,
            message:
              err.response?.data?.message ||
              'Houve um erro ao tentar instalar o aplicativo.',
          });
        }
      };

      installApp();
    },
    [getManager],
  );

  const appAlreadyIsInstalled = useCallback(
    (productName: string) => {
      return appIsInstalled(productName);
    },
    [appIsInstalled],
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
              <h4>Loja de aplicativos</h4>
            </S.Header>
            <Divider light />
            <S.Main>
              <S.AppsList>
                {products.map(product => (
                  <S.AppCard key={product.id}>
                    <CardActionArea onClick={handleClickOpenDialog(product)}>
                      <CardMedia
                        component="img"
                        alt={product.title}
                        image={product.banner}
                        title={product.title}
                      />
                      <S.AppCardContent>
                        <h4>{product.title}</h4>
                        <p>{product.description}</p>
                      </S.AppCardContent>
                      <footer>
                        <p>
                          {appAlreadyIsInstalled(product.name)
                            ? 'Instalado'
                            : 'Instalar agora'}
                        </p>
                      </footer>
                    </CardActionArea>
                  </S.AppCard>
                ))}
              </S.AppsList>
            </S.Main>
          </S.Wrapper>
          <AppInstallDialog
            open={openDialog}
            handleClose={handleCloseDialog}
            handleSubmit={handleInstallApp}
            appName={productSelected.name}
            appTitle={productSelected.title}
            loading={loadingInstallation}
          />
        </DashboardLayout>
      )}
    </>
  );
}
