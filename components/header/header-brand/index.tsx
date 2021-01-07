import { Toolbar } from '@material-ui/core';
import Link from 'next/link';
import * as S from './styles';

export default function HeaderBrand(): JSX.Element {
  return (
    <S.AppBar>
      <Toolbar>
        <h6>JullyBot</h6>
        <S.Menu>
          <Link href="/signin" passHref>
            <S.Link>Entrar</S.Link>
          </Link>
          <Link href="/signup" passHref>
            <S.Link filled>Experimente gratuitamente</S.Link>
          </Link>
        </S.Menu>
      </Toolbar>
    </S.AppBar>
  );
}
