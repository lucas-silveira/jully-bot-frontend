import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import Popover from '@components/bot/popover';

type BotDynamicAnswer = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  dynamicType: string;
  triggerName: string;
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
  questions?: BotQuestion[];
  answers?: BotAnswer[];
  dynamicAnswer?: BotDynamicAnswer;
};

const popoverDuration = 3000;
const charactersLimit = 100;

export default function Bot(): JSX.Element {
  const router = useRouter();
  const { authState } = useAuth();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [toast, setToast] = useState({
    type: 'error',
    open: false,
    message: '',
  });
  const treeItemRef = useRef({});
  const treeItemInputLabelRef = useRef({});
  const [openPopover, setOpenPopover] = useState([]);
  const [bot, setBot] = useState<Bot>({} as Bot);
  const [topics, setTopics] = useState<BotTopic[]>([]);
  const [backupTopics, setBackupTopics] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editTreeItemLabel, setEditTreeItemLabel] = useState({
    active: null,
    value: 'teste',
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

    getBot();
  }, [router, authState.accessToken, authState.managerId, router.query.phone]);

  useEffect(() => {
    treeItemInputLabelRef.current[editTreeItemLabel.active]?.focus();
  }, [editTreeItemLabel.active]);

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
    setBackupTopics(JSON.stringify(topics));
  }, [topics, botValidation.questionsWithoutAnswers, handleClosePopover]);

  const handleCancelChanges = useCallback(() => {
    setEditMode(null);
    setTopics(JSON.parse(backupTopics));
  }, [backupTopics]);

  const handleAddTopic = useCallback(() => {
    const ownCorrelationId = randomId(5);
    const newTopic = {
      correlationId: ownCorrelationId,
      ownCorrelationId,
      type: TREE_ITEM_TYPE.TOPIC,
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
  }, [TREE_ITEM_TYPE]);

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
        id: ownCorrelationId + Date.now(),
        correlationId,
        ownCorrelationId,
        type: TREE_ITEM_TYPE.ANSWER,
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
    [TREE_ITEM_TYPE, topics],
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
        id: ownCorrelationId + Date.now(),
        correlationId,
        ownCorrelationId,
        type: TREE_ITEM_TYPE.QUESTION,
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
    [TREE_ITEM_TYPE, topics],
  );

  const handleEditTreeItem = useCallback(
    (treeItem: BotTreeItem) => (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
      setEditTreeItemLabel({
        active: treeItem.ownCorrelationId,
        value:
          treeItem.type === TREE_ITEM_TYPE.TOPIC
            ? treeItem.name
            : treeItem.text,
      });
    },
    [TREE_ITEM_TYPE],
  );

  const handleDeleteTopic = useCallback(
    (topic: BotTopic) => (event: React.MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();

      setTopics(oldValues => oldValues.filter(tp => tp.id !== treeItem.id));
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
        parentQuestion.type === TREE_ITEM_TYPE.TOPIC &&
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
    [TREE_ITEM_TYPE, topics],
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
        case TREE_ITEM_TYPE.TOPIC: {
          treeItem.name = editTreeItemLabel.value;
          setTopics([...topics]);
          break;
        }
        case TREE_ITEM_TYPE.QUESTION:
        case TREE_ITEM_TYPE.ANSWER: {
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
    [TREE_ITEM_TYPE, editTreeItemLabel.value, topics],
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
                  <div key={topic.id}>
                    <S.TreeItem
                      ref={handleSetItemRef(topic.ownCorrelationId)}
                      nodeId={topic.ownCorrelationId}
                      $isInvalid={handleValidateBotConversation(
                        topic.ownCorrelationId,
                      )}
                      label={
                        <S.TreeLabel>
                          <div>
                            {editTreeItemLabel.active ===
                            topic.ownCorrelationId ? (
                              <S.InputLabel
                                ref={handleSetItemInputLabelRef(
                                  topic.ownCorrelationId,
                                )}
                                value={editTreeItemLabel.value}
                                onChange={handleChangeTreeItemInputLabel}
                                onClick={event => event.stopPropagation()}
                              />
                            ) : (
                              topic.name
                            )}
                          </div>
                          {editMode === EDIT_MODE.CONVERSATION ? (
                            <>
                              {editTreeItemLabel.active ===
                              topic.ownCorrelationId ? (
                                <>
                                  <S.Button
                                    size="small"
                                    $styleType="icon"
                                    onClick={handleSaveTreeItemInputLabel(
                                      topic,
                                    )}
                                  >
                                    <Icon
                                      name="save"
                                      color="#84a98c"
                                      fontSize="small"
                                    />
                                  </S.Button>
                                  <S.Button
                                    size="small"
                                    $styleType="icon"
                                    onClick={handleCancelTreeItemInputLabel}
                                  >
                                    <Icon
                                      name="cancel"
                                      color="#84a98c"
                                      fontSize="small"
                                    />
                                  </S.Button>
                                </>
                              ) : (
                                <>
                                  <S.Button
                                    size="small"
                                    $styleType="icon"
                                    onClick={handleEditTreeItem(topic)}
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
                                    onClick={handleAddQuestion(topic)}
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
                                    onClick={handleDeleteTopic(topic)}
                                  >
                                    <Icon
                                      name="delete"
                                      color="#84a98c"
                                      fontSize="small"
                                    />
                                  </S.Button>
                                </>
                              )}
                            </>
                          ) : (
                            <span>Tópico</span>
                          )}
                        </S.TreeLabel>
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
                              <S.TreeLabel>
                                <div>
                                  {editTreeItemLabel.active ===
                                  question.ownCorrelationId ? (
                                    <S.InputLabel
                                      ref={handleSetItemInputLabelRef(
                                        question.ownCorrelationId,
                                      )}
                                      value={editTreeItemLabel.value}
                                      onChange={handleChangeTreeItemInputLabel}
                                      onClick={event => event.stopPropagation()}
                                    />
                                  ) : (
                                    question.text
                                  )}
                                </div>
                                {editMode === EDIT_MODE.CONVERSATION ? (
                                  <>
                                    {editTreeItemLabel.active ===
                                    question.ownCorrelationId ? (
                                      <>
                                        <S.Button
                                          size="small"
                                          $styleType="icon"
                                          onClick={handleSaveTreeItemInputLabel(
                                            question,
                                          )}
                                        >
                                          <Icon
                                            name="save"
                                            color="#84a98c"
                                            fontSize="small"
                                          />
                                        </S.Button>
                                        <S.Button
                                          size="small"
                                          $styleType="icon"
                                          onClick={
                                            handleCancelTreeItemInputLabel
                                          }
                                        >
                                          <Icon
                                            name="cancel"
                                            color="#84a98c"
                                            fontSize="small"
                                          />
                                        </S.Button>
                                      </>
                                    ) : (
                                      <>
                                        <S.Button
                                          size="small"
                                          $styleType="icon"
                                          onClick={handleEditTreeItem(question)}
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
                                          onClick={handleAddAnswer(question)}
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
                                          onClick={handleDeleteQuestion(
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
                                    )}
                                  </>
                                ) : (
                                  <span>Pergunta</span>
                                )}
                              </S.TreeLabel>
                            }
                          >
                            {question.dynamicAnswer ? (
                              <S.TreeItem
                                ref={handleSetItemRef(
                                  question.dynamicAnswer.ownCorrelationId,
                                )}
                                nodeId={question.dynamicAnswer.ownCorrelationId}
                                type="dynamic"
                                label={
                                  <S.TreeLabel>
                                    <div>
                                      {editTreeItemLabel.active ===
                                      question.dynamicAnswer
                                        .ownCorrelationId ? (
                                        <S.InputLabel
                                            ref={handleSetItemInputLabelRef(
                                            question.dynamicAnswer
                                              .ownCorrelationId,
                                          )}
                                            value={editTreeItemLabel.value}
                                            onChange={
                                            handleChangeTreeItemInputLabel
                                          }
                                            onClick={event => {
                                            event.stopPropagation();
                                          }}
                                          />
                                      ) : (
                                        question.dynamicAnswer.text
                                      )}
                                    </div>
                                    {editMode ? (
                                      <>
                                        <S.Button
                                          size="small"
                                          $styleType="icon"
                                          onClick={handleDeleteAnswer(
                                            question.dynamicAnswer,
                                            question,
                                          )}
                                        >
                                          <Icon
                                            name="link"
                                            color="#84a98c"
                                            fontSize="small"
                                          />
                                        </S.Button>
                                        <S.Button
                                          size="small"
                                          $styleType="icon"
                                          onClick={handleDeleteAnswer(
                                            question.dynamicAnswer,
                                            question,
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
                                      <span>Resposta</span>
                                    )}
                                  </S.TreeLabel>
                                }
                              />
                            ) : (
                              <AnswersTree
                                answers={question.answers}
                                parentAnswers={question}
                                treeItemRef={treeItemRef}
                                handleSetItemRef={handleSetItemRef}
                                openPopover={openPopover}
                                onPopoverClose={handleClosePopover}
                                editMode={editMode === EDIT_MODE.CONVERSATION}
                                botValidator={handleValidateBotConversation}
                                addQuestion={handleAddQuestion}
                                addAnswer={handleAddAnswer}
                                editTreeItem={handleEditTreeItem}
                                deleteQuestion={handleDeleteQuestion}
                                deleteAnswer={handleDeleteAnswer}
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
