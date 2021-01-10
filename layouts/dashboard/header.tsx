import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  IconButton,
  MenuItem,
  Toolbar,
  Menu as MenuMUI,
  Hidden,
  Tooltip,
} from '@material-ui/core';
import Icon from '@components/icons';
import { useAuth } from '@context/auth';
import { useManager } from '@context/hooks';
import { differenceInDays } from 'date-fns';
import * as FormStyle from '@styles/components/form.style';
import { PLANS } from 'configs/plans.enum';
import * as S from './style';

type AppBarProps = {
  handleDrawerToggle: (...args: any[]) => any;
};

export default function Header({
  handleDrawerToggle,
}: AppBarProps): JSX.Element {
  const router = useRouter();
  const { signOut } = useAuth();
  const { managerState, clearManagerState } = useManager();
  const [anchorEl, setAnchorEl] = useState(null);
  const accountMenuOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const getSignatureDaysRemaining = useMemo(() => {
    return differenceInDays(
      new Date(managerState.signature?.dueAt),
      new Date(),
    );
  }, [managerState.signature?.dueAt]);

  const planButtonTextHelper = useMemo(() => {
    if (!getSignatureDaysRemaining) return `Seu plano venceu`;
    if (managerState.signature.plan.name === PLANS.TRIAL)
      return `${getSignatureDaysRemaining} dias de uso restantes`;
  }, [getSignatureDaysRemaining, managerState.signature.plan.name]);

  const planButtonColorType = useMemo(() => {
    if (getSignatureDaysRemaining < 1) return 'inactive';
    return managerState.signature?.plan?.name === PLANS.TRIAL
      ? 'test'
      : 'active';
  }, [getSignatureDaysRemaining, managerState.signature?.plan?.name]);

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
    signOut();
    clearManagerState();
    router.push('signin');
  }, [handleAccountMenuClose, router, signOut, clearManagerState]);

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
          <Tooltip title={planButtonTextHelper} aria-label="add">
            <FormStyle.Button
              $colorType={planButtonColorType}
              variant="outlined"
            >
              {`Plano ${managerState.signature?.plan?.name}`}
            </FormStyle.Button>
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
