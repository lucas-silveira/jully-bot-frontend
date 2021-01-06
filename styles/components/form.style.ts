import {
  TextField as TextFieldMUI,
  FormControl as FormControlMUI,
  Button as ButtonMUI,
  ExtendButtonBase,
  ButtonTypeMap,
} from '@material-ui/core';
import styled from 'styled-components';
import { lighten } from 'polished';
import { KeyboardDatePicker as KeyboardDatePickerMUI } from '@material-ui/pickers';

const formatDefaultMUIStyle = `
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

const deactiveInputAutofill = `
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    box-shadow: 0 0 0 30px #fff inset !important;
  }
`;

export const TextField = styled(TextFieldMUI)`
  input {
    background-color: #fff;
    ${deactiveInputAutofill}
  }

  ${formatDefaultMUIStyle}
`;

export const PasswordField = styled(FormControlMUI)`
  input {
    background-color: #fff;
    ${deactiveInputAutofill}
  }

  .MuiFilledInput-root {
    background-color: #fff;
  }

  ${formatDefaultMUIStyle}
`;

export const KeyboardDatePicker = styled(KeyboardDatePickerMUI).attrs(() => ({
  margin: 'normal',
}))`
  ${formatDefaultMUIStyle}
`;

export const SubmitButton = styled(ButtonMUI).attrs(() => ({
  type: 'submit',
  size: 'large',
}))`
  min-height: 50px;
  color: #fff;
  background-color: var(--primary-color);
  padding: 12px 0;

  &:hover {
    background-color: ${lighten(0.07, '#52489C')};
  }
`;

interface MyButtonProps extends ExtendButtonBase<ButtonTypeMap> {
  name?: string;
  isSending?: boolean;
}

export const Button = styled(ButtonMUI).attrs(() => ({
  size: 'large',
}))<MyButtonProps>`
  min-width: ${props => (props.isSending ? '50px' : '200px')};
  min-height: 50px;
  color: #fff;
  background-color: var(--primary-color);
  padding: 12px 22px;
  transition: min-width 500ms;

  &:hover {
    background-color: ${lighten(0.07, '#52489C')};
  }
`;
