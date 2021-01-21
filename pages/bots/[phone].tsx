import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
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
import Popover from '@components/bot/popover';
import TreeLabel from '@components/bot/answers-tree/tree-label';
import DynamicTreeLabel from '@components/bot/answers-tree/dynamic-tree-label';
import { CONVERSATION_ITEM_TYPE } from '@utils/conversation-item-type.enum';
import { DYNAMIC_ANSWERS_TYPE } from '@utils/dynamic-answers-type.enum';
import { TRIGGER_NAMES } from '@utils/trigger-names.enum';
import { APP_TYPES } from '@utils/app-types.enum';

type BotDynamicAnswer = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  dynamicType: string;
  triggerName: string;
  text: string;
};
type BotQuestion = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  sortNumber: number;
  text: string;
  answers: BotAnswer[];
  dynamicAnswer: BotDynamicAnswer;
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
    dynamicAnswer: BotDynamicAnswer;
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
  ownCorrelationId: string;
  type: string;
  name?: string;
  text?: string;
  optionNumber?: number;
  sortNumber?: number;
  triggerName: string;
  questions?: BotQuestion[];
  answers?: BotAnswer[];
  dynamicAnswer?: BotDynamicAnswer;
};
type Application = {
  id: number;
  name: string;
  type: string;
  title: string;
  description: string;
  banner: string;
  icon: string;
};

const popoverDuration = 3000;
const charactersLimit = 100;

