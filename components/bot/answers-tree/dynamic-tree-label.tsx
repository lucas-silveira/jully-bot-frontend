import { useState, useCallback, useRef } from 'react';
import Icon from '@components/icons';
import * as S from '@styles/pages/bot.style';

type BotDynamicAnswer = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  dynamicType: string;
  triggerName: string;
  text: string;
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
type TreeLabelProps = {
  label: string;
  dynamicAnswer: BotDynamicAnswer;
  question: BotQuestion;
  editMode: boolean;
  editTreeItemLabel: {
    active: string;
    value: string;
  };
  deleteAnswer: (...args: any[]) => any;
  setItemInputLabelRef: (...args: any[]) => any;
  changeTreeItemInputLabel: (...args: any[]) => any;
};

export default function DynamicTreeLabel({
  label,
  dynamicAnswer,
  question,
  editMode,
  editTreeItemLabel,
  deleteAnswer,
  setItemInputLabelRef,
  changeTreeItemInputLabel,
}: TreeLabelProps): JSX.Element {
  const buttonAddRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);

  const handleOpenMenu = useCallback(
    (dynamicAnswerId: string | number) => (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      event.stopPropagation();
      setOpenMenu(dynamicAnswerId);
    },
    [],
  );

  const handleCloseMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setOpenMenu(null);
    },
    [],
  );

  const handleAddTrigger = useCallback(
    () => (event: React.MouseEvent<HTMLLIElement>) => {
      event.stopPropagation();
      setOpenMenu(null);
    },
    [],
  );
  return (
    <S.TreeLabel>
      <div>
        {editTreeItemLabel.active === dynamicAnswer.ownCorrelationId ? (
          <S.InputLabel
            ref={setItemInputLabelRef(dynamicAnswer.ownCorrelationId)}
            value={editTreeItemLabel.value}
            onChange={changeTreeItemInputLabel}
            onClick={event => event.stopPropagation()}
          />
        ) : (
          <>{dynamicAnswer.text}</>
        )}
      </div>
      {editMode ? (
        <>
          <S.Button
            ref={buttonAddRef}
            size="small"
            $styleType="icon"
            onClick={handleOpenMenu(dynamicAnswer.id)}
            aria-controls={`menu-${dynamicAnswer.id}`}
            aria-haspopup="true"
          >
            <Icon name="link" color="#84a98c" fontSize="small" />
          </S.Button>
          <S.Menu
            id={`menu-${dynamicAnswer.id}`}
            anchorEl={buttonAddRef.current}
            keepMounted
            open={openMenu === dynamicAnswer.id}
            onClose={handleCloseMenu}
          >
            <S.MenuItem onClick={handleAddTrigger()}>Google Agenda</S.MenuItem>
          </S.Menu>
          <S.Button
            size="small"
            $styleType="icon"
            onClick={deleteAnswer(dynamicAnswer, question)}
          >
            <Icon name="delete" color="#84a98c" fontSize="small" />
          </S.Button>
        </>
      ) : (
        <span>{label}</span>
      )}
    </S.TreeLabel>
  );
}
