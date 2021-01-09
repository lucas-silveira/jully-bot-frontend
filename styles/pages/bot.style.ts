import styled from 'styled-components';

export const Wrapper = styled.section`
  padding: 20px;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  height: 32px;

  h4 {
    flex-grow: 1;
  }

  svg {
    color: var(--primary-color);
    margin-right: 10px;
  }
`;
