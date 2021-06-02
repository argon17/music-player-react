import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import theme from "./theme";
import client from './graphql/client';
import { ApolloProvider } from '@apollo/client/react';

ReactDOM.render(
    <ApolloProvider client={client}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <App/>
        </MuiThemeProvider>
    </ApolloProvider>,
     
    document.getElementById('root')
);
