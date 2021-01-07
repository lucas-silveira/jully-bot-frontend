import { useMemo } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/HomeRounded';
import FaceIcon from '@material-ui/icons/FaceRounded';
import ForumIcon from '@material-ui/icons/ForumRounded';
import GroupIcon from '@material-ui/icons/GroupRounded';
import * as S from './styles';

type IconProps = {
  name: string;
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
    }),
    [],
  );

  return <S.IconWrapper color={color}>{icons[name]}</S.IconWrapper>;
}
