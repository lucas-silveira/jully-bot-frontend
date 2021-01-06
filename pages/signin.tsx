import { useCallback, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as yup from 'yup';
import * as S from '@styles/pages/signin.style';
import HeaderBrand from 'components/header/header-brand';
import SignInForm from '@components/forms/signin-form';
import {
  FormValidationError,
  validateSignInForm,
} from '@utils/form-validators';

type FormState = {
  email: string;
  password: string;
  showPass: boolean;
  errors: {
    [key: string]: string;
  };
};

export default function SignIn(): JSX.Element {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    showPass: false,
    errors: {},
  });

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      try {
        event.preventDefault();

        await validateSignInForm({
          email: formState.email,
          password: formState.password,
        });

        setFormState(oldValues => ({
          ...oldValues,
          errors: {},
        }));
      } catch (err) {
        const errors = {};

        if (err instanceof yup.ValidationError) {
          (err.errors as any).forEach((error: FormValidationError) => {
            errors[error.field] = error.message;
          });
        }

        setFormState(oldValues => ({
          ...oldValues,
          errors,
        }));
      }
    },
    [formState.email, formState.password],
  );

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
      <HeaderBrand />
      <S.LayoutMain>
        <S.LoginBox>
          <header>
            <h2>Acesse sua conta</h2>
            <p>Insira o seu e-mail e senha para acessar o seu dashboard.</p>
          </header>

          <SignInForm
            formState={formState}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleClickShowPassword={handleClickShowPassword}
            handleMouseDownPassword={handleMouseDownPassword}
          />

          <footer>
            <p>
              Não possui uma conta?
              <Link href="/signup"> Cadastre-se agora.</Link>
            </p>
          </footer>
        </S.LoginBox>
      </S.LayoutMain>
    </S.LayoutWrapper>
  );
}
