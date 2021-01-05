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
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  showPass: boolean;
  birthday: Date | null;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingAddressZipcode: string;
  billingAddressCity: string;
  billingAddressState: string;
  billingAddressCountry: string;
  error: boolean;
};

type SignInForm = {
  formState: FormState;
  handleChange: (...args: any[]) => any;
  handleClickShowPassword: (...args: any[]) => any;
  handleMouseDownPassword: (...args: any[]) => any;
  handleDateChange: (...args: any[]) => any;
};

export default function SignInForm({
  formState,
  handleChange,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleDateChange,
}: SignInForm): JSX.Element {
  return (
    <S.Form noValidate autoComplete="off">
      <FormStyle.TextField
        type="text"
        value={formState.name}
        onChange={handleChange('name')}
        error={formState.error}
        label="Nome completo"
        variant="filled"
        fullWidth
        helperText={formState.error ? 'Nome obrigatório' : ''}
      />
      <FormStyle.TextField
        type="email"
        value={formState.email}
        onChange={handleChange('email')}
        error={formState.error}
        label="E-mail"
        variant="filled"
        fullWidth
        helperText={formState.error ? 'Digite um email válido' : ''}
      />
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
      </FormStyle.PasswordField>
      <FormStyle.KeyboardDatePicker
        id="date-picker-dialog"
        label="Data de nascimento"
        format="dd/MM/yyyy"
        value={formState.birthday}
        onChange={handleDateChange}
        fullWidth
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </S.Form>
  );
}
