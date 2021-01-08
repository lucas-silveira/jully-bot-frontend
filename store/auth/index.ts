import { atom } from 'recoil';
import { localStorageEffect } from 'store/recoil-effects';
import { setApiServiceToken } from './effects';

export type AuthState = {
  managerId: number;
  accessToken: string;
};

export const authState = atom<AuthState>({
  key: 'auth',
  default: {
    managerId: null,
    accessToken: null,
  },
  effects_UNSTABLE: [localStorageEffect('auth'), setApiServiceToken],
});
