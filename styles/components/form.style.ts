import {
  TextField as TextFieldMUI,
  FormControl as FormControlMUI,
  Button,
} from '@material-ui/core';
import styled from 'styled-components';
import { lighten } from 'polished';

export const TextField = styled(TextFieldMUI)`
  input {
    background-color: #fff;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    box-shadow: 0 0 0 30px #fff inset !important;
  }

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
  input {
    background-color: #fff;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    box-shadow: 0 0 0 30px #fff inset !important;
  }

  label.Mui-focused {
    color: var(--primary-color);
  }

  .MuiFilledInput-root {
    background-color: #fff;
  }

  .MuiFilledInput-underline:after {
    border-bottom-color: var(--primary-color);
  }

  .Mui-focused fieldset {
    border-color: var(--primary-color);
  }
`;

export const SubmitButton = styled(Button).attrs(() => ({
  size: 'large',
}))`
  color: #fff;
  background-color: var(--primary-color);
  padding: 12px 0;

  &:hover {
    background-color: ${lighten(0.07, '#52489C')};
  }
`;
