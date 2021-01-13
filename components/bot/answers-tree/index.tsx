import Icon from '@components/icons';
import * as S from '@styles/pages/bot.style';
import { RefObject } from 'react';
import Popover from '../popover';

type BotDynamicAnswer = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  dynamicType: string;
  triggerName: string;
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

type AnswersTreeProps = {
  answers: BotAnswer[];
  parentAnswers: BotQuestion;
  treeItemRef: RefObject<any>;
  handleSetItemRef: (...args: any[]) => any;
  openPopover: string[];
  onPopoverClose: (...args: any[]) => any;
  editMode: boolean;
  botValidator: (...args: any[]) => any;
  addQuestion: (...args: any[]) => any;
  addAnswer: (...args: any[]) => any;
  editTreeItem: (...args: any[]) => any;
  deleteQuestion: (...args: any[]) => any;
  deleteAnswer: (...args: any[]) => any;
  editTreeItemLabel: {
    active: string;
    value: string;
  };
  setItemInputLabelRef: (...args: any[]) => any;
  changeTreeItemInputLabel: (...args: any[]) => any;
  saveTreeItemInputLabel: (...args: any[]) => any;
  cancelTreeItemInputLabel: (...args: any[]) => any;
};

export default function AnswersTree({
  answers,
  parentAnswers,
  treeItemRef,
  handleSetItemRef,
  openPopover,
  onPopoverClose,
  editMode,
  botValidator,
  addQuestion,
  addAnswer,
  editTreeItem,
  deleteQuestion,
  deleteAnswer,
  editTreeItemLabel,
  setItemInputLabelRef,
  changeTreeItemInputLabel,
  saveTreeItemInputLabel,
  cancelTreeItemInputLabel,
}: AnswersTreeProps): JSX.Element {
  if (!answers) return <></>;

  return (
    <div>
      {answers.map(answer => (
        <S.TreeItem
          key={answer.id}
          nodeId={answer.ownCorrelationId}
          label={
            <S.TreeLabel>
              <div>
                {editTreeItemLabel.active === answer.ownCorrelationId ? (
                  <S.InputLabel
                    ref={setItemInputLabelRef(answer.ownCorrelationId)}
                    value={editTreeItemLabel.value}
                    onChange={changeTreeItemInputLabel}
                    onClick={event => event.stopPropagation()}
                  />
                ) : (
                  `${answer.optionNumber}. ${answer.text}`
                )}
              </div>
              {editMode ? (
                <>
                  {editTreeItemLabel.active === answer.ownCorrelationId ? (
                    <>
                      <S.Button
                        size="small"
                        $styleType="icon"
                        onClick={saveTreeItemInputLabel(answer)}
                      >
                        <Icon name="save" color="#84a98c" fontSize="small" />
                      </S.Button>
                      <S.Button
                        size="small"
                        $styleType="icon"
                        onClick={cancelTreeItemInputLabel}
                      >
                        <Icon name="cancel" color="#84a98c" fontSize="small" />
                      </S.Button>
                    </>
                  ) : (
                    <>
                      <S.Button
                        size="small"
                        $styleType="icon"
                        onClick={editTreeItem(answer)}
                      >
                        <Icon name="edit" color="#84a98c" fontSize="small" />
                      </S.Button>
                      <S.Button
                        size="small"
                        $styleType="icon"
                        onClick={addQuestion(answer)}
                      >
                        <Icon name="add" color="#84a98c" fontSize="small" />
                      </S.Button>
                      <S.Button
                        size="small"
                        $styleType="icon"
                        onClick={deleteAnswer(answer, parentAnswers)}
                      >
                        <Icon name="delete" color="#84a98c" fontSize="small" />
                      </S.Button>
                    </>
                  )}
                </>
              ) : (
                <span>Resposta</span>
              )}
            </S.TreeLabel>
          }
        >
          {answer.questions?.map(question => (
            <div key={question.id}>
              <S.TreeItem
                ref={handleSetItemRef(question.ownCorrelationId)}
                nodeId={question.ownCorrelationId}
                $isInvalid={botValidator(question.ownCorrelationId)}
                label={
                  <S.TreeLabel>
                    <div>
                      {editTreeItemLabel.active ===
                      question.ownCorrelationId ? (
                        <S.InputLabel
                          ref={setItemInputLabelRef(question.ownCorrelationId)}
                          value={editTreeItemLabel.value}
                          onChange={changeTreeItemInputLabel}
                          onClick={event => event.stopPropagation()}
                        />
                      ) : (
                        question.text
                      )}
                    </div>
                    {editMode ? (
                      <>
                        {editTreeItemLabel.active ===
                        question.ownCorrelationId ? (
                          <>
                            <S.Button
                              size="small"
                              $styleType="icon"
                              onClick={saveTreeItemInputLabel(question)}
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
                              onClick={cancelTreeItemInputLabel}
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
                              onClick={editTreeItem(question)}
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
                              onClick={addAnswer(question)}
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
                              onClick={deleteQuestion(question, answer)}
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
                          question.dynamicAnswer.ownCorrelationId ? (
                            <S.InputLabel
                              ref={setItemInputLabelRef(
                                question.dynamicAnswer.ownCorrelationId,
                              )}
                              value={editTreeItemLabel.value}
                              onChange={changeTreeItemInputLabel}
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
                              onClick={deleteAnswer(
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
                              onClick={deleteAnswer(
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
                    onPopoverClose={onPopoverClose}
                    editMode={editMode}
                    botValidator={botValidator}
                    editTreeItem={editTreeItem}
                    addQuestion={addQuestion}
                    addAnswer={addAnswer}
                    deleteQuestion={deleteQuestion}
                    deleteAnswer={deleteAnswer}
                    editTreeItemLabel={editTreeItemLabel}
                    setItemInputLabelRef={setItemInputLabelRef}
                    changeTreeItemInputLabel={changeTreeItemInputLabel}
                    saveTreeItemInputLabel={saveTreeItemInputLabel}
                    cancelTreeItemInputLabel={cancelTreeItemInputLabel}
                  />
                )}
              </S.TreeItem>
              <Popover
                id={question.ownCorrelationId}
                anchorEl={treeItemRef.current[question.ownCorrelationId]}
                open={openPopover.includes(question.ownCorrelationId)}
                onClose={onPopoverClose}
                message="Adicione pelo menos uma resposta."
              />
            </div>
          ))}
        </S.TreeItem>
      ))}
    </div>
  );
}
