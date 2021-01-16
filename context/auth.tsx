import jullyApiService from '@services/jully-api.service';
import { createContext, useCallback, useContext, useState } from 'react';

export type AuthState = {
  managerId: number;
  accessToken: string;
};
type SignInDTO = {
  email: string;
  password: string;
};
type AuthContextData = {
  authState: AuthState;
  signIn(dto: SignInDTO): Promise<void>;
  signOut(): void;
};
type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (typeof localStorage === 'undefined') return {};

    const authStateSerialized = localStorage.getItem('@jullybot:auth');

    if (authStateSerialized) {
      const authStateParsed = JSON.parse(authStateSerialized);
      jullyApiService.setAuthorizationToken(authStateParsed.accessToken);
      jullyApiService.setManagerId(authStateParsed.managerId);
      return authStateParsed;
    }

    return {};
  });

  const signIn = useCallback(async ({ email, password }: SignInDTO) => {
    const session = await jullyApiService.createSession(email, password);

    localStorage.setItem('@jullybot:auth', JSON.stringify(session));
    jullyApiService.setAuthorizationToken(session.accessToken);
    jullyApiService.setManagerId(session.managerId);

    setAuthState(session);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@jullybot:auth');

    setAuthState({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ authState, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used inside an AuthProvider');

  return context;
};
