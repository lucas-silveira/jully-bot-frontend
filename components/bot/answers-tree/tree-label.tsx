import { useState, useCallback, useMemo, useRef } from 'react';
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
type TreeLabelProps = {
  label: string;
  treeItem: BotTreeItem;
  parentTreeItem?: BotTreeItem;
  editMode: boolean;
  editTreeItemLabel: {
    active: string;
    value: string;
  };
  editTreeItem: (...args: any[]) => any;
  addTreeItem: (...args: any[]) => any;
  deleteTreeItem: (...args: any[]) => any;
  setItemInputLabelRef: (...args: any[]) => any;
  changeTreeItemInputLabel: (...args: any[]) => any;
  saveTreeItemInputLabel: (...args: any[]) => any;
  cancelTreeItemInputLabel: (...args: any[]) => any;
};

export default function TreeLabel({
  label,
  treeItem,
  parentTreeItem,
  editMode,
  editTreeItemLabel,
  editTreeItem,
  addTreeItem,
  deleteTreeItem,
  setItemInputLabelRef,
  changeTreeItemInputLabel,
  saveTreeItemInputLabel,
  cancelTreeItemInputLabel,
}: TreeLabelProps): JSX.Element {
  const buttonAddRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);

  const TREE_ITEM_TYPE = useMemo(
    () => ({
      TOPIC: 'topic',
      QUESTION: 'question',
      ANSWER: 'answer',
    }),
    [],
  );

  const handleOpenMenu = useCallback(
    (treeItemId: string | number) => (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      event.stopPropagation();
      setOpenMenu(treeItemId);
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

  const handleAddTreeItem = useCallback(
    (item: BotTreeItem) => (event: React.MouseEvent<HTMLLIElement>) => {
      event.stopPropagation();
      addTreeItem(item)(event);
      setOpenMenu(null);
    },
    [addTreeItem],
  );

  return (
    <S.TreeLabel>
      <div>
        {editTreeItemLabel.active === treeItem.ownCorrelationId ? (
          <S.InputLabel
            ref={setItemInputLabelRef(treeItem.ownCorrelationId)}
            value={editTreeItemLabel.value}
            onChange={changeTreeItemInputLabel}
            onClick={event => event.stopPropagation()}
          />
        ) : (
          <>
            {treeItem.type === TREE_ITEM_TYPE.TOPIC
              ? treeItem.name
              : treeItem.text}
          </>
        )}
      </div>
      {editMode ? (
        <>
          {editTreeItemLabel.active === treeItem.ownCorrelationId ? (
            <>
              <S.Button
                size="small"
                $styleType="icon"
                onClick={saveTreeItemInputLabel(treeItem)}
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
                onClick={editTreeItem(treeItem)}
              >
                <Icon name="edit" color="#84a98c" fontSize="small" />
              </S.Button>
              <S.Button
                ref={buttonAddRef}
                size="small"
                $styleType="icon"
                onClick={
                  treeItem.type === TREE_ITEM_TYPE.QUESTION
                    ? handleOpenMenu(treeItem.id)
                    : addTreeItem(treeItem)
                }
                aria-controls={`menu-${treeItem.id}`}
                aria-haspopup="true"
              >
                <Icon name="add" color="#84a98c" fontSize="small" />
              </S.Button>
              <S.Menu
                id={`menu-${treeItem.id}`}
                anchorEl={buttonAddRef.current}
                keepMounted
                open={openMenu === treeItem.id}
                onClose={handleCloseMenu}
              >
                <S.MenuItem onClick={handleAddTreeItem(treeItem)}>
                  Resposta simples
                </S.MenuItem>
                <S.MenuItem onClick={handleCloseMenu}>
                  Resposta dinâmica
                </S.MenuItem>
              </S.Menu>
              <S.Button
                size="small"
                $styleType="icon"
                onClick={deleteTreeItem(treeItem, parentTreeItem)}
              >
                <Icon name="delete" color="#84a98c" fontSize="small" />
              </S.Button>
            </>
          )}
        </>
      ) : (
        <span>{label}</span>
      )}
    </S.TreeLabel>
  );
}
