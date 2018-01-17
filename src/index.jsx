import React from 'react';
import { Provider } from 'mobx-react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import AppState from './AppState';
import App from './App';

import { FormStore, configureValidator } from 'reactive-mobx-form';

const appState = new AppState();
const formStore = new FormStore();

configureValidator({
	language: 'ru'
});

render(
  <AppContainer>
      <Provider appState={appState} formStore={formStore}>
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
          <Provider appState={appState} formStore={formStore}>
              <App />
          </Provider>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
