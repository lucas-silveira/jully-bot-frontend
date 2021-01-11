import styled from 'styled-components';
import { lighten } from 'polished';
import { fade, Button as ButtonMUI } from '@material-ui/core';
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
  width: 540px;

  header {
    display: flex;
    margin-bottom: 10px;

    h5 {
      flex-grow: 1;
    }
  }
`;

export const SessionDetails = styled.div`
  flex-grow: 2;

  > div {
    header {
      display: flex;
      margin-bottom: 10px;

      h5 {
        flex-grow: 1;
      }
    }

    > div {
      margin-bottom: 40px;
    }
  }
`;

export const TreeView = styled(TreeViewMUI)`
  max-width: 540px;
`;

export const TreeItem = styled(TreeItemMUI).attrs(() => ({
  TransitionComponent,
}))`
  .MuiTreeItem-label,
  &.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label,
  &.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label {
    margin: 5px;
    padding: 2px 5px;
    background-color: ${lighten(0.4, '#52489C')};
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    transition: 500ms;

    :hover {
      background-color: ${lighten(0.5, '#52489C')};
    }
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

export const Button = styled(ButtonMUI)`
  display: flex;
  align-items: flex-start;
  color: var(--dark-sea-green-color);

  svg {
    margin-right: 5px;
  }
`;
