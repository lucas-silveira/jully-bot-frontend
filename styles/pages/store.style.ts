import styled from 'styled-components';
import { Card, CardContent } from '@material-ui/core';

export const Wrapper = styled.section`
  padding: 20px;
`;

export const Header = styled.header`
  display: flex;
  margin-bottom: 10px;

  h4 {
    flex-grow: 1;
  }
`;

export const Main = styled.main`
  margin-top: 20px;
`;

export const AppsList = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;

  @media (max-width: 719px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 720px) and (max-width: 959px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const AppCard = styled(Card)`
  footer {
    padding: 10px 20px 20px;

    p {
      color: var(--dark-sea-green-color);
      font-weight: 600;
      text-align: right;
      text-transform: uppercase;
    }
  }
`;

export const AppCardContent = styled(CardContent)`
  p {
    margin-top: 10px;
  }
`;
