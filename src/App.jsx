import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import ContactForm from './ContactForm';

@inject('appState', 'formStore')
@observer
class App extends Component {
	render() {
		return (
			<div>
				<button onClick={this.onReset}>
					Seconds passed: {this.props.appState.timer}
				</button>

				<ContactForm handleSubmit={() => {
					console.log('form submit')
				}} />

				<pre>{JSON.stringify(this.props.formStore)}</pre>
				<DevTools />
			</div>
		);
	}

	onReset = () => {
		this.props.appState.resetTimer();
	}
}
;

export default App;
