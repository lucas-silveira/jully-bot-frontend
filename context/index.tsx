import React from 'react';
import { AuthProvider } from './auth';
import { ManagerProvider } from './manager';

type AppProviderProps = {
  children: React.ReactNode;
};

export default function AppProvider({
  children,
}: AppProviderProps): JSX.Element {
  return (
    <AuthProvider>
      <ManagerProvider>{children}</ManagerProvider>
    </AuthProvider>
  );
}
