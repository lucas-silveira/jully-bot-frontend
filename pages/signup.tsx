import { useCallback, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Fade } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { debounce } from 'lodash';
import HeaderBrand from '@components/header/header-brand';
import Steps from '@components/steps';
import { removeSpecialCharacters } from '@utils/string-parser';
import { viaCepAPI, ViaCepResponse } from '@utils/api';
import { zipcodeRegex } from '@utils/string-regex';
import * as S from '@styles/pages/signup.style';
import SignUpForm from '@components/forms/signup-form';
import BillingAddressForm from '@components/forms/billing-address-form';

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

const getCepDebouncer = debounce(
  async (zipcode: string, callback: (object: object) => void) => {
    const zipcodeParsed = removeSpecialCharacters(zipcode);
    const { data } = await viaCepAPI.get<ViaCepResponse>(
      `/${zipcodeParsed}/json/`,
    );

    callback({
      billingAddressLine1: data.logradouro,
      billingAddressLine2: data.bairro,
      billingAddressCity: data.localidade,
      billingAddressState: data.uf,
    });
  },
  500,
);

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

  const getAndSetAddressDataByZipcode = useCallback((zipcode: string) => {
    if (!zipcodeRegex.test(zipcode)) return;

    getCepDebouncer.cancel();
    getCepDebouncer(zipcode, newValues =>
      setFormState(oldValues => ({
        ...oldValues,
        ...newValues,
      })),
    );
  }, []);

  const handleChange = useCallback(
    (prop: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState(oldValues => ({ ...oldValues, [prop]: event.target.value }));

      if (prop === 'billingAddressZipcode')
        getAndSetAddressDataByZipcode(event.target.value);
    },
    [getAndSetAddressDataByZipcode],
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
              <p>
                Ao cadastrar, você ganha 14 dias gratuítos para testar a Jully.
                Cancele quando quiser.
              </p>
            </header>
            <Steps
              steps={[
                {
                  title: 'Seus dados',
                  content: (
                    <Fade in>
                      <SignUpForm
                        formState={formState}
                        handleChange={handleChange}
                        handleClickShowPassword={handleClickShowPassword}
                        handleMouseDownPassword={handleMouseDownPassword}
                        handleDateChange={handleDateChange}
                      />
                    </Fade>
                  ),
                },
                {
                  title: 'Dados de cobrança',
                  content: (
                    <Fade in>
                      <BillingAddressForm
                        formState={formState}
                        handleChange={handleChange}
                      />
                    </Fade>
                  ),
                },
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
