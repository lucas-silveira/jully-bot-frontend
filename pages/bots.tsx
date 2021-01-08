import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import { authState } from '@store/auth';
import DashboardLayout from 'layouts/dashboard';
import { Backdrop } from '@styles/components/backdrop.style';
import * as S from '@styles/pages/bots.style';
import * as FormStyle from '@styles/components/form.style';
import jullyAPIService from 'services/jully-api.service';
import ToastForm from '@components/toasts/toast-form';

export default function Bots(): JSX.Element {
  const router = useRouter();
  const auth = useRecoilValue(authState);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [toastError, setToastError] = useState({
    open: false,
    message: '',
  });
  const [bots, setBots] = useState([]);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    const getAllBots = async () => {
      try {
        const botsFromApi = await jullyAPIService.getAllBots(auth.managerId);
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
  }, []);

  useEffect(() => {
    if (!auth.accessToken) {
      router.push('/signin');
      return;
    }
    setPageIsLoading(false);
  }, [router, auth]);

  const handleToastErrorClose = useCallback(() => {
    setToastError({
      open: false,
      message: '',
    });
  }, []);

  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
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

  return (
    <>
      <Head>
        <title>Meu dashboard | Jully Bot</title>
      </Head>
      <Backdrop open={pageIsLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastForm
        type="error"
        toast={toastError}
        handleClose={handleToastErrorClose}
      />
      {!pageIsLoading && !router.isFallback && (
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
                    data-key={bot.id}
                    onClick={handleToggle}
                  >
                    <ListItemIcon>
                      <FormStyle.Checkbox
                        edge="start"
                        checked={checked.includes(bot.id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={bot.name} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments">
                        <CommentIcon />
                      </IconButton>
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
