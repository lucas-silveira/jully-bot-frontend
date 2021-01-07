import styled from 'styled-components';
import { AppBar as AppBarMUI, Drawer } from '@material-ui/core';

export const LayoutWrapper = styled.section`
  display: grid;
  grid-template-areas:
    'header header header'
    'nav main main';
  grid-gap: 10px;
  grid-template-columns: 240px 1fr 1fr;
  grid-template-rows: 64px 1fr;
  min-height: 100vh;
  background-color: var(--platinum-color);
  padding: 10px;

  @media (max-width: 959px) {
    grid-template-areas:
      'header'
      'main';
    grid-template-columns: 1fr;
  }
`;

export const LayoutAppBar = styled(AppBarMUI).attrs(() => ({
  position: 'fixed',
  elevation: 0,
}))`
  grid-area: header;
  height: 64px;
  color: var(--primary-color);
  background-color: var(--platinum-color);

  > div {
    display: flex;
    justify-content: space-between;

    > div {
      display: flex;
      align-items: center;

      button > span > div {
        font-size: 1rem;
        margin-right: 5px;
      }
    }
  }

  h6 {
    flex-grow: 1;
  }

  @media (min-width: 960px) {
    > div {
      > div {
        button {
          border-radius: 5px;
        }
      }

      > button {
        display: none;
      }
    }
  }
`;

export const LayoutNav = styled.nav`
  grid-area: nav;
`;

export const LayoutMenu = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 16px;

  h6 {
    color: inherit;
  }
`;

export const LayoutDrawer = styled(Drawer)`
  .MuiPaper-root {
    width: 240px;
    color: #fff;
    background-color: var(--primary-color);
  }

  h6 {
    color: inherit;
  }
`;

export const LayoutMain = styled.section`
  grid-area: main;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.12);
`;
