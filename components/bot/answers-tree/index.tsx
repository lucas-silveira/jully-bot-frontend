import Icon from '@components/icons';
import * as S from '@styles/pages/bot.style';
import { RefObject } from 'react';
import Popover from '../popover';

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
type BotQuestion = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  sortNumber: number;
  text: string;
  answers: BotAnswer[];
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
  editTreeItem: (...args: any[]) => any;
  addTreeItem: (...args: any[]) => any;
  deleteTreeItem: (...args: any[]) => any;
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
  editTreeItem,
  addTreeItem,
  deleteTreeItem,
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
                        onClick={addTreeItem(answer)}
                      >
                        <Icon name="add" color="#84a98c" fontSize="small" />
                      </S.Button>
                      <S.Button
                        size="small"
                        $styleType="icon"
                        onClick={deleteTreeItem(answer, parentAnswers)}
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
                              onClick={addTreeItem(question)}
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
                              onClick={deleteTreeItem(question, answer)}
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
                  addTreeItem={addTreeItem}
                  deleteTreeItem={deleteTreeItem}
                  editTreeItemLabel={editTreeItemLabel}
                  setItemInputLabelRef={setItemInputLabelRef}
                  changeTreeItemInputLabel={changeTreeItemInputLabel}
                  saveTreeItemInputLabel={saveTreeItemInputLabel}
                  cancelTreeItemInputLabel={cancelTreeItemInputLabel}
                />
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
