import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/HomeRounded';
import FaceIcon from '@material-ui/icons/FaceRounded';
import ForumIcon from '@material-ui/icons/ForumRounded';
import GroupIcon from '@material-ui/icons/GroupRounded';
import { useMemo } from 'react';
import * as S from './style';

type MenuItem = {
  label: string;
  icon: JSX.Element;
};

export default function Menu(): JSX.Element {
  const classes = S.useStyles();

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: 'Overview',
        icon: <HomeIcon />,
      },
      {
        label: 'Bots',
        icon: <FaceIcon />,
      },
      {
        label: 'Sessões',
        icon: <ForumIcon />,
      },
      {
        label: 'Clientes',
        icon: <GroupIcon />,
      },
    ],
    [],
  );

  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
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
