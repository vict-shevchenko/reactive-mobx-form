import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as Validator from 'validatorjs';

import { Form } from './Form';
import { IFormDefinition, IFormSchema, IValidatorjsConfiguration, IFormValues } from './interfaces/Form';
import { FormStore } from './Store';
import { FormContext } from './context';

function isConfigParamValid(param) {
	return param && typeof param === 'object' && !Array.isArray(param);
}

function validateConfigParams(formName: string, params: any) {
	if (!Object.keys(params).every(paramName => isConfigParamValid(params[paramName]))) {
		throw new Error('Error validating form initialization parameters');
	}

	if (!formName || typeof formName !== 'string') {
		throw new Error('Form name should be non empty string');
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
		class FormUI extends React.Component<{
			formStore: FormStore,
			onSubmit?: (values: IFormValues, ...rest: any[]) => Promise<any>,
			schema?: IFormSchema
		}, any> {

			public form: Form;

			constructor(props) {
				super(props);

				if (props.schema && !isConfigParamValid(props.schema)) {
					throw new Error('attribute "schema" provided to Form has incorrect format. Object expected');
				}

				const schema = Object.assign(schemaDefinition, this.props.schema || {});

				this.form = this.props.formStore.registerForm(formName, schema, errorMessages, attributeNames);

				this.state = {
					formContext: {
						form: this.form,
						destroyControlStateOnUnmount
					}
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

			public submitForm(event: Event, ...rest: any[]): Promise<any> {

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

				this.form.setTouched();

				if (!this.form.isValid) {
					this.form.submitError = this.form.errors.all();
					return Promise.reject(this.form.submitError);
				}

				this.form.submitting = true;

				return Promise.all([this.props.onSubmit(this.form.values, ...rest)])
					.then(result => {
							this.form.submitting = false;
							return result[0];
						}, error => {
							this.form.submitting = false;
							this.form.submitError = error;
							return Promise.reject(this.form.submitError);
						});
						// todo: move into finally when it is part of standard
			}

			public resetForm(): void {
				this.form.reset();
			}

			public render() {
				return (
					<FormContext.Provider value={this.state.formContext}>
						{
							React.createElement(wrappedForm, {
								submit: this.submitForm.bind(this),
								reset: this.resetForm.bind(this),
								destroy: this.destroyForm.bind(this),
								// todo: when submit change - full form render method is executed.
								// Thing on more performant approach. May be Submitting component
								submitting: this.form.submitting,
								submitError: this.form.submitError,
								// todo - this case render been called when any field change
								/* validation: form.validation, */
								valid: this.form.isValid,
								dirty: this.form.isDirty
								// todo - this case render been called when any field change
								/* errors: this.form.errors */
							})
						}
					</FormContext.Provider>
				);
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
