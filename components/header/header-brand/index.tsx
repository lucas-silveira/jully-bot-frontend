import { Toolbar } from '@material-ui/core';
import * as S from './styles';

export default function HeaderBrand(): JSX.Element {
  return (
    <S.AppBar>
      <Toolbar>
        <h6>JullyBot</h6>
      </Toolbar>
    </S.AppBar>
  );
}
