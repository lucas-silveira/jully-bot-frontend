import { useState, useCallback, useRef } from 'react';
import Icon from '@components/icons';
import { CONVERSATION_ITEM_TYPE } from '@utils/conversation-item-type.enum';
import * as S from '@styles/pages/bot.style';
import { DYNAMIC_ANSWERS_TYPE } from '@utils/dynamic-answers-type.enum';

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
  addTreeItem: (...args: any[]) => any;
  addDynamicAnswer?: (...args: any[]) => any;
  editTreeItem: (...args: any[]) => any;
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
  addTreeItem,
  addDynamicAnswer,
  editTreeItem,
  deleteTreeItem,
  setItemInputLabelRef,
  changeTreeItemInputLabel,
  saveTreeItemInputLabel,
  cancelTreeItemInputLabel,
}: TreeLabelProps): JSX.Element {
  const buttonAddRef = useRef(null);
  const subButtonAddRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleOpenMenu = useCallback(
    (treeItemId: string | number) => (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      event.stopPropagation();
      setOpenMenu(treeItemId);
    },
    [],
  );

  const handleOpenSubMenu = useCallback(
    (subMenuId: string) => (event: React.MouseEvent<HTMLLIElement>) => {
      event.stopPropagation();
      console.log(subMenuId);
      setOpenSubMenu(subMenuId);
    },
    [],
  );

  const handleCloseMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setOpenMenu(null);
      setOpenSubMenu(null);
    },
    [],
  );

  const handleAddTreeItem = useCallback(
    (item: BotTreeItem, dynamicAnswerType: DYNAMIC_ANSWERS_TYPE = null) => (
      event: React.MouseEvent<HTMLLIElement>,
    ) => {
      event.stopPropagation();
      if (dynamicAnswerType) {
        addDynamicAnswer(item, dynamicAnswerType)(event);
      } else {
        addTreeItem(item)(event);
      }
      setOpenMenu(null);
      setOpenSubMenu(null);
    },
    [addTreeItem, addDynamicAnswer],
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
            {treeItem.type === CONVERSATION_ITEM_TYPE.TOPIC
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
                  treeItem.type === CONVERSATION_ITEM_TYPE.QUESTION
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
                getContentAnchorEl={null}
                keepMounted
                open={openMenu === treeItem.id}
                onClose={handleCloseMenu}
              >
                <S.MenuItem onClick={handleAddTreeItem(treeItem)}>
                  <Icon name="message" color="#84a98c" fontSize="small" />
                  <span>Resposta simples</span>
                </S.MenuItem>
                <S.MenuItem
                  ref={subButtonAddRef}
                  onClick={handleOpenSubMenu('dynamic_answer')}
                  aria-controls={`submenu-${treeItem.id}`}
                  aria-haspopup="true"
                >
                  <Icon name="rateReview" color="#84a98c" fontSize="small" />
                  <span>Resposta dinâmica</span>
                </S.MenuItem>
                <S.SubMenu
                  id={`submenu-${treeItem.id}`}
                  anchorEl={subButtonAddRef.current}
                  getContentAnchorEl={null}
                  keepMounted
                  open={openSubMenu === 'dynamic_answer'}
                  onClose={handleCloseMenu}
                >
                  <S.MenuItem
                    onClick={handleAddTreeItem(
                      treeItem,
                      DYNAMIC_ANSWERS_TYPE.DATE,
                    )}
                  >
                    <Icon name="date" color="#84a98c" fontSize="small" />
                    <span>Solicitar uma data</span>
                  </S.MenuItem>
                </S.SubMenu>
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
