import React, { Component, createElement } from 'react';
import * as PropTypes from 'prop-types';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as Validator from 'validatorjs';

import { Form } from './Form';
import { IFormDefinition, IFormSchema, IValidatorjsConfiguration, IFormValues } from './interfaces/Form';
import { FormStore } from './Store';

function isConfigParamValid(param) {
	return param && typeof param === 'object' && !Array.isArray(param);
}

function validateConfigParams(formName: string, params: any) {
	if (!Object.keys(params).every(paramName => isConfigParamValid(params[paramName]))) {
		throw new Error('Error validating form initialization parameters');
	}

	if (!formName || typeof formName !== 'string') {
		throw new Error('Form name shoud be non empty string');
	}
}

export function createForm(formName: string, formDefinition: IFormDefinition = {}) {
	const {
		validator: validatorDefinition = {},
		schema: schemaDefinition = {},
		destroyFormStateOnUnmount = true,
		destroyControlStateOnUnmount = true
	} = formDefinition;
	const { errorMessages, attributeNames } = validatorDefinition;

	validateConfigParams(formName, [validatorDefinition, schemaDefinition]);

	return wrappedForm => {
		@inject('formStore')
		@observer
		class FormUI extends Component<{
			formStore: FormStore,
			onSubmit?: (values: IFormValues) => Promise<any>,
			schema?: IFormSchema
		}, any> {
			public static childContextTypes = {
				_ReactiveMobxForm: PropTypes.object.isRequired,
				_destroyControlStateOnUnmount: PropTypes.bool.isRequired
			};

			public form: Form;

			constructor(props, context) {
				super(props, context);

				if (props.schema && !isConfigParamValid(props.schema)) {
					throw new Error('attribute "schema" provided to Form has incorrect format. Object expected');
				}

				const schema = Object.assign(schemaDefinition, this.props.schema || {});

				this.form = this.props.formStore.registerForm(formName, schema, errorMessages, attributeNames);
			}

			private getChildContext() {
				return {
					_ReactiveMobxForm: this.form,
					_destroyControlStateOnUnmount: destroyControlStateOnUnmount
				};
			}

			public componentWillMount() {
				// for debugging/error handling purposes, todo: not useful for multi-component-form
				this.form.component = wrappedForm;
			}

			public componentWillUnmount() {
				if (destroyFormStateOnUnmount) {
					this.destroyForm();
				}
			}

			public destroyForm() {
				this.props.formStore.unRegisterForm(formName);
			}

			public submitForm(event = new Event('submit'), ...rest: any[]): void {

				try {
					event.preventDefault();
				}
				catch (e) {
					// tslint:disable-next-line
					console.warn(`
						'submit' function was called with incorrect 1st parameter.
						React SyntheticEvent was expected but got ${JSON.stringify(event)}.
						Please verify you are calling 'submit' from <form onSubmit> method,
						or bypassing Event parameter via your custom onSubmit handler.
					`);
				}

				this.form.submitting = true;

				Promise.all([this.props.onSubmit(this.form.values, ...rest)])
					.catch(error => {
						this.form.submitError = error;
					})
					.then(result => {
						this.resetForm();
					})
					.then(() => {
						this.form.submitting = false;
					});
			}

			public resetForm(): void {
				this.form.reset();
			}

			public render() {
				return createElement(wrappedForm, {
					submit: this.submitForm.bind(this),
					reset: this.resetForm.bind(this),
					destroy: this.destroyForm.bind(this),
					// todo: when submit change - full form render method is executed.
					// Thing on more performat approach. May be Submitting component
					submitting: this.form.submitting,
					submitError: this.form.submitError,
					// todo - this case render been called when any field change
					/* validation: form.validation, */
					valid: this.form.isValid,
					dirty: this.form.isDirty
					// todo - this case render been called when any field change
					/* errors: this.form.errors */
				});
			}
		}

		return FormUI;
	};
}

export function configureValidatorjs(configParameters: IValidatorjsConfiguration) {
	if (configParameters.language) {
		Validator.useLang(configParameters.language);
	}
	if (configParameters.setAttributeFormatter) {
		Validator.setAttributeFormatter(configParameters.setAttributeFormatter);
	}
}
