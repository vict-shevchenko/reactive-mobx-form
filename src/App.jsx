import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import beautify from 'json-beautify';
import ContactForm from './ContactForm';

const Button = inject('appState')(observer(({appState}) => <button>{appState.timer} -- {appState.showStreet.toString()}</button>));
const FormView = inject('formStore')(observer(({formStore}) => <pre>{beautify(formStore.forms, null, 2, 100)}</pre>));

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			extensionVisible: false
		}
		this.toggleExtension = this.toggleExtension.bind(this);
	}

	toggleExtension() {
		this.setState({extensionVisible: !this.state.extensionVisible});
	}

	handleSubmit(form) {
		return new Promise((resolve) => {
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
				<style dangerouslySetInnerHTML={this.createMarkup()}/>
				<Button/>
				<ContactForm onSubmit={this.handleSubmit.bind(this)} schema={{firstName: ['viktor']}} paramToForm={'My Custom Parameter'}/>
				<button type="button" onClick={this.toggleExtension}> SHOW/HIDE</button>
				<FormView />
			</div>
		);
	}
}