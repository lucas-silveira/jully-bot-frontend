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

type BillingAddressForm = {
  formState: FormState;
  handleChange: (...args: any[]) => any;
};

export default function BillingAddressForm({
  formState,
  handleChange,
}: BillingAddressForm): JSX.Element {
  return (
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
        onChange={handleChange('billingAddressCity')}
        error={formState.error}
        label="Cidade"
        variant="filled"
        fullWidth
        helperText={formState.error ? 'Campo obrigatório' : ''}
      />
    </S.Form>
  );
}
