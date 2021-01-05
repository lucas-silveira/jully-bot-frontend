import styled from 'styled-components';
import { AppBar as AppBarMUI } from '@material-ui/core';

export const AppBar = styled(AppBarMUI).attrs(() => ({
  position: 'static',
  color: 'transparent',
}))`
  box-shadow: none;
`;
