import { PopoverProps } from '@material-ui/core';
import * as S from './styles';

type CustomPopover = PopoverProps & {
  message: string;
};

export default function Popover({
  id,
  anchorEl,
  open,
  message,
  ...props
}: CustomPopover): JSX.Element {
  return (
    <S.Popover
      id={id}
      anchorEl={anchorEl}
      open={open}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      {...props}
    >
      {message}
    </S.Popover>
  );
}
