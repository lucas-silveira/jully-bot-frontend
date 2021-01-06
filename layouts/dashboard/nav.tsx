import { useMemo } from 'react';
import { Drawer, Hidden, useTheme } from '@material-ui/core';
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
  const classes = S.useStyles();

  const container = useMemo(
    () => (window !== undefined ? () => window().document.body : undefined),
    [window],
  );

  return (
    <S.LayoutNav aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <Menu />
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <Menu />
        </Drawer>
      </Hidden>
    </S.LayoutNav>
  );
}
