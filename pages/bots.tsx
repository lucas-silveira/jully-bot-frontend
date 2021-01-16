import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  CircularProgress,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import DashboardLayout from 'layouts/dashboard';
import { Backdrop } from '@styles/components/backdrop.style';
import * as S from '@styles/pages/bots.style';
import * as FormStyle from '@styles/components/form.style';
import jullyApiService from 'services/jully-api.service';
import ToastForm from '@components/toasts/toast-form';
import { Chip } from '@styles/components/chip.style';
import { useAuth } from '@context/auth';

type Bots = {
  id: number;
  phone: string;
  name: string;
  openingHours: Array<{
    dayWeek: number;
    startHour: string;
    endHour: string;
  }>;
  welcomeMessage: string;
  managerId: number;
  createdAt: string;
  updatedAt: string;
  sessionsId: number[];
};

export default function Bots(): JSX.Element {
  const router = useRouter();
  const { authState } = useAuth();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [toastError, setToastError] = useState({
    open: false,
    message: '',
  });
  const [bots, setBots] = useState<Bots[]>([]);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (!authState.accessToken) {
      router.push('/signin');
      return;
    }
    setPageIsLoading(false);

    const getAllBots = async () => {
      try {
        const botsFromApi = await jullyApiService.getAllBots(
          authState.managerId,
        );
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
  }, [router, authState]);

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
                <FormStyle.Button $bgColor="#84a98c" size="small">
                  Apagar selecionados ({checked.length})
                </FormStyle.Button>
              )}
            </S.Header>
            <Divider light />
            <S.Main>
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
                          $textColor="#84a98c"
                          $bgColor="#84a98c"
                          label={bot.phone}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </S.List>
            </S.Main>
          </S.Wrapper>
        </DashboardLayout>
      )}
    </>
  );
}