export default function Bot(): JSX.Element {
  const router = useRouter();
  const { authState } = useAuth();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [sendingBot, setSendingBot] = useState(false);
  const [toast, setToast] = useState({
    type: 'error',
    open: false,
    message: '',
  });
  const treeItemRef = useRef({});
  const treeItemInputLabelRef = useRef({});
  const [openPopover, setOpenPopover] = useState([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [bot, setBot] = useState<Bot>({} as Bot);
  const [topics, setTopics] = useState<BotTopic[]>([]);
  const [backupTopics, setBackupTopics] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editTreeItemLabel, setEditTreeItemLabel] = useState({
    active: null,
    value: '',
  });
  const [expandedTreeItems, setExpandedTreeItems] = useState([]);
  const [botValidation, setBotValidation] = useState({
    validate: false,
    questionsWithoutAnswers: {
      ownCorrelationIds: [],
      spplitedCorrelationIds: [],
    },
  });

  const EDIT_MODE = useMemo(
    () => ({
      CONVERSATION: 'conversation',
      OPENING_HOURS: 'openingHours',
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
      try {
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
      } catch (err) {
        setToast({
          type: 'error',
          open: true,
          message: 'Houve um erro ao tentar obter o bot.',
        });
      }
    };

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
    getBot();
  }, [router, authState]);

  useEffect(() => {
    treeItemInputLabelRef.current[editTreeItemLabel.active]?.focus();
  }, [editTreeItemLabel.active]);

  const triggerApps = useMemo(() => {
    return apps.filter(app => app.type === APP_TYPES.TRIGGER);
  }, [apps]);

  const handleToastClose = useCallback(() => {
    setToast(oldValue => ({ ...oldValue, open: false, message: '' }));
  }, []);

  const handleSetItemRef = useCallback(
    (topicId: string) => (element: HTMLElement) => {
      treeItemRef.current[topicId] = element;
    },
    [],
  );

  const handleSetItemInputLabelRef = useCallback(
    (topicId: string) => (element: HTMLElement) => {
      treeItemInputLabelRef.current[topicId] = element;
    },
    [],
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover([]);
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

  const handleBotSubmit = useCallback(async () => {
    try {
      setSendingBot(true);
      await jullyApiService.updateBot(authState.managerId, {
        ...bot,
        topics,
      });
      setSendingBot(false);
    } catch (err) {
      setSendingBot(false);
      setToast({
        type: 'error',
        open: true,
        message:
          err.response?.data.message ||
          'Ops! Algo deu errado ao salvar o bot. Tente novamente.',
      });
    }
  }, [authState, bot, topics]);

  const handleSaveChanges = useCallback(() => {
    if (botValidation.questionsWithoutAnswers.ownCorrelationIds.length) {
      setBotValidation(oldValue => ({ ...oldValue, validate: true }));
      setExpandedTreeItems(oldValue => [
        ...new Set([
          ...oldValue,
          ...botValidation.questionsWithoutAnswers.spplitedCorrelationIds,
        ]),
      ]);
      setOpenPopover(botValidation.questionsWithoutAnswers.ownCorrelationIds);
      setTimeout(() => handleClosePopover(), popoverDuration);
      return;
    }
    setEditMode(null);
    setEditTreeItemLabel({ active: false, value: '' });
    setBackupTopics(JSON.stringify(topics));
    handleBotSubmit();
  }, [
    topics,
    botValidation.questionsWithoutAnswers,
    handleClosePopover,
    handleBotSubmit,
  ]);

  const handleCancelChanges = useCallback(() => {
    setEditMode(null);
    setEditTreeItemLabel({ active: false, value: '' });
    setTopics(JSON.parse(backupTopics));
  }, [backupTopics]);

  const handleAddTrigger = useCallback(
    (answer: BotTreeItem, triggerName: TRIGGER_NAMES) => {
      answer.triggerName = triggerName;

      setTopics([...topics]);
    },
    [topics],
  );

  const handleAddTopic = useCallback(() => {
    const ownCorrelationId = randomId(5);
    const newTopic = {
      correlationId: ownCorrelationId,
      ownCorrelationId,
      type: CONVERSATION_ITEM_TYPE.TOPIC,
      name: 'Tópico vazio',
      description: '',
      questions: [],
    };
    setTopics(oldValue => [
      ...oldValue,
      {
        ...newTopic,
        id: oldValue[oldValue.length - 1].id + 1,
        optionNumber: oldValue[oldValue.length - 1].optionNumber + 1,
      },
    ]);
    setBotValidation(oldValue => ({
      ...oldValue,
      questionsWithoutAnswers: {
        ownCorrelationIds: [
          ...oldValue.questionsWithoutAnswers.ownCorrelationIds,
          newTopic.ownCorrelationId,
        ],
        spplitedCorrelationIds: [
          ...new Set([
            ...oldValue.questionsWithoutAnswers.spplitedCorrelationIds,
            newTopic.ownCorrelationId,
          ]),
        ],
      },
    }));
  }, []);

  const handleAddAnswer = useCallback(
    (question: BotTreeItem) => (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();

      if (question.dynamicAnswer) {
        setToast({
          type: 'error',
          open: true,
          message: 'Você só pode adicionar uma resposta dinâmica.',
        });
        return;
      }

      const ownCorrelationId = randomId(5);
      const parentCorrelationId = question.correlationId.split('-').pop();
      const spplitedCorrelationIds = question.correlationId.split('-');
      const correlationId = `${question.correlationId}-${ownCorrelationId}`;
      const { answers } = question;
      const optionNumber = answers.length
        ? answers[answers.length - 1].optionNumber + 1
        : 1;

      question.answers.push({
        id: uuidv4(),
        correlationId,
        ownCorrelationId,
        type: CONVERSATION_ITEM_TYPE.ANSWER,
        optionNumber,
        text: 'Insira a resposta',
        questions: [],
      });

      setTopics([...topics]);
      setBotValidation(oldValue => ({
        ...oldValue,
        questionsWithoutAnswers: {
          ...oldValue.questionsWithoutAnswers,
          ownCorrelationIds: oldValue.questionsWithoutAnswers.ownCorrelationIds.filter(
            coId => coId !== parentCorrelationId,
          ),
        },
      }));
      setExpandedTreeItems(oldValue => [
        ...new Set([...oldValue, ...spplitedCorrelationIds]),
      ]);
    },
    [topics],
  );

  const handleAddDynamicAnswer = useCallback(
    (question: BotTreeItem, type: DYNAMIC_ANSWERS_TYPE) => (
      event: React.MouseEvent<HTMLInputElement>,
    ) => {
      event.stopPropagation();

      if (question.dynamicAnswer) {
        setToast({
          type: 'error',
          open: true,
          message: 'Você só pode adicionar uma resposta dinâmica.',
        });
        return;
      }

      if (question.answers.length) {
        setToast({
          type: 'error',
          open: true,
          message: 'Você não pode adicionar uma resposta dinâmica aqui.',
        });
        return;
      }

      const ownCorrelationId = randomId(5);
      const parentCorrelationId = question.correlationId.split('-').pop();
      const spplitedCorrelationIds = question.correlationId.split('-');
      const correlationId = `${question.correlationId}-${ownCorrelationId}`;

      question.dynamicAnswer = {
        id: uuidv4(),
        correlationId,
        ownCorrelationId,
        type: CONVERSATION_ITEM_TYPE.ANSWER,
        dynamicType: type,
        triggerName: null,
        text: 'Resposta dinâmica: Data',
      };

      setTopics([...topics]);
      setBotValidation(oldValue => ({
        ...oldValue,
        questionsWithoutAnswers: {
          ...oldValue.questionsWithoutAnswers,
          ownCorrelationIds: oldValue.questionsWithoutAnswers.ownCorrelationIds.filter(
            coId => coId !== parentCorrelationId,
          ),
        },
      }));
      setExpandedTreeItems(oldValue => [
        ...new Set([...oldValue, ...spplitedCorrelationIds]),
      ]);
    },
    [topics],
  );

  const handleAddQuestion = useCallback(
    (treeItem: BotTreeItem) => (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();

      const itemsNested = treeItem.correlationId.split('-').length;

      if (itemsNested === 5) {
        setToast({
          type: 'error',
          open: true,
          message: 'Você não pode adicionar mais perguntas.',
        });
        return;
      }

      const ownCorrelationId = randomId(5);
      const spplitedCorrelationIds = treeItem.correlationId.split('-');
      const correlationId = `${treeItem.correlationId}-${ownCorrelationId}`;
      const { questions } = treeItem;
      const sortNumber = questions.length
        ? questions[questions.length - 1].sortNumber + 1
        : 1;

      treeItem.questions.push({
        id: uuidv4(),
        correlationId,
        ownCorrelationId,
        type: CONVERSATION_ITEM_TYPE.QUESTION,
        sortNumber,
        text: 'Insira a sua pergunta',
        answers: [],
        dynamicAnswer: null,
      });

      setTopics([...topics]);
      setBotValidation(oldValue => ({
        ...oldValue,
        questionsWithoutAnswers: {
          ownCorrelationIds: [
            ...oldValue.questionsWithoutAnswers.ownCorrelationIds.filter(
              coId => coId !== treeItem.ownCorrelationId,
            ),
            ownCorrelationId,
          ],
          spplitedCorrelationIds: [
            ...new Set([
              ...oldValue.questionsWithoutAnswers.spplitedCorrelationIds,
              ...spplitedCorrelationIds,
            ]),
          ],
        },
      }));
      setExpandedTreeItems(oldValue => [
        ...new Set([...oldValue, ...spplitedCorrelationIds]),
      ]);
    },
    [topics],
  );

  const handleEditTreeItem = useCallback(
    (treeItem: BotTreeItem) => (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
      setEditTreeItemLabel({
        active: treeItem.ownCorrelationId,
        value:
          treeItem.type === CONVERSATION_ITEM_TYPE.TOPIC
            ? treeItem.name
            : treeItem.text,
      });
    },
    [],
  );

  const handleDeleteTopic = useCallback(
    (topic: BotTopic) => (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();

      setTopics(oldValues => oldValues.filter(tp => tp.id !== topic.id));
      setBotValidation(oldValue => ({
        ...oldValue,
        questionsWithoutAnswers: {
          ...oldValue.questionsWithoutAnswers,
          ownCorrelationIds: [
            ...oldValue.questionsWithoutAnswers.ownCorrelationIds.filter(
              coId => coId !== topic.ownCorrelationId,
            ),
          ],
        },
      }));
    },
    [],
  );

  const handleDeleteQuestion = useCallback(
    (question: BotQuestion, parentQuestion: BotTreeItem = null) => (
      event: React.MouseEvent<HTMLInputElement>,
    ) => {
      event.stopPropagation();

      parentQuestion.questions = parentQuestion.questions.filter(
        item => item.id !== question.id,
      );
      setTopics([...topics]);
      if (
        parentQuestion.type === CONVERSATION_ITEM_TYPE.TOPIC &&
        !parentQuestion.questions.length
      ) {
        setBotValidation(oldValue => ({
          ...oldValue,
          questionsWithoutAnswers: {
            ownCorrelationIds: [
              ...oldValue.questionsWithoutAnswers.ownCorrelationIds.filter(
                coId => coId !== question.ownCorrelationId,
              ),
              parentQuestion.ownCorrelationId,
            ],
            spplitedCorrelationIds: [
              ...new Set([
                ...oldValue.questionsWithoutAnswers.spplitedCorrelationIds,
                ...parentQuestion.correlationId.split('-'),
              ]),
            ],
          },
        }));
      } else {
        setBotValidation(oldValue => ({
          ...oldValue,
          questionsWithoutAnswers: {
            ...oldValue.questionsWithoutAnswers,
            ownCorrelationIds: oldValue.questionsWithoutAnswers.ownCorrelationIds.filter(
              coId => coId !== question.ownCorrelationId,
            ),
          },
        }));
      }
    },
    [topics],
  );

  const handleDeleteAnswer = useCallback(
    (
      answer: BotAnswer | BotDynamicAnswer,
      parentAnswer: BotQuestion = null,
    ) => (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();

      if (parentAnswer.dynamicAnswer) parentAnswer.dynamicAnswer = null;
      else
        parentAnswer.answers = parentAnswer.answers.filter(
          item => item.id !== answer.id,
        );
      setTopics([...topics]);

      if (!parentAnswer.answers.length && !parentAnswer.dynamicAnswer) {
        setBotValidation(oldValue => ({
          ...oldValue,
          questionsWithoutAnswers: {
            ownCorrelationIds: [
              ...oldValue.questionsWithoutAnswers.ownCorrelationIds,
              parentAnswer.ownCorrelationId,
            ],
            spplitedCorrelationIds: [
              ...new Set([
                ...oldValue.questionsWithoutAnswers.spplitedCorrelationIds,
                ...parentAnswer.correlationId.split('-'),
              ]),
            ],
          },
        }));
      }
    },
    [topics],
  );

  const handleChangeTreeItemInputLabel = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length === charactersLimit) return;

      setEditTreeItemLabel(oldValue => ({
        ...oldValue,
        value: event.target.value,
      }));
    },
    [],
  );

  const handleSaveTreeItemInputLabel = useCallback(
    (treeItem: BotTreeItem) => (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();

      switch (treeItem.type) {
        case CONVERSATION_ITEM_TYPE.TOPIC: {
          treeItem.name = editTreeItemLabel.value;
          setTopics([...topics]);
          break;
        }
        case CONVERSATION_ITEM_TYPE.QUESTION:
        case CONVERSATION_ITEM_TYPE.ANSWER: {
          treeItem.text = editTreeItemLabel.value;
          setTopics([...topics]);
          break;
        }
        default:
      }

      setEditTreeItemLabel({
        active: null,
        value: null,
      });
    },
    [editTreeItemLabel.value, topics],
  );

  const handleCancelTreeItemInputLabel = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();

      setEditTreeItemLabel({
        active: null,
        value: null,
      });
    },
    [],
  );

  return (
    <>
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
      </>
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
                      {sendingBot ? (
                        <CircularProgress size={12} color="inherit" />
                      ) : (
                        'Salvar alterações'
                      )}
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
                  <div key={topic.id}>
                    <S.TreeItem
                      ref={handleSetItemRef(topic.ownCorrelationId)}
                      nodeId={topic.ownCorrelationId}
                      $isInvalid={handleValidateBotConversation(
                        topic.ownCorrelationId,
                      )}
                      label={
                        <TreeLabel
                          label="Tópico"
                          treeItem={topic}
                          editMode={editMode === EDIT_MODE.CONVERSATION}
                          editTreeItemLabel={editTreeItemLabel}
                          editTreeItem={handleEditTreeItem}
                          addTreeItem={handleAddQuestion}
                          deleteTreeItem={handleDeleteTopic}
                          addTrigger={handleAddTrigger}
                          setItemInputLabelRef={handleSetItemInputLabelRef}
                          changeTreeItemInputLabel={
                            handleChangeTreeItemInputLabel
                          }
                          saveTreeItemInputLabel={handleSaveTreeItemInputLabel}
                          cancelTreeItemInputLabel={
                            handleCancelTreeItemInputLabel
                          }
                        />
                      }
                    >
                      {topic.questions.map(question => (
                        <div key={question.id}>
                          <S.TreeItem
                            ref={handleSetItemRef(question.ownCorrelationId)}
                            nodeId={question.ownCorrelationId}
                            $isInvalid={handleValidateBotConversation(
                              question.ownCorrelationId,
                            )}
                            label={
                              <TreeLabel
                                label="Pergunta"
                                treeItem={question}
                                parentTreeItem={topic}
                                editMode={editMode === EDIT_MODE.CONVERSATION}
                                editTreeItemLabel={editTreeItemLabel}
                                addTreeItem={handleAddAnswer}
                                addDynamicAnswer={handleAddDynamicAnswer}
                                editTreeItem={handleEditTreeItem}
                                deleteTreeItem={handleDeleteQuestion}
                                addTrigger={handleAddTrigger}
                                setItemInputLabelRef={
                                  handleSetItemInputLabelRef
                                }
                                changeTreeItemInputLabel={
                                  handleChangeTreeItemInputLabel
                                }
                                saveTreeItemInputLabel={
                                  handleSaveTreeItemInputLabel
                                }
                                cancelTreeItemInputLabel={
                                  handleCancelTreeItemInputLabel
                                }
                              />
                            }
                          >
                            {question.dynamicAnswer ? (
                              <S.TreeItem
                                key={question.dynamicAnswer.id}
                                ref={handleSetItemRef(
                                  question.dynamicAnswer.ownCorrelationId,
                                )}
                                nodeId={question.dynamicAnswer.ownCorrelationId}
                                type="dynamic"
                                label={
                                  <DynamicTreeLabel
                                    label="Resposta"
                                    dynamicAnswer={question.dynamicAnswer}
                                    question={question}
                                    editMode={
                                      editMode === EDIT_MODE.CONVERSATION
                                    }
                                    editTreeItemLabel={editTreeItemLabel}
                                    deleteAnswer={handleDeleteAnswer}
                                    addTrigger={handleAddTrigger}
                                    apps={triggerApps}
                                    setItemInputLabelRef={
                                      handleSetItemInputLabelRef
                                    }
                                    changeTreeItemInputLabel={
                                      handleChangeTreeItemInputLabel
                                    }
                                  />
                                }
                              />
                            ) : (
                              <AnswersTree
                                answers={question.answers}
                                parentAnswers={question}
                                apps={triggerApps}
                                treeItemRef={treeItemRef}
                                handleSetItemRef={handleSetItemRef}
                                openPopover={openPopover}
                                onPopoverClose={handleClosePopover}
                                editMode={editMode === EDIT_MODE.CONVERSATION}
                                botValidator={handleValidateBotConversation}
                                addQuestion={handleAddQuestion}
                                addAnswer={handleAddAnswer}
                                addDynamicAnswer={handleAddDynamicAnswer}
                                editTreeItem={handleEditTreeItem}
                                deleteQuestion={handleDeleteQuestion}
                                deleteAnswer={handleDeleteAnswer}
                                addTrigger={handleAddTrigger}
                                editTreeItemLabel={editTreeItemLabel}
                                setItemInputLabelRef={
                                  handleSetItemInputLabelRef
                                }
                                changeTreeItemInputLabel={
                                  handleChangeTreeItemInputLabel
                                }
                                saveTreeItemInputLabel={
                                  handleSaveTreeItemInputLabel
                                }
                                cancelTreeItemInputLabel={
                                  handleCancelTreeItemInputLabel
                                }
                              />
                            )}
                          </S.TreeItem>
                          <Popover
                            id={question.ownCorrelationId}
                            anchorEl={
                              treeItemRef.current[question.ownCorrelationId]
                            }
                            open={openPopover.includes(
                              question.ownCorrelationId,
                            )}
                            onClose={handleClosePopover}
                            message="Adicione pelo menos uma resposta."
                          />
                        </div>
                      ))}
                    </S.TreeItem>
                    <Popover
                      id={topic.ownCorrelationId}
                      anchorEl={treeItemRef.current[topic.ownCorrelationId]}
                      open={openPopover.includes(topic.ownCorrelationId)}
                      onClose={handleClosePopover}
                      message="Adicione pelo menos uma pergunta."
                    />
                  </div>
                ))}
                {editMode === EDIT_MODE.CONVERSATION && (
                  <S.TreeItem
                    type="new"
                    label="Adicione um novo tópico"
                    nodeId="1"
                    onLabelClick={handleAddTopic}
                  />
                )}
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
