import styled from 'styled-components';

export const LayoutWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: start;
  min-height: 100%;
`;

export const LayoutMain = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
  }
`;

export const Form = styled.form`
  margin-bottom: 50px;

  > div + div,
  > button {
    margin-top: 20px;
  }
`;
