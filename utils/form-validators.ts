import * as Yup from 'yup';
import { zipcodeRegex } from './string-regex';

export type FormValidationError = {
  field: string;
  message: string;
};

const signInFormValidator = () => {
  type ObjectSchema = {
    email: string;
    password: string;
  };

  const schema = Yup.object().shape({
    email: Yup.string()
      .email(() => ({
        field: 'email',
        message: 'Precisa ser um e-mail válido',
      }))
      .required(({ path }) => ({
        field: path,
        message: 'O e-mail é obrigatório',
      })),
    password: Yup.string().required(({ path }) => ({
      field: path,
      message: 'A senha é obrigatória',
    })),
  });

  return async (dataToValidate: ObjectSchema) =>
    schema.validate(dataToValidate, { abortEarly: false });
};

const signUpFirstStepFormValidator = () => {
  type ObjectSchema = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };

  const schema = Yup.object().shape({
    name: Yup.string().required(({ path }) => ({
      field: path,
      message: 'O nome é obrigatório',
    })),
    email: Yup.string()
      .email(() => ({
        field: 'email',
        message: 'Precisa ser um e-mail válido',
      }))
      .required(({ path }) => ({
        field: path,
        message: 'O e-mail é obrigatório',
      })),
    password: Yup.string()
      .min(6, ({ path }) => ({
        field: path,
        message: 'A senha precisa ter no mínimo 6 dígitos',
      }))
      .required(({ path }) => ({
        field: path,
        message: 'A senha é obrigatória',
      })),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password')], ({ path }) => ({
      field: path,
      message: 'As senhas precisam ser iguais',
    })),
  });

  return async (dataToValidate: ObjectSchema) =>
    schema.validate(dataToValidate, { abortEarly: false });
};

const signUpSecondStepFormValidator = () => {
  type ObjectSchema = {
    line1: string;
    line2: string;
    zipcode: string;
    city: string;
  };

  const schema = Yup.object().shape({
    line1: Yup.string().required(({ path }) => ({
      field: path,
      message: 'A rua é obrigatória',
    })),
    line2: Yup.string().required(({ path }) => ({
      field: path,
      message: 'O bairro é obrigatório',
    })),
    zipcode: Yup.string()
      .matches(zipcodeRegex, ({ path }) => ({
        field: path,
        message: 'O cep não é válido',
      }))
      .required(({ path }) => ({
        field: path,
        message: 'O cep é obrigatório',
      })),
    city: Yup.string().required(({ path }) => ({
      field: path,
      message: 'A cidade é obrigatória',
    })),
  });

  return async (dataToValidate: ObjectSchema) =>
    schema.validate(dataToValidate, { abortEarly: false });
};

export const validateSignInForm = signInFormValidator();
export const validateSignUpFirstStepForm = signUpFirstStepFormValidator();
export const validateSignUpSecondStepForm = signUpSecondStepFormValidator();
