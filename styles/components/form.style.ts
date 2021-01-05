import {
  TextField as TextFieldMUI,
  FormControl as FormControlMUI,
} from '@material-ui/core';
import styled from 'styled-components';

export const TextField = styled(TextFieldMUI)`
  background: #fff;

  label.Mui-focused {
    color: var(--primary-color);
  }

  .MuiFilledInput-underline:after {
    border-bottom-color: var(--primary-color);
  }

  .Mui-focused fieldset {
    border-color: var(--primary-color);
  }
`;

export const PasswordField = styled(FormControlMUI)`
  background: #fff;

  label.Mui-focused {
    color: var(--primary-color);
  }

  .MuiFilledInput-underline:after {
    border-bottom-color: var(--primary-color);
  }

  .Mui-focused fieldset {
    border-color: var(--primary-color);
  }
`;
