import { createGlobalStyle } from 'styled-components'

export const device = {
  tablet: `(min-width: 768px) and (max-width: 1199px)`,
  mobile: `(max-width: 767px)`,
}

export const GlobalStyle = createGlobalStyle`

:root{
  --gray-10:#FFFFFF;
  --gray-20:#F9F9F9;
  --gray-30:#CFCFCF;
  --gray-40:#818181;
  --gray-50:#515151;
  --gray-55:#262626;
  --gray-60:#202124;
  --brown-10:#F5F1EE;
  --brown-20:#E4D5C9;
  --brown-30:#C7BBB5;
  --brown-40:#542F1A;
  --brown-50:#341909;
  --blue:#1877F2;
  --red:#B93333;
  --yellow:#FEE500;
  --orange:#F2B33D;
  --sky-blue:#CCEFFC;
}

*{
    box-sizing: border-box;
    font-family: 'Pretendard', 'Actor', sans-serif;
  }
html {
    font-size: 62.5%;
  }
  
  body {
    // background: var(--gray-20); // dark
    // // background: var(--gray-60);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
  
  ul {
    padding: 0;
    margin: 0;
  }
  
  fieldset,
  input,
  label {
    all: unset;
  }
  
  button {
    background: none;
    outline: none;
    border: none;
    margin: 0;
    padding: 0;
  }
  
  a {
    text-decoration: none;
  }
  
  #root {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`
