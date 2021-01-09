import jullyApiService from 'services/jully-api.service';

export type AuthState = {
  managerId: number;
  accessToken: string;
};

export const setApiServiceToken = ({ onSet }): void => {
  if (typeof localStorage === 'undefined') return;

  let savedValue: AuthState | string = localStorage.getItem('auth');
  if (savedValue !== null) {
    savedValue = JSON.parse(savedValue) as AuthState;
    jullyApiService.setAuthorizationToken(savedValue.accessToken);
  }

  onSet((newValue: AuthState) => {
    jullyApiService.setAuthorizationToken(newValue.accessToken);
  });
};
