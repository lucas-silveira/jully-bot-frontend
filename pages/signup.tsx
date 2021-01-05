/* eslint-disable prettier/prettier */
import { useCallback, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FilledInput,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as S from '@styles/pages/signup.style';
import * as FormStyle from '@styles/components/form.style';
import HeaderBrand from 'components/header/header-brand';
import Steps from 'components/steps';

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

export default function SignUp(): JSX.Element {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    showPass: false,
    birthday: new Date(),
    billingAddressLine1: '',
    billingAddressLine2: '',
    billingAddressZipcode: '',
    billingAddressCity: '',
    billingAddressState: '',
    billingAddressCountry: 'Brasil',
    error: false,
  });

  const handleChange = useCallback(
    (prop: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState(oldValues => ({ ...oldValues, [prop]: event.target.value }));
    },
    [],
  );

  const handleDateChange = useCallback((date: Date) => {
    setFormState(oldValues => ({ ...oldValues, birthday: date }));
  }, []);

  const handleClickShowPassword = useCallback(() => {
    setFormState(oldValues => ({
      ...oldValues,
      showPass: !oldValues.showPass,
    }));
  }, []);

  const handleMouseDownPassword = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    [],
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <S.LayoutWrapper>
        <Head>
          <title>Crie a sua conta | Jully Bot</title>
        </Head>
        <HeaderBrand />
        <S.LayoutMain>
          <S.LoginBox>
            <header>
              <h2>Crie a sua conta</h2>
              <p>Ao cadastrar, você ganha 14 dias gratuítos para testar a Jully. Cancele quando quiser.</p>
            </header>
            <Steps steps={[
          {
            title: 'Seus dados',
            content: (
              <>
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
              </>
            )
          },
          {
            title: 'Dados de cobrança',
            content: (
              <>
                <S.Form noValidate autoComplete="off">
                  <FormStyle.TextField
                    type="tel"
                    value={formState.billingAddressZipcode}
                    onChange={handleChange('billingAddressZipcode')}
                    error={formState.error}
                    label="Cep"
                    variant="filled"
                    fullWidth
                    helperText={formState.error ? 'Campo obrigatório' : ''}
                  />
                  <FormStyle.TextField
                    type="text"
                    value={formState.billingAddressLine1}
                    onChange={handleChange('billingAddressLine1')}
                    error={formState.error}
                    label="Rua"
                    variant="filled"
                    fullWidth
                    helperText={formState.error ? 'Campo obrigatório' : ''}
                  />
                  <FormStyle.TextField
                    type="text"
                    value={formState.billingAddressLine2}
                    onChange={handleChange('billingAddressLine2')}
                    error={formState.error}
                    label="Bairro"
                    variant="filled"
                    fullWidth
                    helperText={formState.error ? 'Campo obrigatório' : ''}
                  />
                  <FormStyle.TextField
                    type="text"
                    value={formState.billingAddressState}
                    onChange={handleChange('billingAddressState')}
                    error={formState.error}
                    label="Cidade"
                    variant="filled"
                    fullWidth
                    helperText={formState.error ? 'Campo obrigatório' : ''}
                  />
                  <FormStyle.TextField
                    type="text"
                    value={formState.billingAddressCity}
                    onChange={handleChange('billingAddressCity')}
                    error={formState.error}
                    label="Estado"
                    variant="filled"
                    fullWidth
                    helperText={formState.error ? 'Campo obrigatório' : ''}
                  />
                </S.Form>
              </>
            )
          }
        ]}
            />

            <footer>
              <p>
                Já possui uma conta?
                <Link href="/signin"> Faça login agora.</Link>
              </p>
            </footer>
          </S.LoginBox>
        </S.LayoutMain>
      </S.LayoutWrapper>
    </MuiPickersUtilsProvider>
  );
}
