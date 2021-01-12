import styled, { css } from 'styled-components';
import { lighten } from 'polished';
import {
  fade,
  Button as ButtonMUI,
  ExtendButtonBase,
  ButtonTypeMap,
} from '@material-ui/core';
import {
  TreeView as TreeViewMUI,
  TreeItem as TreeItemMUI,
} from '@material-ui/lab';
import TransitionComponent from '@components/transitions/default';

export const Wrapper = styled.section`
  padding: 20px;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  height: 32px;
  padding-bottom: 10px;

  .MuiChip-root {
    font-size: 0.7rem;
    height: 18px;
    margin-left: 10px;
  }

  svg {
    color: var(--primary-color);
    margin-right: 10px;
  }
`;

export const Main = styled.main`
  display: flex;
  padding-top: 20px;
  gap: 40px;

  @media (max-width: 959px) {
    flex-direction: column;
    gap: 40px;
  }
`;

export const SessionConversation = styled.div`
  flex: 1 0 0;

  header {
    display: flex;
    margin-bottom: 10px;

    h5 {
      flex-grow: 1;
    }

    button + button {
      margin-left: 10px;
    }
  }
`;

export const SessionDetails = styled.div`
  flex: 1 0 0;

  > div {
    header {
      display: flex;
      margin-bottom: 10px;

      h5 {
        flex-grow: 1;
      }

      button + button {
        margin-left: 10px;
      }
    }

    > div {
      margin-bottom: 40px;
    }
  }
`;

export const TreeView = styled(TreeViewMUI)``;

type CustomTreeItem = typeof TreeItemMUI & {
  $isInvalid?: boolean;
};

export const TreeItem = styled(TreeItemMUI).attrs(() => ({
  TransitionComponent,
}))<CustomTreeItem>`
  .MuiTreeItem-label {
    margin: 5px;
    padding: 2px 5px;
    background-color: ${lighten(0.4, '#52489C')};
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    border: 1px solid ${lighten(0.4, '#52489C')};
    transition: 500ms;
    ${props =>
      props.$isInvalid
        ? css`
            border-color: var(--error-color);
          `
        : ''}

    :hover {
      background-color: ${lighten(0.5, '#52489C')};
      border-color: ${lighten(0.5, '#52489C')};
    }
  }

  &.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label,
  &.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label {
    background-color: ${lighten(0.4, '#52489C')};
    border-color: ${lighten(0.4, '#52489C')};
  }

  .MuiTreeItem-iconContainer .close {
    opacity: 0.3;
  }

  .MuiTreeItem-content {
    padding-left: 18px;
    border-left: 1px dashed ${fade('#333', 0.4)};
  }
`;

export const TreeLabel = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;

  div {
    flex-grow: 1;
  }

  span {
    font-size: 0.7rem;
    font-style: italic;
  }
`;

const buttonStyleTypes = {
  edit: css`
    color: var(--dark-sea-green-color);
    svg {
      margin-right: 5px;
    }
  `,
  save: css`
    color: #fff;
    background-color: var(--dark-sea-green-color);

    :hover {
      background-color: ${lighten(0.1, '#84a98c')};
    }
  `,
  cancel: css`
    color: var(--dark-sea-green-color);
  `,
  icon: css`
    min-width: auto;
    padding: 4px 2px;
    border-radius: 50px;

    :hover {
      background-color: inherit;
    }

    svg {
      color: var(--primary-color);
      font-size: 1.2rem;
    }
  `,
};

interface MyButtonProps extends ExtendButtonBase<ButtonTypeMap> {
  name?: string;
  $styleType: 'edit' | 'save' | 'cancel' | 'icon';
}

export const Button = styled(ButtonMUI)<MyButtonProps>`
  display: flex;
  align-items: flex-start;

  ${props => buttonStyleTypes[props.$styleType]};
`;
