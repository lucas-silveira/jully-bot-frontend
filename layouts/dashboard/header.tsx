import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  IconButton,
  MenuItem,
  Toolbar,
  Menu as MenuMUI,
  Hidden,
  Button,
  Tooltip,
} from '@material-ui/core';
import Icon from '@components/icons';
import * as S from './style';

type AppBarProps = {
  handleDrawerToggle: (...args: any[]) => any;
};

export default function Header({
  handleDrawerToggle,
}: AppBarProps): JSX.Element {
  const router = useRouter();
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
    setAuthState({
      managerId: null,
      accessToken: null,
    });
    router.push('signin');
  }, [handleAccountMenuClose, setAuthState, router]);

  return (
    <S.LayoutHeader>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
        >
          <Icon name="menu" color="#52489C" />
        </IconButton>
        <h6>JullyBot</h6>
        <div>
          <Tooltip title="15 dias de uso restantes" aria-label="add">
            <Button
              style={{ color: '#ff9800', borderColor: '#ff9800' }}
              variant="outlined"
              color="primary"
            >
              Plano trial
            </Button>
          </Tooltip>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleAccountMenu}
          >
            <Icon name="accountCircle" color="#52489C" />
            <Hidden smDown implementation="css">
              Minha Conta
            </Hidden>
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
    </S.LayoutHeader>
  );
}
