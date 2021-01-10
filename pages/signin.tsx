import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import * as S from '@styles/pages/signin.style';
import HeaderBrand from 'components/header/header-brand';
import SignInForm from '@components/forms/signin-form';
import {
  FormValidationError,
  validateSignInForm,
} from '@utils/form-validators';
import ToastForm from '@components/toasts/toast-form';
import { useAuth } from '@context/auth';
import { useManager } from '@context/hooks';

type FormState = {
  email: string;
  password: string;
  showPass: boolean;
  isSending: boolean;
  errors: {
    [key: string]: string;
  };
};

export default function SignIn(): JSX.Element {
  const router = useRouter();
  const { authState, signIn } = useAuth();
  const { getManager } = useManager();
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    showPass: false,
    isSending: false,
    errors: {},
  });
  const [toastError, setToastError] = useState({
    open: false,
    message: '',
  });

  useEffect(() => {
    if (authState.accessToken) router.push('dashboard');
  }, [router, authState.accessToken]);

  const validateFormData = useCallback(async () => {
    try {
      await validateSignInForm({
        email: formState.email,
        password: formState.password,
      });

      setFormState(oldValues => ({
        ...oldValues,
        errors: {},
      }));

      return true;
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

      return false;
    }
  }, [formState.email, formState.password]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      try {
        event.preventDefault();

        const formIsValid = await validateFormData();

        if (!formIsValid) return;

        setFormState(oldValues => ({
          ...oldValues,
          isSending: true,
        }));

        await signIn({
          email: formState.email,
          password: formState.password,
        });
        await getManager();

        setFormState(oldValues => ({
          ...oldValues,
          isSending: false,
        }));

        router.push('/dashboard');
      } catch (err) {
        setFormState(oldValues => ({
          ...oldValues,
          isSending: false,
        }));

        setToastError({
          open: true,
          message: err.response.data.message,
        });
      }
    },
    [validateFormData, formState.email, formState.password, router, signIn],
  );

  const handleToastErrorClose = useCallback(() => {
    setToastError({
      open: false,
      message: '',
    });
  }, []);

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
    <>
      <Head>
        <title>Acesse sua conta | Jully Bot</title>
      </Head>
      <ToastForm
        type="error"
        toast={toastError}
        handleClose={handleToastErrorClose}
      />
      <S.LayoutWrapper>
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
              <p>
                Esqueceu a senha?
                <Link href="/forgot-password"> Recupere a senha.</Link>
              </p>
            </footer>
          </S.LoginBox>
        </S.LayoutMain>
      </S.LayoutWrapper>
    </>
  );
}
