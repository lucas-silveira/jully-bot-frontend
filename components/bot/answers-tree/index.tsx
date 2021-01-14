import { RefObject } from 'react';
import * as S from '@styles/pages/bot.style';
import Popover from '../popover';
import TreeLabel from './tree-label';
import DynamicTreeLabel from './dynamic-tree-label';

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
  addDynamicAnswer: (...args: any[]) => any;
  editTreeItem: (...args: any[]) => any;
  deleteQuestion: (...args: any[]) => any;
  deleteAnswer: (...args: any[]) => any;
  addTrigger: (...args: any[]) => any;
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
  addDynamicAnswer,
  editTreeItem,
  deleteQuestion,
  deleteAnswer,
  addTrigger,
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
            <TreeLabel
              label="Resposta"
              treeItem={answer}
              parentTreeItem={parentAnswers}
              editMode={editMode}
              editTreeItemLabel={editTreeItemLabel}
              editTreeItem={editTreeItem}
              addTreeItem={addQuestion}
              deleteTreeItem={deleteAnswer}
              addTrigger={addTrigger}
              setItemInputLabelRef={setItemInputLabelRef}
              changeTreeItemInputLabel={changeTreeItemInputLabel}
              saveTreeItemInputLabel={saveTreeItemInputLabel}
              cancelTreeItemInputLabel={cancelTreeItemInputLabel}
            />
          }
        >
          {answer.questions?.map(question => (
            <div key={question.id}>
              <S.TreeItem
                ref={handleSetItemRef(question.ownCorrelationId)}
                nodeId={question.ownCorrelationId}
                $isInvalid={botValidator(question.ownCorrelationId)}
                label={
                  <TreeLabel
                    label="Pergunta"
                    treeItem={question}
                    parentTreeItem={answer}
                    editMode={editMode}
                    editTreeItemLabel={editTreeItemLabel}
                    addTreeItem={addAnswer}
                    addDynamicAnswer={addDynamicAnswer}
                    editTreeItem={editTreeItem}
                    deleteTreeItem={deleteQuestion}
                    addTrigger={addTrigger}
                    setItemInputLabelRef={setItemInputLabelRef}
                    changeTreeItemInputLabel={changeTreeItemInputLabel}
                    saveTreeItemInputLabel={saveTreeItemInputLabel}
                    cancelTreeItemInputLabel={cancelTreeItemInputLabel}
                  />
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
                      <DynamicTreeLabel
                        label="Resposta"
                        dynamicAnswer={question.dynamicAnswer}
                        question={question}
                        editMode={editMode}
                        editTreeItemLabel={editTreeItemLabel}
                        deleteAnswer={deleteAnswer}
                        addTrigger={addTrigger}
                        setItemInputLabelRef={setItemInputLabelRef}
                        changeTreeItemInputLabel={changeTreeItemInputLabel}
                      />
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
                    addDynamicAnswer={addDynamicAnswer}
                    deleteQuestion={deleteQuestion}
                    deleteAnswer={deleteAnswer}
                    addTrigger={addTrigger}
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
