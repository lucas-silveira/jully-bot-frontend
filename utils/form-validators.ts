import * as yup from 'yup';

export type FormValidationError = {
  field: string;
  message: string;
};

const signInFormValidator = () => {
  type ObjectSchema = {
    email: string;
    password: string;
  };

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(() => ({
        field: 'email',
        message: 'Precisa ser um e-mail válido',
      }))
      .required(({ path }) => ({
        field: path,
        message: 'O e-mail é obrigatório',
      })),
    password: yup.string().required(({ path }) => ({
      field: path,
      message: 'A senha é obrigatória',
    })),
  });

  return async (dataToValidate: ObjectSchema) =>
    schema.validate(dataToValidate, { abortEarly: false });
};

export const validateSignInForm = signInFormValidator();
