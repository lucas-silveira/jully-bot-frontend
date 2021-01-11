import { useCallback } from 'react';
import * as S from '@styles/pages/bot.style';

type BotAnswer = {
  id: string;
  correlationId: string;
  optionNumber: number;
  text: string;
  questions: Array<{
    id: string;
    correlationId: string;
    optionNumber: number;
    text: string;
    answers: any[];
  }>;
};

type AnswersTreeProps = {
  answers: BotAnswer[];
};

export default function AnswersTree({
  answers,
}: AnswersTreeProps): JSX.Element {
  if (!answers) return <></>;

  return (
    <div>
      {answers.map(answer => (
        <S.TreeItem key={answer.id} nodeId={answer.id} label={answer.text}>
          {answer.questions?.map(question => (
            <S.TreeItem
              key={question.id}
              nodeId={question.id}
              label={question.text}
            >
              <AnswersTree answers={question.answers} />
            </S.TreeItem>
          ))}
        </S.TreeItem>
      ))}
    </div>
  );
}
