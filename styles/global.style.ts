import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  :root {
    --primary-color: #52489C;
    --secodanry-color: #59C3C3;
    --dark-sea-green-color: #84a98c;
    --ash-gray-color: #CAD2C5;
    --platinum-color: #EBEBEB;
  }

  body {
    color: #333;
    background-color: #EBEBEB;
    font-family: Roboto, Helvetica, sans-serif;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2.4rem;
  }

  h3 {
    font-size: 2rem;
  }

  h4 {
    font-size: 1.6rem;
  }

  h5, h6 {
    font-size: 1.2rem;
  }

  h1, h2, h3, h4, h5, h6, a {
    color: #52489C;
  }

  a {
    text-decoration: none;
  }
`;
