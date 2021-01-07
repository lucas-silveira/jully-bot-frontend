import Icon from '@components/icons';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { useMemo } from 'react';
import * as S from './style';

type MenuItem = {
  label: string;
  icon: JSX.Element;
};

export default function Menu(): JSX.Element {
  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: 'Overview',
        icon: <Icon name="home" />,
      },
      {
        label: 'Bots',
        icon: <Icon name="face" />,
      },
      {
        label: 'Sessões',
        icon: <Icon name="forum" />,
      },
      {
        label: 'Clientes',
        icon: <Icon name="group" />,
      },
    ],
    [],
  );

  return (
    <div>
      <S.LayoutMenu>
        <h6>JullyBot</h6>
      </S.LayoutMenu>
      <List>
        {menuItems.map(item => (
          <ListItem button key={item.label}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
