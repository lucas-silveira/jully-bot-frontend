import { Backdrop as BackdropMUI } from '@material-ui/core';
import styled from 'styled-components';

export const Backdrop = styled(BackdropMUI)`
  z-index: 2000;
  color: var(--primary-color);
  background: var(--platinum-color); ;
`;
