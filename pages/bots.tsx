import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import {
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import { authState } from '@store/auth';
import DashboardLayout from 'layouts/dashboard';
import { Backdrop } from '@styles/components/backdrop.style';
import * as S from '@styles/pages/bots.style';
import * as FormStyle from '@styles/components/form.style';
import jullyApiService from 'services/jully-api.service';
import ToastForm from '@components/toasts/toast-form';
import { Chip } from '@styles/components/chip.style';

type Bots = {
  id: number;
  phone: string;
  name: string;
  openingHours: string[];
  welcomeMessage: string;
  managerId: number;
  createdAt: string;
  updatedAt: string;
  sessionsId: number[];
};

export default function Bots(): JSX.Element {
  const router = useRouter();
  const auth = useRecoilValue(authState);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [toastError, setToastError] = useState({
    open: false,
    message: '',
  });
  const [bots, setBots] = useState<Bots[]>([]);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (!auth.accessToken) {
      router.push('/signin');
      return;
    }
    setPageIsLoading(false);
  }, [router, auth]);

  useEffect(() => {
    const getAllBots = async () => {
      try {
        const botsFromApi = await jullyApiService.getAllBots(auth.managerId);
        setBots(botsFromApi);
      } catch (err) {
        setToastError({
          open: true,
          message:
            err.response?.data?.message ||
            'Houve um erro ao tentar obter os bots cadastrados.',
        });
      }
    };

    getAllBots();
  }, []); // eslint-disable-line

  const handleToastErrorClose = useCallback(() => {
    setToastError({
      open: false,
      message: '',
    });
  }, []);

  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      const value = Number(event.currentTarget.dataset.key);
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
    },
    [checked],
  );

  const handleOpenPage = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const { phone } = event.currentTarget.dataset;

      router.push(`/bots/${phone}`);
    },
    [router],
  );

  if (router.isFallback)
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>;

  return (
    <>
      <Head>
        <title>Meus bots | Jully Bot</title>
      </Head>
      <Backdrop open={pageIsLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastForm
        type="error"
        toast={toastError}
        handleClose={handleToastErrorClose}
      />
      {!pageIsLoading && (
        <DashboardLayout>
          <S.Wrapper>
            <S.Header>
              <h4>Meus bots</h4>
              {!!checked.length && (
                <FormStyle.Button bgColor="#84a98c">
                  Apagar selecionados ({checked.length})
                </FormStyle.Button>
              )}
            </S.Header>
            <S.List>
              {bots.map(bot => {
                const labelId = `checkbox-list-label-${bot.name}`;

                return (
                  <ListItem
                    key={bot.id}
                    role={undefined}
                    dense
                    button
                    data-phone={bot.phone}
                    onClick={handleOpenPage}
                  >
                    <ListItemIcon>
                      <FormStyle.Checkbox
                        edge="start"
                        checked={checked.includes(bot.id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        data-key={bot.id}
                        onClick={handleToggle}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={bot.name} />
                    <ListItemSecondaryAction>
                      <Chip
                        variant="outlined"
                        size="small"
                        icon={<PhoneIphoneIcon />}
                        label={bot.phone}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </S.List>
          </S.Wrapper>
        </DashboardLayout>
      )}
    </>
  );
}
