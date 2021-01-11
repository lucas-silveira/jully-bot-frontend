import styled from 'styled-components';
import { fade } from '@material-ui/core';
import {
  TreeView as TreeViewMUI,
  TreeItem as TreeItemMUI,
} from '@material-ui/lab';
import TransitionComponent from '@components/transitions/default';
import { darken, lighten } from 'polished';

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
  padding-top: 20px;
`;

export const SessionConversation = styled.div`
  h5 {
    margin-bottom: 20px;
  }
`;

export const TreeView = styled(TreeViewMUI)`
  flex-grow: 1;
  max-width: 400px;
  height: 264px;
`;

export const TreeItem = styled(TreeItemMUI).attrs(() => ({
  TransitionComponent,
}))`
  .MuiTreeItem-label,
  &.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label,
  &.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label {
    margin: 5px;
    padding: 2px 5px;
    background-color: var(--ash-gray-color);
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    transition: 500ms;

    :hover {
      background-color: ${lighten(0.1, '#CAD2C5')};
    }
  }

  .MuiTreeItem-iconContainer .close {
    opacity: 0.3;
  }

  .MuiTreeItem-content {
    margin-left: 7px;
    padding-left: 18px;
    border-left: 1px dashed ${fade('#333', 0.4)};
  }
`;
