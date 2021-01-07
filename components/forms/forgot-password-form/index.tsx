import { CircularProgress } from '@material-ui/core';
import * as FormStyle from '@styles/components/form.style';
import * as S from './styles';

type FormState = {
  email: string;
  isSending: boolean;
  emailSent: boolean;
  errors: {
    [key: string]: string;
  };
};

type ForgotPasswordForm = {
  formState: FormState;
  handleSubmit: (...args: any[]) => any;
  handleChange: (...args: any[]) => any;
};

export default function ForgotPasswordForm({
  formState,
  handleSubmit,
  handleChange,
}: ForgotPasswordForm): JSX.Element {
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
      <FormStyle.SubmitButton
        variant="contained"
        disabled={formState.isSending}
        fullWidth
      >
        {formState.isSending ? (
          <CircularProgress size={14} color="inherit" />
        ) : (
          'Enviar instruções de recuperação'
        )}
      </FormStyle.SubmitButton>
    </S.Form>
  );
}
