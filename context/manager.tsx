import jullyApiService from '@services/jully-api.service';
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';

export type ManagerState = {
  id: number;
  name: string;
  email: string;
  birthday: string;
  billingAddress: {
    line1: string;
    line2: string;
    zipcode: string;
    city: string;
    state: string;
    country: string;
  };
  signature: {
    dueAt: string;
    plan: {
      id: number;
      name: string;
      botsQuantity: number;
      sessionsQuantity: number;
      messagesQuantity: number;
    };
  };
  applications: Array<{
    name: string;
    title: string;
    description: string;
    logotipo: string;
    icon: string;
    siteUrl: string;
  }>;
};

type ManagerContextData = {
  managerState: ManagerState;
  getManager: () => Promise<void>;
  clearManagerState: () => void;
};
type AuthProviderProps = {
  children: React.ReactNode;
};

const ManagerContext = createContext<ManagerContextData>(
  {} as ManagerContextData,
);

export function ManagerProvider({ children }: AuthProviderProps): JSX.Element {
  const [managerState, setManagerState] = useState<ManagerState>(
    {} as ManagerState,
  );

  useEffect(() => {
    const managerStateSerialized = localStorage.getItem('@jullybot:manager');

    if (managerStateSerialized) {
      const managerStateParsed = JSON.parse(managerStateSerialized);
      setManagerState(managerStateParsed);
    }
  }, []);

  const getManager = useCallback(async () => {
    const manager = await jullyApiService.getManager();

    localStorage.setItem('@jullybot:manager', JSON.stringify(manager));

    setManagerState(manager);
  }, []);

  const clearManagerState = useCallback(() => {
    localStorage.removeItem('@jullybot:manager');

    setManagerState({} as ManagerState);
  }, []);

  return (
    <ManagerContext.Provider
      value={{ managerState, getManager, clearManagerState }}
    >
      {children}
    </ManagerContext.Provider>
  );
}

export const useManager = (): ManagerContextData => {
  const context = useContext(ManagerContext);

  if (!context)
    throw new Error('useManager must be used inside an ManagerProvider');

  return context;
};
