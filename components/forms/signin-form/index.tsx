import {
  FilledInput,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as FormStyle from '@styles/components/form.style';
import * as S from './styles';

type FormState = {
  email: string;
  password: string;
  showPass: boolean;
  error: boolean;
};

type SignInForm = {
  formState: FormState;
  handleChange: (...args: any[]) => any;
  handleClickShowPassword: (...args: any[]) => any;
  handleMouseDownPassword: (...args: any[]) => any;
};

export default function SignInForm({
  formState,
  handleChange,
  handleClickShowPassword,
  handleMouseDownPassword,
}: SignInForm): JSX.Element {
  return (
    <S.Form noValidate autoComplete="off">
      <FormStyle.TextField
        type="email"
        required
        value={formState.email}
        onChange={handleChange('email')}
        error={formState.error}
        label="Seu e-mail"
        variant="filled"
        fullWidth
        helperText={formState.error ? 'Digite um email válido' : ''}
      />
      <FormStyle.PasswordField fullWidth variant="filled" required>
        <InputLabel htmlFor="password">Sua senha</InputLabel>
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
      </FormStyle.PasswordField>
      <FormStyle.SubmitButton fullWidth>Entrar</FormStyle.SubmitButton>
    </S.Form>
  );
}
