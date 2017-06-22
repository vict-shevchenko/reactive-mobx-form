import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react';

import { FormStore } from 'reactive-mobx-form';
import App from './scripts/App';


const formStore = new FormStore();

ReactDOM.render(
	<Provider formStore={formStore}>
		<HashRouter>
			<App />
		</HashRouter>
	</Provider>,
	document.getElementById('root')
);