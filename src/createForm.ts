import React, { Component, createElement, PropTypes } from 'react';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { ReactiveMobxForm } from './Form';

import { formSchema } from './interface';

function isFormSchemaValid(schema: formSchema) {
	return schema && typeof schema === 'object' && !Array.isArray(schema)
}


export function reactiveMobxForm(formName: string, initialSchema: formSchema = {}) {

	return wrappedForm => {
		@inject('formStore')
		@observer
		class Form extends Component<{ formStore: any, onSubmit?: any, schema?: formSchema }, any> {
			form: ReactiveMobxForm;

			static childContextTypes = {
				_ReactiveMobxForm: PropTypes.object.isRequired
			}

			static defaultProps = {
				schema: {}
			};

			constructor(props, context) {
				super(props, context);
				
				// todo: remove for production build
				const mergedSchema = (isFormSchemaValid(initialSchema) && isFormSchemaValid(props.schema)) ? Object.assign(initialSchema, props.schema) : {} 

				this.form = new ReactiveMobxForm(mergedSchema);
				this.form.component = wrappedForm; // for debugging/error handling purposes
			}

			getChildContext() {
				return { _ReactiveMobxForm: this.form };
			}

			componentWillMount() {
				this.props.formStore.registerForm(formName, this.form);
			}

			componentWillUnmount() {
				this.props.formStore.unRegisterForm(formName);
			}

			submitForm(event: Event) {
				event.preventDefault();

				this.form.submitting = true;
				console.log('handling submit from form and calling parent');
				Promise.all([this.props.onSubmit(this.form.values)])
					.catch(error => {
						this.form.submissionError = error;
					})
					.then(result => {
						this.form.submitting = false;
					})
			}

			resetForm() {
				this.form.reset();
			}

			render() {
				return createElement(wrappedForm, {
					submit: this.submitForm.bind(this),
					reset: this.resetForm.bind(this),
					submitting: this.form.submitting, // todo: when submit change - full form render method is executed. Thing on more performat approach. May be Submitting component
					/*validation: form.validation, */ //todo - this case render been called when any field change
					valid: this.form.isValid
				});
			}
		}

		return Form;
	}
}