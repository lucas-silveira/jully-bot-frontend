import axios from 'axios';

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

export const jullyAPI = axios.create({
  baseURL: 'http://localhost:3000',
});

export const viaCepAPI = axios.create({
  baseURL: 'https://viacep.com.br/ws',
});
