import { useState, useCallback, useMemo } from 'react';
import {
  IconButton,
  MenuItem,
  Toolbar,
  Menu as MenuMUI,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { AccountCircle } from '@material-ui/icons';
import { useSetRecoilState } from 'recoil';
import { authState } from 'store/auth';
import { useRouter } from 'next/router';
import * as S from './style';

type AppBarProps = {
  handleDrawerToggle: (...args: any[]) => any;
};

export default function Header({
  handleDrawerToggle,
}: AppBarProps): JSX.Element {
  const router = useRouter();
  const setAuthState = useSetRecoilState(authState);
  const [anchorEl, setAnchorEl] = useState(null);
  const accountMenuOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleAccountMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleAccountMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSignOut = useCallback(() => {
    handleAccountMenuClose();
    setAuthState(oldValues => ({
      ...oldValues,
      accessToken: null,
    }));
    router.push('signin');
  }, [handleAccountMenuClose, setAuthState, router]);

  return (
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
            <MenuItem onClick={handleSignOut}>Sair</MenuItem>
          </MenuMUI>
        </div>
      </Toolbar>
    </S.LayoutAppBar>
  );
}
