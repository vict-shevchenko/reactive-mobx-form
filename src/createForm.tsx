import * as React from 'react';
import { FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import * as Validator from 'validatorjs';

import { Form } from './Form';
import {
	IFormDefinition,
	IFormSchema,
	IValidatorjsConfiguration,
	IFormValues,
	INormalizedFieldDefinition,
	IFormNormalizedSchema,
	IFieldDefinition,
	fieldValue
} from './interfaces/Form';
import { FormStore } from './Store';
import { FormContext, IFormContext } from './context';
import { omit } from './utils';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

export function isConfigParamValid(param) {
	return param && typeof param === 'object' && !Array.isArray(param);
}

export function validateConfigParams(formName: string, params: any) {
	if (!Object.keys(params).every(paramName => isConfigParamValid(params[paramName]))) {
		throw new Error('Error validating form initialization parameters');
	}

	if (!formName || typeof formName !== 'string') {
		throw new Error('Form name should be non empty string');
	}
}

export function normalizeSchema(draftSchema: IFormSchema): IFormNormalizedSchema {
	return Object.keys(draftSchema).reduce((schema: IFormNormalizedSchema, fieldName: string): IFormNormalizedSchema => {
		const fieldDefinition: IFieldDefinition = draftSchema[fieldName];
		let normalizedFieldDefinition: INormalizedFieldDefinition;

		if (Array.isArray(fieldDefinition)) {
			// tslint:disable-next-line:max-line-length
			normalizedFieldDefinition = (fieldDefinition.length === 2) ? (fieldDefinition as [fieldValue, string]) : [fieldDefinition[0], ''];
		} else {
			normalizedFieldDefinition = [fieldDefinition as fieldValue, ''];
		}

		schema[fieldName] = normalizedFieldDefinition;

		return schema;
	}, {});
}

interface IFormStore {
	formStore?: FormStore;
}

export interface IFormProps {
	onSubmit: <T>(values: IFormValues, ...rest: any[]) => T;
	schema?: IFormSchema;
}

export interface IFormState {
	formContext: IFormContext;
}

export interface IInjectedFormProps {
	submit: (event: FormEvent<HTMLFormElement>, ...rest: any[]) => Promise<any>;
	reset: () => void;
	destroy: () => void;
	submitting: boolean;
	submitError: Error;
	valid: boolean | void;
	dirty: boolean;
}

export type ReactiveMobxForm<P = {}> = React.ComponentType<Subtract<P, IInjectedFormProps> & IFormProps & IFormStore>;

// tslint:disable-next-line
export function createForm(formName: string, formDefinition: IFormDefinition = {}): <P extends IInjectedFormProps>(FormComponent: React.ComponentType<P>) => ReactiveMobxForm<P> {
	const {
		validator: validatorDefinition = {},
		schema: schemaDefinition = {},
		destroyFormStateOnUnmount = true,
		destroyControlStateOnUnmount = true
	} = formDefinition;
	const { errorMessages, attributeNames } = validatorDefinition;

	validateConfigParams(formName, [validatorDefinition, schemaDefinition]);

	// tslint:disable-next-line:variable-name
	return <P extends IInjectedFormProps>(FormComponent: React.ComponentType<P>) => {
		@inject('formStore')
		@observer
		// tslint:disable-next-line:max-line-length
		class FormUI extends React.Component<(Subtract<P, IInjectedFormProps> & IFormProps & IFormStore), IFormState> {

			public form: Form;

			constructor(props: P & IFormProps & IFormStore) {
				super(props);

				if (props.schema && !isConfigParamValid(props.schema)) {
					throw new Error('Attribute "schema" provided to Form has incorrect format. Object expected');
				}

				if (!props.onSubmit) {
					throw new Error(`Attribute "onSubmit" is Required for <${FormComponent.name} /> component`);
				}

				const schema = Object.assign(schemaDefinition, props.schema || {});
				const normalizedSchema = normalizeSchema(schema);

				this.form = props.formStore!.registerForm(formName, normalizedSchema, errorMessages, attributeNames);

				this.state = {
					formContext: {
						form: this.form,
						destroyControlStateOnUnmount
					}
				};

				// old stuff, probably remove, not useful in multi component form
				// this.form.component = wrappedForm;
			}

			public componentWillUnmount() {
				if (destroyFormStateOnUnmount) {
					this.destroyForm();
				}
			}

			public destroyForm() {
				// to avoid this.props.formStore is possibly undefined
				(this.props.formStore as FormStore).unRegisterForm(formName);
			}

			public submitForm(event: Event, ...rest: any[]): Promise<any> {
				this.form.submitError = undefined;

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
						<FormComponent
							submit={this.submitForm.bind(this)}
							reset={this.resetForm.bind(this)}
							destroy={this.destroyForm.bind(this)}
							submitting={this.form.submitting}
							submitError={this.form.submitError}
							valid={this.form.isValid}
							dirty={this.form.isDirty}
							{...omit(this.props, ['schema', 'onSubmit', 'formStore'])}
						/>
					</FormContext.Provider>
				);
			}
		}

		return FormUI;
	};
}

export function configureValidatorjs(configParameters: IValidatorjsConfiguration): void {
	if (configParameters.language) {
		Validator.useLang(configParameters.language);
	}
	if (configParameters.setAttributeFormatter) {
		Validator.setAttributeFormatter(configParameters.setAttributeFormatter);
	}
}
