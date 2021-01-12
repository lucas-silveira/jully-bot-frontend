import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CircularProgress, Divider } from '@material-ui/core';
import { useAuth } from '@context/auth';
import jullyApiService from '@services/jully-api.service';
import { randomId } from '@utils/random-id';
import DashboardLayout from '@layouts/dashboard';
import MinusSquare from '@components/squares/minus-square';
import PlusSquare from '@components/squares/plus-square';
import CloseSquare from '@components/squares/close-square';
import AnswersTree from '@components/bot/answers-tree';
import OpeningHoursTable from '@components/bot/opening-hours-table';
import ToastForm from '@components/toasts/toast-form';
import Icon from '@components/icons';
import { Backdrop } from '@styles/components/backdrop.style';
import { Chip } from '@styles/components/chip.style';
import * as S from '@styles/pages/bot.style';

type BotQuestion = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  sortNumber: number;
  text: string;
  answers: BotAnswer[];
};
type BotAnswer = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  optionNumber: number;
  text: string;
  questions: Array<{
    id: string;
    correlationId: string;
    ownCorrelationId: string;
    type: string;
    sortNumber: number;
    text: string;
    answers: any[];
  }>;
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
  managerId: number;
  sessionsId: number[];
  createdAt: string;
  updatedAt: string;
};
type BotTopic = {
  id: number;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  name: string;
  optionNumber: number;
  description: string;
  questions: BotQuestion[];
};
type BotTreeItem = {
  id: number | string;
  correlationId: string;
  type: string;
  optionNumber?: number;
  sortNumber?: number;
  questions?: BotQuestion[];
  answers?: BotAnswer[];
};

