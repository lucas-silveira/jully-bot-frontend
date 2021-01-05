import { useCallback, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FilledInput,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import * as S from '@styles/pages/signin.style';
import * as FormStyle from '@styles/components/form.style';

type FormState = {
  email: string;
  password: string;
  showPass: boolean;
  error: boolean;
};

export default function SignIn(): JSX.Element {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    showPass: false,
    error: false,
  });

  const handleChange = useCallback(
    (prop: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState(oldValues => ({ ...oldValues, [prop]: event.target.value }));
    },
    [],
  );

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
    <S.LayoutWrapper>
      <Head>
        <title>Acesse sua conta | Jully Bot</title>
      </Head>
      <S.LayoutMain>
        <header>
          <h2>Acesse sua conta</h2>
          <p>Insira o seu e-mail e senha para acessar o seu dashboard.</p>
        </header>

        <S.Form noValidate autoComplete="off">
          <FormStyle.TextField
            type="email"
            value={formState.email}
            onChange={handleChange('email')}
            error={formState.error}
            label="Seu e-mail"
            variant="filled"
            fullWidth
            helperText={formState.error ? 'Digite um email válido' : ''}
          />
          <FormStyle.PasswordField fullWidth variant="filled">
            <InputLabel htmlFor="password">Password</InputLabel>
            <FilledInput
              id="password"
              type={formState.showPass ? 'text' : 'password'}
              value={formState.password}
              onChange={handleChange('password')}
              endAdornment={( // eslint-disable-line
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {formState.showPass ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )} // eslint-disable-line
            />
          </FormStyle.PasswordField>
          <FormStyle.SubmitButton fullWidth>Entrar</FormStyle.SubmitButton>
        </S.Form>

        <footer>
          <p>
            Não possui uma conta?
            <Link href="/signup"> Cadastre-se agora.</Link>
          </p>
        </footer>
      </S.LayoutMain>
    </S.LayoutWrapper>
  );
}
