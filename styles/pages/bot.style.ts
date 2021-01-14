import styled, { css, keyframes } from 'styled-components';
import { darken, lighten } from 'polished';
import {
  fade,
  Button as ButtonMUI,
  Menu as MenuMUI,
  MenuItem as MenuItemMUI,
  ExtendButtonBase,
  ButtonTypeMap,
  Zoom,
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
  type?: 'new' | 'dynamic';
  $isInvalid?: boolean;
};

const fadeAnimation = keyframes`
  from {
    background-color: ${lighten(0.3, '#52489C')};
  }

  to {
    background-color: ${lighten(0.5, '#52489C')};
  }
`;

const treeItemTypes = {
  default: css`
    .MuiTreeItem-label {
      background-color: ${lighten(0.4, '#52489C')};
      :hover {
        background-color: ${lighten(0.5, '#52489C')};
      }
    }

    &.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label,
    &.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label {
      background-color: ${lighten(0.45, '#52489C')};
      border-color: ${lighten(0.5, '#52489C')};
    }
  `,
  new: css`
    .MuiTreeItem-label {
      color: #84a98c;
      background-color: #ebebeb;
      border: 1px dashed #cad2c5;
      :hover {
        background-color: ${darken(0.05, '#ebebeb')};
      }
    }

    &.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label,
    &.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label {
      background-color: #ebebeb;
      border-color: #cad2c5;
    }
  `,
  dynamic: css`
    .MuiTreeItem-label {
      color: ${darken(0.3, '#2196f3')};
      background-color: ${lighten(0.2, '#2196f3')};
      :hover {
        background-color: ${lighten(0.3, '#2196f3')};
      }
    }

    &.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label,
    &.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label {
      background-color: ${lighten(0.4, '#2196f3')};
      border-color: ${lighten(0.4, '#2196f3')};
    }
  `,
};

export const TreeItem = styled(TreeItemMUI).attrs(() => ({
  TransitionComponent,
}))<CustomTreeItem>`
  .MuiTreeItem-label {
    margin: 5px;
    padding: 2px 5px;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    transition: 500ms;
    ${props =>
      props.$isInvalid
        ? css`
            animation: ${fadeAnimation} 1s linear infinite alternate;
          `
        : ''}
  }

  .MuiTreeItem-iconContainer .close {
    opacity: 0.3;
  }

  .MuiTreeItem-content {
    padding-left: 18px;
    border-left: 1px dashed ${fade('#333', 0.4)};
  }

  ${props => treeItemTypes[props.type || 'default']}
`;

export const TreeLabel = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;

  div {
    flex-grow: 1;
    font-size: 0.9rem;
  }

  span {
    font-size: 0.7rem;
    font-style: italic;
  }
`;

export const InputLabel = styled.input.attrs(() => ({
  type: 'text',
}))`
  width: 100%;
  background: transparent;
  font-size: 1rem;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  border: none;
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
      font-size: 1rem;
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

export const Menu = styled(MenuMUI).attrs(() => ({
  anchorOrigin: {
    vertical: 'center',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'center',
    horizontal: 'center',
  },
}))`
  .MuiPaper-root {
    ul {
      padding: 6px 0;
    }
  }
`;

export const SubMenu = styled(MenuMUI).attrs(() => ({
  TransitionComponent: Zoom,
  anchorOrigin: {
    vertical: 'center',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'center',
    horizontal: 'left',
  },
}))`
  .MuiPaper-root {
    ul {
      padding: 6px 0;
    }
  }
`;

export const MenuItem = styled(MenuItemMUI)`
  svg {
    margin-right: 10px;
  }
`;
