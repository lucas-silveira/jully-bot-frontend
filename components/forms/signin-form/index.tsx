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
  errors: {
    [key: string]: string;
  };
};

type SignInForm = {
  formState: FormState;
  handleSubmit: (...args: any[]) => any;
  handleChange: (...args: any[]) => any;
  handleClickShowPassword: (...args: any[]) => any;
  handleMouseDownPassword: (...args: any[]) => any;
};

export default function SignInForm({
  formState,
  handleSubmit,
  handleChange,
  handleClickShowPassword,
  handleMouseDownPassword,
}: SignInForm): JSX.Element {
  return (
    <S.Form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <FormStyle.TextField
        type="email"
        required
        value={formState.email}
        onChange={handleChange('email')}
        error={!!formState.errors.email}
        label="Seu e-mail"
        variant="filled"
        fullWidth
        helperText={formState.errors.email || ''}
      />
      <FormStyle.PasswordField
        fullWidth
        variant="filled"
        required
        error={!!formState.errors.password}
      >
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
        {!!formState.errors.password && (
          <p className="MuiFormHelperText-root MuiFormHelperText-contained Mui-error Mui-required">
            {formState.errors.password || ''}
          </p>
        )}
      </FormStyle.PasswordField>
      <FormStyle.SubmitButton fullWidth>Entrar</FormStyle.SubmitButton>
    </S.Form>
  );
}
