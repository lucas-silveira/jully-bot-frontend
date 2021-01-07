import { useState, useCallback } from 'react';
import * as S from './style';
import Header from './header';
import Nav from './nav';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(oldValue => !oldValue);
  }, []);

  return (
    <S.LayoutWrapper>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Nav mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <S.LayoutMain>{children}</S.LayoutMain>
    </S.LayoutWrapper>
  );
}
