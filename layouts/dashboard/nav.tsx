import { useMemo } from 'react';
import { Hidden, useTheme } from '@material-ui/core';
import Menu from './menu';
import * as S from './style';

type NavProps = {
  window?: () => Window;
  mobileOpen: boolean;
  handleDrawerToggle: (...args: any[]) => any;
};

export default function Nav({
  window,
  mobileOpen,
  handleDrawerToggle,
}: NavProps): JSX.Element {
  const theme = useTheme();

  const container = useMemo(
    () => (window !== undefined ? () => window().document.body : undefined),
    [window],
  );

  return (
    <S.LayoutNav aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <S.LayoutDrawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <Menu />
        </S.LayoutDrawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <S.LayoutDrawer variant="permanent" open>
          <Menu />
        </S.LayoutDrawer>
      </Hidden>
    </S.LayoutNav>
  );
}
