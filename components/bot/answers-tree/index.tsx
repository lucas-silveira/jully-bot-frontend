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
    optionNumber: number;
    text: string;
    answers: any[];
  }>;
};

type AnswersTreeProps = {
  answers: BotAnswer[];
  editMode: boolean;
  editTreeItem: (...args: any[]) => any;
  addTreeItem: (...args: any[]) => any;
};

export default function AnswersTree({
  answers,
  editMode,
  editTreeItem,
  addTreeItem,
}: AnswersTreeProps): JSX.Element {
  if (!answers) return <></>;

  return (
    <div>
      {answers.map(answer => (
        <S.TreeItem
          key={answer.id}
          nodeId={answer.id}
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
                    onClick={addTreeItem}
                  >
                    <Icon name="add" color="#84a98c" fontSize="small" />
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
              nodeId={question.id}
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
                        onClick={addTreeItem}
                      >
                        <Icon name="add" color="#84a98c" fontSize="small" />
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
                editMode={editMode}
                editTreeItem={editTreeItem}
                addTreeItem={addTreeItem}
              />
            </S.TreeItem>
          ))}
        </S.TreeItem>
      ))}
    </div>
  );
}
