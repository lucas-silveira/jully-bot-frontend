import Icon from '@components/icons';
import { List, ListItemIcon, ListItemText } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import * as S from './style';

type MenuItem = {
  label: string;
  icon: JSX.Element;
  href: string;
};

export default function Menu(): JSX.Element {
  const router = useRouter();
  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: 'Visão geral',
        icon: <Icon name="home" />,
        href: '/dashboard',
      },
      {
        label: 'Bots',
        icon: <Icon name="adb" />,
        href: '/bots',
      },
      {
        label: 'Sessões',
        icon: <Icon name="forum" />,
        href: '/sessions',
      },
      {
        label: 'Clientes',
        icon: <Icon name="group" />,
        href: '/customers',
      },
      {
        label: 'Aplicativos',
        icon: <Icon name="layers" />,
        href: '/applications',
      },
      {
        label: 'Loja',
        icon: <Icon name="cart" />,
        href: '/store',
      },
    ],
    [],
  );

  const handleClickItem = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      router.push(event.currentTarget.dataset.href);
    },
    [router],
  );

  return (
    <S.LayoutMenu>
      <div>
        <h6>JullyBot</h6>
      </div>
      <List>
        {menuItems.map(item => (
          <S.MenuListItem
            button
            data-href={item.href}
            onClick={handleClickItem}
            key={item.label}
            selected={router.pathname === item.href}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </S.MenuListItem>
        ))}
      </List>
    </S.LayoutMenu>
  );
}
