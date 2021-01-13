import styled from 'styled-components';
import { Popover as PopoverMUI } from '@material-ui/core';

export const Popover = styled(PopoverMUI)`
  .MuiPaper-root {
    padding: 10px;
    color: #fff;
    background-color: var(--error-color);
  }
`;
