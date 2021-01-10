import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CircularProgress } from '@material-ui/core';
import AdbIcon from '@material-ui/icons/Adb';
import { Backdrop } from '@styles/components/backdrop.style';
import DashboardLayout from '@layouts/dashboard';
import jullyApiService from '@services/jully-api.service';
import * as S from '@styles/pages/bot.style';
import { Chip } from '@styles/components/chip.style';
import { useAuth } from '@context/auth';

type BotAnswer = {
  id: string;
  correlationId: string;
  optionNumber: number;
  text: string;
  questions: {
    id: string;
    correlationId: string;
    optionNumber: number;
    text: string;
  };
};
type Bot = {
  id: number;
  phone: string;
  name: string;
  active: boolean;
  openingHours: Array<{
    dayWeek: number;
    startHour: string;
    endHour: string;
  }>;
  welcomeMessage: string;
  topics: Array<{
    id: number;
    optionNumber: number;
    name: string;
    description: string;
    questions: Array<{
      id: string;
      correlationId: string;
      optionNumber: number;
      text: string;
      answers: BotAnswer[];
    }>;
  }>;
  managerId: number;
  sessionsId: number[];
  createdAt: string;
  updatedAt: string;
};

export default function Bot(): JSX.Element {
  const router = useRouter();
  const { authState } = useAuth();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [bot, setBot] = useState<Bot>({} as Bot);

  useEffect(() => {
    if (!authState.accessToken) {
      router.push('/signin');
      return;
    }
    setPageIsLoading(false);
  }, [router, authState.accessToken]);

  useEffect(() => {
    const getBot = async () => {
      if (!router.query.phone) return;
      const botFromApi = await jullyApiService.getBot(
        authState.managerId,
        router.query.phone as string,
      );

      setBot(botFromApi);
    };

    getBot();
  }, [authState.managerId, router.query.phone]);

  if (router.isFallback)
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>;

  return (
    <>
      <Head>
        <title>Bot {bot?.name} | Jully Bot</title>
      </Head>
      <Backdrop open={pageIsLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DashboardLayout>
        <S.Wrapper>
          <S.Header>
            <h4>{bot?.name}</h4>
            <Chip
              size="small"
              variant="default"
              textColor="#fff"
              bgColor="#59C3C3"
              label={bot?.active ? 'Ativo' : 'Inativo'}
            />
          </S.Header>
        </S.Wrapper>
      </DashboardLayout>
    </>
  );
}
