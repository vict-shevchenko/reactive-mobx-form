import * as React from 'react';
import { inject, observer } from 'mobx-react';
import * as Validator from 'validatorjs';

import { Form } from './Form';
import {
	IFormDefinition,
	IFormSchema,
	IValidatorjsConfiguration
} from './interfaces/Form';
import { FormStore } from './Store';
import { FormContext } from './context';
import { omit } from './utils';
import { submitCallback } from './types';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

export function isConfigParamValid(param) {
	return param && typeof param === 'object' && !Array.isArray(param);
}

export function validateConfigParams(formName: string, params: any[]) {
	const nonUndefinedParams = params.filter(p => p !== undefined);

	if (!nonUndefinedParams.every(param => isConfigParamValid(param))) {
		throw new Error('Error validating form initialization parameters');
	}

	if (!formName || typeof formName !== 'string') {
		throw new Error('Form name should be non empty string');
	}
}

export interface IFormStore {
	formStore?: FormStore;
}

export interface IFormExtendProps extends IFormStore {
	schema?: IFormSchema;
}

export interface IFormProps extends IFormExtendProps {
	onSubmit: submitCallback;
	keepState?: boolean;
}

export interface IReactiveMobxFormProps<P = any> {
	submit: (...rest: unknown[]) => Promise<P>;
	next: () => void;
	previous: (steps: unknown) => void;
	reset: () => void;
	destroy: () => void;
	touch: () => void;
	submitting: boolean;
	submitError: Error;
	valid: boolean | void;
	dirty: boolean;
	step: number;
}

// tslint:disable-next-line:max-line-length
export type ReactiveMobxForm<P = {}> = React.ComponentType<Subtract<P, IReactiveMobxFormProps> & IFormProps>;

// tslint:disable-next-line
export function createForm<P extends IReactiveMobxFormProps>(formName: string, formDefinition: IFormDefinition = {}): (FormComponent: React.ComponentType<P>) => ReactiveMobxForm<P> {
	const {
		validator,
		schema
	} = formDefinition;

	// todo, run in dev mode only
	validateConfigParams(formName, [validator, schema]);

	// tslint:disable-next-line:variable-name
	return (FormComponent: React.ComponentType<P>) => {
		@inject('formStore')
		@observer
		// tslint:disable-next-line:max-line-length
		class FormUI extends React.Component<(Subtract<P, IReactiveMobxFormProps> & IFormProps)> {

			public form: Form;

			constructor(props: P & IFormProps) {
				super(props);

				if (props.schema && !isConfigParamValid(props.schema)) {
					throw new Error('Attribute "schema" provided to Form has incorrect format. Object expected');
				}

				if (!props.onSubmit) {
					throw new Error(`Attribute "onSubmit" is Required for <${FormComponent.name} /> component`);
				}

				const fullSchema = (schema || props.schema) && Object.assign({}, schema, props.schema);

				// this will throw if form already exist
				// tslint:disable-next-line:max-line-length
				this.form = props.formStore!.registerForm(formName, props.onSubmit, { schema: fullSchema, validator });
			}

			public componentWillUnmount() {
				if (this.props.keepState) {
					(this.props.formStore as FormStore).detachForm(formName);
				} else {
					this.destroyForm();
				}
			}

			public destroyForm() {
				// to avoid this.props.formStore is possibly undefined
				(this.props.formStore as FormStore).unRegisterForm(formName);
			}

			public render() {
				return (
					<FormContext.Provider value={this.form}>
						<FormComponent
							valid={this.form.isValid}
							dirty={this.form.isDirty}
							submitting={this.form.submitting}
							submitError={this.form.submitError}
							step={this.form.currentStep}

							submit={this.form.submit}
							reset={this.form.reset}
							touch={this.form.setTouched}
							previous={this.form.restoreSnapshot}
							next={this.form.takeSnapshot}

							destroy={this.destroyForm.bind(this, false)}
							{...omit(this.props, ['schema', 'onSubmit', 'formStore']) as any}
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
