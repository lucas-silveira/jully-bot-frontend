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
  errors: {
    [key: string]: string;
  };
};

type SignUpForm = {
  formState: FormState;
  handleChange: (...args: any[]) => any;
  handleClickShowPassword: (...args: any[]) => any;
  handleMouseDownPassword: (...args: any[]) => any;
  handleDateChange: (...args: any[]) => any;
};

export default function SignUpForm({
  formState,
  handleChange,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleDateChange,
}: SignUpForm): JSX.Element {
  return (
    <S.Form noValidate autoComplete="off">
      <FormStyle.TextField
        type="text"
        value={formState.name}
        onChange={handleChange('name')}
        error={!!formState.errors.name}
        label="Nome completo"
        variant="filled"
        fullWidth
        helperText={formState.errors.name || ''}
      />
      <FormStyle.TextField
        type="email"
        value={formState.email}
        onChange={handleChange('email')}
        error={!!formState.errors.email}
        label="E-mail"
        variant="filled"
        fullWidth
        helperText={formState.errors.email || ''}
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
