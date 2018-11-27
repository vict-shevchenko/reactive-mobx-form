import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import beautify from 'json-beautify';

import ContactForm from './ContactForm';
import FormExtension from "./FormExtension";

const Button = inject('appState')(observer(({appState}) => <button>{appState.timer} -- {appState.showStreet.toString()}</button>));

const FormView = inject('formStore')(observer(({formStore}) => <pre>{beautify(formStore.forms, null, 2, 100)}</pre>));

// const FormView = inject('formStore')(({formStore}) => <pre>{JSON.stringify(formStore.forms)}</pre>);


class App extends Component {
	constructor() {
		super();

		this.state = {
			extensionVisible: false
		}

		this.toggleExtension = this.toggleExtension.bind(this);
	}

	toggleExtension() {
		this.setState({extensionVisible: !this.state.extensionVisible});
	}

	/*handleSubmit(form) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				console.log(JSON.stringify(form));
				resolve('done');
			}, 1500)
		})
	}*/

	handleSubmit(form) {
		return new Promise((resolve, reject) => {
			console.log(JSON.stringify(form));
			setTimeout(() => {
				resolve('success');
			}, 1500)
		})
	}

	createMarkup() {
		return {
			__html: `.rmf-invalid {
				border: 1px solid red;
			}
			
			.rmf-valid {
				border: 1px solid green
			}`
		};
	}


	render() {
		return (
			<div>
				<style dangerouslySetInnerHTML={this.createMarkup()}>

				</style>
				<Button/>
				{/*<button onClick={this.onReset}>
					Seconds passed: {this.props.appState.timer}
				</button>*/}

				<ContactForm onSubmit={this.handleSubmit.bind(this)} schema={{firstName: ['viktor']}} paramToForm={'My Custom Parameter'}/>
				{ /* this.state.extensionVisible ? <FormExtension schema={{river: 'Dnipro'}} /> : null */}

				<button type="button" onClick={this.toggleExtension}> SHOW/HIDE</button>

				{/*<pre>{beautify(this.props.formStore.forms, null, 2, 100)}</pre>*/}
				<FormView />
				<DevTools />
			</div>
		);
	}

	onReset = () => {
		this.props.appState.resetTimer();
	}
}

export default App;