export default function Bot(): JSX.Element {
  const router = useRouter();
  const { authState } = useAuth();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [bot, setBot] = useState<Bot>({} as Bot);
  const [topics, setTopics] = useState<BotTopic[]>([]);
  const [backupTopics, setBackupTopics] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [expandedTreeItems, setExpandedTreeItems] = useState([]);
  const [botValidation, setBotValidation] = useState({
    validate: false,
    questionsWithoutAnswers: {
      ownCorrelationIds: [],
      spplitedCorrelationIds: [],
    },
  });
  const [toast, setToast] = useState({
    type: 'error',
    open: false,
    message: '',
  });

  const EDIT_MODE = useMemo(
    () => ({
      CONVERSATION: 'conversation',
      OPENING_HOURS: 'openingHours',
    }),
    [],
  );

  const TREE_ITEM_TYPE = useMemo(
    () => ({
      TOPIC: 'topic',
      QUESTION: 'question',
      ANSWER: 'answer',
    }),
    [],
  );

  useEffect(() => {
    if (!authState.accessToken) {
      router.push('/signin');
      return;
    }
    setPageIsLoading(false);

    const getBot = async () => {
      if (!router.query.phone) return;
      const {
        topics: TopicsFromApi,
        ...botFromApi
      } = await jullyApiService.getBot(
        authState.managerId,
        router.query.phone as string,
      );
      setBot(botFromApi);
      setTopics(TopicsFromApi);
      setBackupTopics(JSON.stringify(TopicsFromApi));
    };

    getBot();
  }, [router, authState.accessToken, authState.managerId, router.query.phone]);

  const handleToastClose = useCallback(() => {
    setToast(oldValue => ({ ...oldValue, open: false, message: '' }));
  }, []);

  const handleActiveEditMode = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      const eventTargetEditMode = event.currentTarget.dataset.editmode;
      setEditMode(eventTargetEditMode);
    },
    [],
  );

  const handleTreeItemTogle = useCallback((event, nodesIds) => {
    setExpandedTreeItems(nodesIds);
  }, []);

  const handleValidateBotConversation = useCallback(
    (itemCorrelationId: string) => {
      return (
        botValidation.validate &&
        botValidation.questionsWithoutAnswers.ownCorrelationIds.includes(
          itemCorrelationId,
        )
      );
    },
    [botValidation],
  );

  const handleSaveChanges = useCallback(() => {
    if (botValidation.questionsWithoutAnswers.ownCorrelationIds.length) {
      setBotValidation(oldValue => ({ ...oldValue, validate: true }));
      setExpandedTreeItems(oldValue => [
        ...new Set([
          ...oldValue,
          ...botValidation.questionsWithoutAnswers.spplitedCorrelationIds,
        ]),
      ]);
      return;
    }
    setEditMode(null);
    setBackupTopics(JSON.stringify(topics));
  }, [topics, botValidation.questionsWithoutAnswers]);

  const handleCancelChanges = useCallback(() => {
    setEditMode(null);
    setTopics(JSON.parse(backupTopics));
  }, [backupTopics]);

  const handleEditTreeItem = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
    },
    [],
  );

  const handleDeleteTreeItem = useCallback(
    (treeItem: BotTreeItem, parentTreeItem: BotTreeItem = null) => (
      event: React.MouseEvent<HTMLInputElement>,
    ) => {
      event.stopPropagation();

      switch (treeItem.type) {
        case TREE_ITEM_TYPE.TOPIC: {
          setTopics(oldValues =>
            oldValues.filter(topic => topic.id !== treeItem.id),
          );
          break;
        }
        case TREE_ITEM_TYPE.QUESTION: {
          parentTreeItem.questions = parentTreeItem.questions.filter(
            item => item.id !== treeItem.id,
          );
          setTopics([...topics]);
          break;
        }
        case TREE_ITEM_TYPE.ANSWER: {
          parentTreeItem.answers = parentTreeItem.answers.filter(
            item => item.id !== treeItem.id,
          );
          setTopics([...topics]);
          break;
        }
        default:
      }
    },
    [TREE_ITEM_TYPE, topics],
  );

  const handleAddTreeItem = useCallback(
    (treeItem: BotTreeItem) => (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
      const itemsNested = treeItem.correlationId.split('-').length;

      if (itemsNested === 5 && treeItem.type === TREE_ITEM_TYPE.ANSWER) {
        setToast({
          type: 'error',
          open: true,
          message: 'Você não pode adicionar mais perguntas.',
        });
        return;
      }

      switch (treeItem.type) {
        case TREE_ITEM_TYPE.TOPIC: {
          const ownCorrelationId = randomId(5);
          const spplitedCorrelationIds = treeItem.correlationId.split('-');
          const correlationId = `${treeItem.correlationId}-${ownCorrelationId}`;
          const { questions } = treeItem;
          const sortNumber = questions.length
            ? questions[questions.length - 1].sortNumber + 1
            : 1;

          treeItem.questions.push({
            id: ownCorrelationId + Date.now(),
            correlationId,
            ownCorrelationId,
            type: TREE_ITEM_TYPE.QUESTION,
            sortNumber,
            text: 'Insira a sua pergunta',
            answers: [],
          });

          setTopics([...topics]);
          setBotValidation(oldValue => ({
            ...oldValue,
            questionsWithoutAnswers: {
              ownCorrelationIds: [
                ...oldValue.questionsWithoutAnswers.ownCorrelationIds,
                ownCorrelationId,
              ],
              spplitedCorrelationIds,
            },
          }));
          setExpandedTreeItems(oldValue => [
            ...new Set([...oldValue, ...spplitedCorrelationIds]),
          ]);

          break;
        }
        case TREE_ITEM_TYPE.QUESTION: {
          const ownCorrelationId = randomId(5);
          const parentCorrelationId = treeItem.correlationId.split('-').pop();
          const spplitedCorrelationIds = treeItem.correlationId.split('-');
          const correlationId = `${treeItem.correlationId}-${ownCorrelationId}`;
          const { answers } = treeItem;
          const optionNumber = answers.length
            ? answers[answers.length - 1].optionNumber + 1
            : 1;

          treeItem.answers.push({
            id: ownCorrelationId + Date.now(),
            correlationId,
            ownCorrelationId,
            type: TREE_ITEM_TYPE.ANSWER,
            optionNumber,
            text: 'Insira a resposta',
            questions: [],
          });

          setTopics([...topics]);
          setExpandedTreeItems(oldValue => [
            ...new Set([...oldValue, ...spplitedCorrelationIds]),
          ]);
          setBotValidation(oldValue => ({
            ...oldValue,
            questionsWithoutAnswers: {
              ...oldValue.questionsWithoutAnswers,
              ownCorrelationIds: oldValue.questionsWithoutAnswers.ownCorrelationIds.filter(
                coId => coId !== parentCorrelationId,
              ),
            },
          }));

          break;
        }
        case TREE_ITEM_TYPE.ANSWER: {
          const ownCorrelationId = randomId(5);
          const spplitedCorrelationIds = treeItem.correlationId.split('-');
          const correlationId = `${treeItem.correlationId}-${ownCorrelationId}`;
          const { questions } = treeItem;
          const sortNumber = questions.length
            ? questions[questions.length - 1].sortNumber + 1
            : 1;

          treeItem.questions.push({
            id: ownCorrelationId + Date.now(),
            correlationId,
            ownCorrelationId,
            type: TREE_ITEM_TYPE.QUESTION,
            sortNumber,
            text: 'Insira a sua pergunta',
            answers: [],
          });

          setTopics([...topics]);
          setBotValidation(oldValue => ({
            ...oldValue,
            questionsWithoutAnswers: {
              ownCorrelationIds: [
                ...oldValue.questionsWithoutAnswers.ownCorrelationIds,
                ownCorrelationId,
              ],
              spplitedCorrelationIds,
            },
          }));
          setExpandedTreeItems(oldValue => [
            ...new Set([...oldValue, ...spplitedCorrelationIds]),
          ]);

          break;
        }
        default:
      }
    },
    [TREE_ITEM_TYPE, topics],
  );

  return (
    <>
      <Head>
        <title>Bot {bot?.name} | Jully Bot</title>
      </Head>
      <Backdrop open={pageIsLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToastForm
        type={toast.type as any}
        toast={{ open: toast.open, message: toast.message }}
        handleClose={handleToastClose}
      />
      <DashboardLayout>
        <S.Wrapper>
          <S.Header>
            <h4>{bot.name}</h4>
            <Chip
              size="small"
              variant="default"
              $textColor="#fff"
              $bgColor="#59C3C3"
              label={bot.active ? 'Ativo' : 'Inativo'}
            />
          </S.Header>
          <Divider light />
          <S.Main>
            <S.SessionConversation>
              <header>
                <h5>Fluxo de conversa</h5>
                {editMode === EDIT_MODE.CONVERSATION ? (
                  <>
                    <S.Button
                      size="small"
                      $styleType="save"
                      onClick={handleSaveChanges}
                    >
                      Salvar alterações
                    </S.Button>
                    <S.Button
                      size="small"
                      $styleType="cancel"
                      onClick={handleCancelChanges}
                    >
                      Cancelar
                    </S.Button>
                  </>
                ) : (
                  <S.Button
                    size="small"
                    $styleType="edit"
                    data-editmode={EDIT_MODE.CONVERSATION}
                    onClick={handleActiveEditMode}
                  >
                    <Icon name="edit" color="#84a98c" fontSize="small" />
                    Editar
                  </S.Button>
                )}
              </header>
              <S.TreeView
                expanded={expandedTreeItems}
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                onNodeToggle={handleTreeItemTogle}
              >
                {topics?.map(topic => (
                  <S.TreeItem
                    key={topic.id}
                    nodeId={topic.ownCorrelationId}
                    $isInvalid={handleValidateBotConversation(
                      topic.ownCorrelationId,
                    )}
                    label={
                      <S.TreeLabel>
                        <div>{topic.name}</div>
                        {editMode === EDIT_MODE.CONVERSATION ? (
                          <>
                            <S.Button
                              size="small"
                              $styleType="icon"
                              onClick={handleEditTreeItem}
                            >
                              <Icon
                                name="edit"
                                color="#84a98c"
                                fontSize="small"
                              />
                            </S.Button>
                            <S.Button
                              size="small"
                              $styleType="icon"
                              onClick={handleAddTreeItem(topic)}
                            >
                              <Icon
                                name="add"
                                color="#84a98c"
                                fontSize="small"
                              />
                            </S.Button>
                            <S.Button
                              size="small"
                              $styleType="icon"
                              onClick={handleDeleteTreeItem(topic)}
                            >
                              <Icon
                                name="delete"
                                color="#84a98c"
                                fontSize="small"
                              />
                            </S.Button>
                          </>
                        ) : (
                          <span>Tópico</span>
                        )}
                      </S.TreeLabel>
                    }
                  >
                    {topic.questions.map(question => (
                      <S.TreeItem
                        key={question.id}
                        nodeId={question.ownCorrelationId}
                        $isInvalid={handleValidateBotConversation(
                          question.ownCorrelationId,
                        )}
                        label={
                          <S.TreeLabel>
                            <div>{question.text}</div>
                            {editMode === EDIT_MODE.CONVERSATION ? (
                              <>
                                <S.Button
                                  size="small"
                                  $styleType="icon"
                                  onClick={handleEditTreeItem}
                                >
                                  <Icon
                                    name="edit"
                                    color="#84a98c"
                                    fontSize="small"
                                  />
                                </S.Button>
                                <S.Button
                                  size="small"
                                  $styleType="icon"
                                  onClick={handleAddTreeItem(question)}
                                >
                                  <Icon
                                    name="add"
                                    color="#84a98c"
                                    fontSize="small"
                                  />
                                </S.Button>
                                <S.Button
                                  size="small"
                                  $styleType="icon"
                                  onClick={handleDeleteTreeItem(
                                    question,
                                    topic,
                                  )}
                                >
                                  <Icon
                                    name="delete"
                                    color="#84a98c"
                                    fontSize="small"
                                  />
                                </S.Button>
                              </>
                            ) : (
                              <span>Pergunta</span>
                            )}
                          </S.TreeLabel>
                        }
                      >
                        <AnswersTree
                          answers={question.answers}
                          parentAnswers={question}
                          editMode={editMode === EDIT_MODE.CONVERSATION}
                          botValidator={handleValidateBotConversation}
                          editTreeItem={handleEditTreeItem}
                          addTreeItem={handleAddTreeItem}
                          deleteTreeItem={handleDeleteTreeItem}
                        />
                      </S.TreeItem>
                    ))}
                  </S.TreeItem>
                ))}
              </S.TreeView>
            </S.SessionConversation>
            <S.SessionDetails>
              <div>
                <header>
                  <h5>Visão geral</h5>
                </header>
                <div>
                  <p>Sessões: {bot.sessionsId?.length}</p>
                  <p>Mensagens: 100</p>
                </div>
              </div>
              <div>
                <header>
                  <h5>Horários de atendimento</h5>
                  {editMode === EDIT_MODE.OPENING_HOURS ? (
                    <>
                      <S.Button
                        size="small"
                        $styleType="save"
                        onClick={handleSaveChanges}
                      >
                        Salvar alterações
                      </S.Button>
                      <S.Button
                        size="small"
                        $styleType="cancel"
                        onClick={handleCancelChanges}
                      >
                        Cancelar
                      </S.Button>
                    </>
                  ) : (
                    <S.Button
                      size="small"
                      $styleType="edit"
                      data-editmode={EDIT_MODE.OPENING_HOURS}
                      onClick={handleActiveEditMode}
                    >
                      <Icon name="edit" color="#84a98c" fontSize="small" />
                      Editar
                    </S.Button>
                  )}
                </header>
              </div>
              <div>
                <OpeningHoursTable data={bot.openingHours} />
              </div>
            </S.SessionDetails>
          </S.Main>
        </S.Wrapper>
      </DashboardLayout>
    </>
  );
}
