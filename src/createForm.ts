import React, { Component, createElement, PropTypes } from 'react';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { ReactiveMobxForm } from './Form';

import { fiedsSchema } from './interface';


export function reactiveMobxForm(formName: string, fields:fiedsSchema) {
	var form = new ReactiveMobxForm(fields); // for debugging/error handling purposes

	return wrappedForm => {
		form.component = wrappedForm;

		@inject('formStore')
		@observer
		class ReactiveMobxForm extends Component<{formStore: any, handleSubmit: any}, any> {
			static childContextTypes = {
				_ReactiveMobxForm: PropTypes.object.isRequired
			}

			getChildContext() {
				return {_ReactiveMobxForm: form};
			}

			componentWillMount() {
				this.props.formStore.registerForm(formName, form);
			}

			submitForm(event:Event) {
				event.preventDefault();
				
				form.submitting = true;
				console.log('handling submit from form and calling parent');
				Promise.all([this.props.handleSubmit(form.values)])
					.catch(error => {
						form.submissionError = error;
					})
					.then(result => {
						form.submitting = false;
					})
			}

			resetForm() {
				form.reset();
			}

			render() {
				return createElement(wrappedForm, {
					submit: this.submitForm.bind(this),
					reset: this.resetForm.bind(this),
					submitting: form.submitting, // todo: when submit change - full form render method is executed. Thing on more performat approach. May be Submitting component
					/*validation: form.validation, */ //todo - this case render been called when any field change
					isValid: form.isValid
				});
			}
		}

		return ReactiveMobxForm;
	}
}


