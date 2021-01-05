import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  :root {
    --primary-color: #52489C;
    --secudanry-color: #59C3C3;
    --dark-sea-green: #84a98c;
    --ash-gray: #CAD2C5;
    --platinum: #EBEBEB;
  }

  body {
    color: #333;
    background-color: #EBEBEB;
    font-family: Roboto, Helvetica, sans-serif;
  }

  h1, h2, h3, h4, h5, h6, a {
    color: #52489C;
  }
`;
