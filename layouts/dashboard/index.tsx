import { useState, useCallback, useMemo } from 'react';
import {
  Drawer,
  Hidden,
  IconButton,
  MenuItem,
  Toolbar,
  useTheme,
  Menu as MenuMUI,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle } from '@material-ui/icons';
import Menu from './menu';
import * as S from './style';

type DashboardLayoutProps = {
  window?: () => Window;
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
  window,
}: DashboardLayoutProps): JSX.Element {
  const theme = useTheme();
  const classes = S.useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const accountMenuOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(oldValue => !oldValue);
  }, []);

  const container = useMemo(
    () => (window !== undefined ? () => window().document.body : undefined),
    [window],
  );

  return (
    <S.LayoutWrapper>
      <S.LayoutAppBar>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <h6>JullyBot</h6>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleAccountMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <MenuMUI
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={accountMenuOpen}
              onClose={handleAccountMenuClose}
            >
              <MenuItem onClick={handleAccountMenuClose}>Minha conta</MenuItem>
              <MenuItem onClick={handleAccountMenuClose}>Sair</MenuItem>
            </MenuMUI>
          </div>
        </Toolbar>
      </S.LayoutAppBar>
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
      <S.LayoutMain>{children}</S.LayoutMain>
    </S.LayoutWrapper>
  );
}
