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
              <div>{`${answer.optionNumber}. ${answer.text}`}</div>
              {editMode ? (
                <>
                  <S.Button
                    size="small"
                    $styleType="icon"
                    onClick={editTreeItem}
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
                    <div>{question.text}</div>
                    {editMode ? (
                      <>
                        <S.Button
                          size="small"
                          $styleType="icon"
                          onClick={editTreeItem}
                        >
                          <Icon name="edit" color="#84a98c" fontSize="small" />
                        </S.Button>
                        <S.Button
                          size="small"
                          $styleType="icon"
                          onClick={addTreeItem(question)}
                        >
                          <Icon name="add" color="#84a98c" fontSize="small" />
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
