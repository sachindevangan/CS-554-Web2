import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import './index.css';
import {BrowserRouter} from 'react-router-dom';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
import { Provider } from 'react-redux';
import store from './store';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
   <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
  </ApolloProvider>
);
