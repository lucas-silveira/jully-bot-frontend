import styled, { css } from 'styled-components';
import { Chip as ChipMUI, ChipTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

interface ChipProps extends OverridableComponent<ChipTypeMap> {
  $textColor?: string;
  $bgColor?: string;
}
export const Chip = styled(ChipMUI)<ChipProps>`
  color: ${props => props.$textColor || 'var(--dark-sea-green-color)'};
  ${props =>
    props.variant === 'default'
      ? css`
          background-color: ${props.$bgColor || 'var(--dark-sea-green-color);'};
        `
      : css`
          border-color: ${props.$bgColor || 'var(--dark-sea-green-color);'};
        `}

  svg {
    color: ${props => props.$textColor || 'var(--dark-sea-green-color)'};
  }
`;
