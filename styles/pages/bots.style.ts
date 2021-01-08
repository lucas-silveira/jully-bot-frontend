import styled from 'styled-components';
import { List as ListMUI } from '@material-ui/core';

export const Wrapper = styled.section`
  padding: 20px;
`;

export const Header = styled.header`
  display: flex;
  height: 32px;

  h4 {
    flex-grow: 1;
  }
`;

export const List = styled(ListMUI)`
  margin-top: 20px;

  li:nth-child(2n + 1) {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
