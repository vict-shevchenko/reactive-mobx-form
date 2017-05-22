import React, { Component, createElement, PropTypes } from 'react';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { ReactiveMobxForm } from './Form';

import { formSchema } from './interface';


export function reactiveMobxForm(formName: string, schema?:formSchema ) {
	var form = new ReactiveMobxForm(schema); 

	return wrappedForm => {
		form.component = wrappedForm; // for debugging/error handling purposes

		@inject('formStore')
		@observer
		class ReactiveMobxForm extends Component<{formStore: any, onSubmit?: any, schema?:formSchema }, any> {
			static childContextTypes = {
				_ReactiveMobxForm: PropTypes.object.isRequired
			}

			getChildContext() {
				return {_ReactiveMobxForm: form};
			}

			componentWillMount() {
				const schemaExtenstion = this.props.schema;
				
				if(schemaExtenstion && typeof schemaExtenstion === 'object' && !Array.isArray(schemaExtenstion)) {
					form.extend(schemaExtenstion);
				}

				this.props.formStore.registerForm(formName, form);
			}

			componentWillUnmount() {
				this.props.formStore.unRegisterForm(formName);
			}

			submitForm(event:Event) {
				event.preventDefault();
				
				form.submitting = true;
				console.log('handling submit from form and calling parent');
				Promise.all([this.props.onSubmit(form.values)])
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