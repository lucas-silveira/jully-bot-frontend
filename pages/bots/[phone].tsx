import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CircularProgress } from '@material-ui/core';

import { Backdrop } from '@styles/components/backdrop.style';
import DashboardLayout from '@layouts/dashboard';
import jullyApiService from '@services/jully-api.service';
import * as S from '@styles/pages/bot.style';
import { Chip } from '@styles/components/chip.style';
import { useAuth } from '@context/auth';
import MinusSquare from '@components/squares/minus-square';
import PlusSquare from '@components/squares/plus-square';
import CloseSquare from '@components/squares/close-square';

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

    const getBot = async () => {
      if (!router.query.phone) return;
      const botFromApi = await jullyApiService.getBot(
        authState.managerId,
        router.query.phone as string,
      );

      setBot(botFromApi);
    };

    getBot();
  }, [router, authState.accessToken, authState.managerId, router.query.phone]);

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
              $textColor="#fff"
              $bgColor="#59C3C3"
              label={bot?.active ? 'Ativo' : 'Inativo'}
            />
          </S.Header>
          <S.Main>
            <S.TreeView
              defaultExpanded={['1']}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              defaultEndIcon={<CloseSquare />}
            >
              <S.TreeItem nodeId="1" label="Main">
                <S.TreeItem nodeId="2" label="Hello" />
                <S.TreeItem nodeId="3" label="Subtree with children">
                  <S.TreeItem nodeId="6" label="Hello" />
                  <S.TreeItem nodeId="7" label="Sub-subtree with children">
                    <S.TreeItem nodeId="9" label="Child 1" />
                    <S.TreeItem nodeId="10" label="Child 2" />
                    <S.TreeItem nodeId="11" label="Child 3" />
                  </S.TreeItem>
                  <S.TreeItem nodeId="8" label="Hello" />
                </S.TreeItem>
                <S.TreeItem nodeId="4" label="World" />
                <S.TreeItem nodeId="5" label="Something something" />
              </S.TreeItem>
            </S.TreeView>
          </S.Main>
        </S.Wrapper>
      </DashboardLayout>
    </>
  );
}
