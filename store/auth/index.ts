import { atom } from 'recoil';
import { localStorageEffect } from 'store/recoil-effects';

export const authState = atom({
  key: 'auth',
  default: {
    accessToken: null,
  },
  effects_UNSTABLE: [localStorageEffect('auth')],
});
