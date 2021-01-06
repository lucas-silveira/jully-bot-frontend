import axios from 'axios';
import { debounce } from 'lodash';
import { removeSpecialCharacters } from './string-parser';

export type ViaCepResponse = {
  bairro: string;
  cep: string;
  complemento: string;
  ddd: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  siafi: string;
  uf: string;
};

export const viaCepAPI = axios.create({
  baseURL: 'https://viacep.com.br/ws',
});

export const getCepDebouncer = debounce(
  async (zipcode: string, callback: (object: object) => void) => {
    const zipcodeParsed = removeSpecialCharacters(zipcode);
    const { data } = await viaCepAPI.get<ViaCepResponse>(
      `/${zipcodeParsed}/json/`,
    );

    callback({
      logradouro: data.logradouro,
      bairro: data.bairro,
      localidade: data.localidade,
      uf: data.uf,
    });
  },
  500,
);
