import { useMemo } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/HomeRounded';
import AdbIcon from '@material-ui/icons/Adb';
import ForumIcon from '@material-ui/icons/ForumRounded';
import GroupIcon from '@material-ui/icons/GroupRounded';
import LayersIcon from '@material-ui/icons/Layers';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import LinkIcon from '@material-ui/icons/Link';
import * as S from './styles';

type Icons = {
  menu: string;
  accountCircle: string;
  home: string;
  adb: string;
  forum: string;
  group: string;
  layers: string;
  save: string;
  edit: string;
  add: string;
  delete: string;
  cancel: string;
  link: string;
};

type IconProps = {
  name: keyof Icons;
  color?: string;
  fontSize?: 'inherit' | 'default' | 'small' | 'large';
};

export default function Icon({
  name,
  color,
  fontSize = 'default',
}: IconProps): JSX.Element {
  const icons = useMemo(
    () => ({
      menu: <MenuIcon fontSize={fontSize} />,
      accountCircle: <AccountCircle fontSize={fontSize} />,
      home: <HomeIcon fontSize={fontSize} />,
      adb: <AdbIcon fontSize={fontSize} />,
      forum: <ForumIcon fontSize={fontSize} />,
      group: <GroupIcon fontSize={fontSize} />,
      layers: <LayersIcon fontSize={fontSize} />,
      save: <CheckCircleIcon fontSize={fontSize} />,
      edit: <EditIcon fontSize={fontSize} />,
      add: <AddIcon fontSize={fontSize} />,
      delete: <DeleteIcon fontSize={fontSize} />,
      cancel: <CancelIcon fontSize={fontSize} />,
      link: <LinkIcon fontSize={fontSize} />,
    }),
    [fontSize],
  );

  return <S.IconWrapper color={color}>{icons[name]}</S.IconWrapper>;
}
