import React from 'react';
import { Provider } from 'mobx-react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppState from './AppState';
import App from './App';

import { FormStore } from 'mobx-reactive-form';

const appState = new AppState();
const formState = new FormStore();

render(
  <AppContainer>
      <Provider appState={appState} formState={formState}>
          <App />
      </Provider>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;

    render(
      <AppContainer>
          <Provider appState={appState} formState={formState}>
              <App />
          </Provider>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
