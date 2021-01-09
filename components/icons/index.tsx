import { useMemo } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/HomeRounded';
import FaceIcon from '@material-ui/icons/FaceRounded';
import ForumIcon from '@material-ui/icons/ForumRounded';
import GroupIcon from '@material-ui/icons/GroupRounded';
import LayersIcon from '@material-ui/icons/Layers';
import * as S from './styles';

type Icons = {
  menu: string;
  accountCircle: string;
  home: string;
  face: string;
  forum: string;
  group: string;
  layers: string;
};

type IconProps = {
  name: keyof Icons;
  color?: string;
};

export default function Icon({ name, color }: IconProps): JSX.Element {
  const icons = useMemo(
    () => ({
      menu: <MenuIcon />,
      accountCircle: <AccountCircle />,
      home: <HomeIcon />,
      face: <FaceIcon />,
      forum: <ForumIcon />,
      group: <GroupIcon />,
      layers: <LayersIcon />,
    }),
    [],
  );

  return <S.IconWrapper color={color}>{icons[name]}</S.IconWrapper>;
}
