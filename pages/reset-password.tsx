import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import * as yup from 'yup';
import * as S from '@styles/pages/signin.style';
import HeaderBrand from 'components/header/header-brand';
import {
  FormValidationError,
  validateResetPasswordForm,
} from '@utils/form-validators';
import { jullyAPI } from '@utils/api';
import ToastFormError from '@components/toasts/toast-form-error';
import { useRecoilValue } from 'recoil';
import { authState } from 'store/auth';
import { useRouter } from 'next/router';
import ResetPasswordForm from '@components/forms/reset-password-form';

type FormState = {
  password: string;
  passwordConfirm: string;
  showPass: boolean;
  isSending: boolean;
  emailSent: boolean;
  errors: {
    [key: string]: string;
  };
};

export default function ForgotPassword(): JSX.Element {
  const router = useRouter();
  const auth = useRecoilValue(authState);
  const [formState, setFormState] = useState<FormState>({
    password: '',
    passwordConfirm: '',
    showPass: false,
    isSending: false,
    emailSent: false,
    errors: {},
  });
  const [toastError, setToastError] = useState({
    open: false,
    message: '',
  });

  useEffect(() => {
    if (auth.accessToken) router.push('dashboard');
  }, [router, auth]);

  const handleToastErrorClose = useCallback(() => {
    setToastError({
      open: false,
      message: '',
    });
  }, []);

  const validateFormData = useCallback(async () => {
    try {
      await validateResetPasswordForm({
        password: formState.password,
        passwordConfirm: formState.passwordConfirm,
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
  }, [formState.password, formState.passwordConfirm]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      try {
        event.preventDefault();

        console.log(router.query.token);

        const formIsValid = await validateFormData();

        if (!formIsValid) return;

        setFormState(oldValues => ({
          ...oldValues,
          isSending: true,
        }));

        // const { data } = await jullyAPI.post('/authentication', {
        //   email: formState.email,
        //   password: formState.password,
        // });

        setFormState(oldValues => ({
          ...oldValues,
          isSending: false,
          emailSent: true,
        }));
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
    [validateFormData],
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
    <>
      <Head>
        <title>Resetar senha | Jully Bot</title>
      </Head>
      <ToastFormError toast={toastError} handleClose={handleToastErrorClose} />
      <S.LayoutWrapper>
        <HeaderBrand />
        <S.LayoutMain>
          <S.LoginBox>
            <header>
              <h2>Redefina a sua senha</h2>
              <p>
                Insira a sua nova senha nos campos abaixo. Certifique-se de usar
                uma senha segura!
              </p>
            </header>
            <ResetPasswordForm
              formState={formState}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleClickShowPassword={handleClickShowPassword}
              handleMouseDownPassword={handleMouseDownPassword}
            />
          </S.LoginBox>
        </S.LayoutMain>
      </S.LayoutWrapper>
    </>
  );
}
