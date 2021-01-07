import styled from 'styled-components';
import {
  AppBar as AppBarMUI,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';

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
}))`
  grid-area: header;
  height: 64px;

  > div {
    display: flex;
    justify-content: space-between;
    background-color: var(--primary-color);

    @media (min-width: 960px) {
      > button {
        display: none;
      }
    }
  }

  h6 {
    flex-grow: 1;
    color: #fff;
  }
`;

export const LayoutNav = styled.nav`
  grid-area: nav;

  .MuiPaper-root {
    width: 240px;
    z-index: 1000;
  }
`;

export const LayoutMain = styled.section`
  grid-area: main;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.12);
`;

export const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: 240,
    },
  });
});
