import React, { Component, createElement } from 'react';
import * as PropTypes from 'prop-types';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as Validator from 'validatorjs';

import { Form } from './Form';
import { IFormSchema, IFormDefinition, IValidatorjsConfiguration } from './interface';

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


export function createForm(formName: string , formDefinition: IFormDefinition = {} ) {
	const { validator: validatorDefinition = {}, schema: schemaDefinition = {} } = formDefinition;
	const { errorMessages, attributeNames } = validatorDefinition;
	
	validateConfigParams(formName, [validatorDefinition, schemaDefinition]);

	return wrappedForm => {
		@inject('formStore')
		@observer
		class FormUI extends Component<{ formStore: any, onSubmit?: any, schema?: IFormSchema }, any> {
			form: Form;

			static childContextTypes = {
				_ReactiveMobxForm: PropTypes.object.isRequired
			}

			constructor(props, context) {
				super(props, context);

				if (props.schema && !isConfigParamValid(props.schema)) {
					throw new Error('attribute "schema" provided to Form has incorrect format. Object expected');
				}

				this.form = new Form(Object.assign(schemaDefinition, props.schema || {}), errorMessages, attributeNames);
				this.form.component = wrappedForm; // for debugging/error handling purposes
			}

			getChildContext() {
				return { _ReactiveMobxForm: this.form };
			}

			componentWillMount() {
				this.props.formStore.registerForm(formName, this.form);
				this.form.registerValidation();
			}

			componentDidMount() {
				this.form.mounted = true;
			}

			componentWillUnmount() {
				this.form.mounted = false;
				this.props.formStore.unRegisterForm(formName);
			}

			// todo: pass additional information to submimt
			submitForm(event: Event) {
				event.preventDefault();

				this.form.submitting = true;

				Promise.all([this.props.onSubmit(this.form.values)])
					.catch(error => {
						this.form.submitError = error;
					})
					.then(result => {
						this.resetForm();
					})
					.then(() => {
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
					submitError: this.form.submitError,
					/* validation: form.validation, */ //todo - this case render been called when any field change
					valid: this.form.isValid,
					dirty: this.form.isDirty
					/* errors: this.form.errors */ //todo - this case render been called when any field change
				});
			}
		}

		return FormUI;
	}
}

export function configureValidatorjs(configParameters: IValidatorjsConfiguration) {
	configParameters.language && Validator.useLang(configParameters.language);
	configParameters.setAttributeFormatter && Validator.setAttributeFormatter(configParameters.setAttributeFormatter);
}
