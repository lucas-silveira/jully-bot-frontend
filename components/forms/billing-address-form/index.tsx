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
  loadedAddress: boolean;
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
        error={!!formState.errors.zipcode}
        label="Cep"
        variant="filled"
        fullWidth
        helperText={formState.errors.zipcode || ''}
      />
      {formState.loadedAddress && (
        <>
          <FormStyle.TextField
            type="text"
            value={formState.billingAddressLine1}
            onChange={handleChange('billingAddressLine1')}
            error={!!formState.errors.line1}
            label="Rua"
            variant="filled"
            fullWidth
            helperText={formState.errors.line1 || ''}
          />
          <FormStyle.TextField
            type="text"
            value={formState.billingAddressLine2}
            onChange={handleChange('billingAddressLine2')}
            error={!!formState.errors.line2}
            label="Bairro"
            variant="filled"
            fullWidth
            helperText={formState.errors.line2 || ''}
          />
          <FormStyle.TextField
            type="text"
            value={formState.billingAddressCity}
            onChange={handleChange('billingAddressCity')}
            error={!!formState.errors.city}
            label="Cidade"
            variant="filled"
            fullWidth
            helperText={formState.errors.city || ''}
          />
          <FormStyle.TextField
            type="text"
            value={formState.billingAddressState}
            onChange={handleChange('billingAddressState')}
            error={!!formState.errors.state}
            label="Estado"
            variant="filled"
            fullWidth
            helperText={formState.errors.state || ''}
          />
        </>
      )}
    </S.Form>
  );
}
