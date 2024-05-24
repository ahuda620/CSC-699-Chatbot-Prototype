import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


import "@fortawesome/fontawesome-free/css/all.min.css";

import "mdbreact/dist/css/mdb.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

import { AuthContextProvider } from './context/AuthContext'; //importing global context for login


import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/open-sans";
import "@fontsource/poppins";

const theme = extendTheme({
  fonts: {
    body: `Poppins, sans-serif`,
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </AuthContextProvider>
);

