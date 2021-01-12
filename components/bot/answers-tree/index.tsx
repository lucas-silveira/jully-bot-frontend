import Icon from '@components/icons';
import * as S from '@styles/pages/bot.style';

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
  editMode: boolean;
  botValidator: (...args: any[]) => any;
  editTreeItem: (...args: any[]) => any;
  addTreeItem: (...args: any[]) => any;
  deleteTreeItem: (...args: any[]) => any;
};

export default function AnswersTree({
  answers,
  parentAnswers,
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
            <S.TreeItem
              key={question.id}
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
                        <Icon name="delete" color="#84a98c" fontSize="small" />
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
                editMode={editMode}
                botValidator={botValidator}
                editTreeItem={editTreeItem}
                addTreeItem={addTreeItem}
                deleteTreeItem={deleteTreeItem}
              />
            </S.TreeItem>
          ))}
        </S.TreeItem>
      ))}
    </div>
  );
}
