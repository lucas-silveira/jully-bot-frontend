import {
  CircularProgress,
  FilledInput,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as FormStyle from '@styles/components/form.style';
import * as S from './styles';

type FormState = {
  password: string;
  passwordConfirm: string;
  showPass: boolean;
  isSending: boolean;
  errors: {
    [key: string]: string;
  };
};

type ResetPasswordForm = {
  formState: FormState;
  handleSubmit: (...args: any[]) => any;
  handleChange: (...args: any[]) => any;
  handleClickShowPassword: (...args: any[]) => any;
  handleMouseDownPassword: (...args: any[]) => any;
};

export default function ResetPasswordForm({
  formState,
  handleSubmit,
  handleChange,
  handleClickShowPassword,
  handleMouseDownPassword,
}: ResetPasswordForm): JSX.Element {
  return (
    <S.Form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <FormStyle.PasswordField fullWidth variant="filled">
        <InputLabel htmlFor="password">Senha</InputLabel>
        <FilledInput
          id="password"
          type={formState.showPass ? 'text' : 'password'}
          value={formState.password}
          onChange={handleChange('password')}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {formState.showPass ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )}
        />
        {!!formState.errors.password && (
          <p className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error Mui-required">
            {formState.errors.password || ''}
          </p>
        )}
      </FormStyle.PasswordField>
      <FormStyle.PasswordField fullWidth variant="filled">
        <InputLabel htmlFor="confirm-password">Confirme a Senha</InputLabel>
        <FilledInput
          id="confirm-password"
          type={formState.showPass ? 'text' : 'password'}
          value={formState.passwordConfirm}
          onChange={handleChange('passwordConfirm')}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {formState.showPass ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )}
        />
        {!!formState.errors.passwordConfirm && (
          <p className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error Mui-required">
            {formState.errors.passwordConfirm || ''}
          </p>
        )}
      </FormStyle.PasswordField>
      <FormStyle.SubmitButton
        variant="contained"
        disabled={formState.isSending}
        fullWidth
      >
        {formState.isSending ? (
          <CircularProgress size={14} color="inherit" />
        ) : (
          'Redefinir a senha'
        )}
      </FormStyle.SubmitButton>
    </S.Form>
  );
}
