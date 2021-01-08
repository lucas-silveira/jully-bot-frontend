import styled from 'styled-components';
import { Chip as ChipMUI } from '@material-ui/core';

export const Chip = styled(ChipMUI)`
  color: var(--dark-sea-green-color);
  border-color: var(--dark-sea-green-color);

  svg {
    color: var(--dark-sea-green-color);
  }
`;
