import React from 'react';
import { Provider } from 'mobx-react';
import { render } from 'react-dom';
import AppState from './AppState';
import App from './App';
import { FormStore, configureValidator } from 'reactive-mobx-form';

const appState = new AppState();
const formStore = new FormStore();

configureValidator({
    language: 'ru'
});

render(
    <Provider appState={appState} formStore={formStore}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
