import styled from 'styled-components';

export const Wrapper = styled.section`
  padding: 20px;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  height: 32px;

  .MuiChip-root {
    font-size: 0.7rem;
    height: 18px;
    margin-left: 10px;
  }

  svg {
    color: var(--primary-color);
    margin-right: 10px;
  }
`;
