import styled, { css } from 'styled-components';
import { AppBar as AppBarMUI } from '@material-ui/core';
import NextLink from 'next/link';

export const AppBar = styled(AppBarMUI).attrs(() => ({
  position: 'static',
  color: 'transparent',
}))`
  box-shadow: none;

  h6 {
    flex-grow: 1;
  }
`;

export const Menu = styled.div`
  a + a {
    margin-left: 20px;
  }
`;

type Link = {
  filled?: boolean;
};
export const Link = styled.a<Link>`
  ${props =>
    props.filled &&
    css`
      color: #fff;
      background-color: var(--primary-color);
      padding: 10px;
      border-radius: 5px;
    `}
`;
