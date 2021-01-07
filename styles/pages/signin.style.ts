import styled from 'styled-components';

export const LayoutWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: 100vh;
`;

export const LayoutMain = styled.section`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 542px;
  padding: 20px;

  > header {
    margin-bottom: 40px;

    h2 {
      margin-bottom: 16px;
    }
  }

  > footer {
    p {
      color: rgba(0, 0, 0, 0.4);
    }

    p + p {
      margin-top: 16px;
    }
  }
`;
