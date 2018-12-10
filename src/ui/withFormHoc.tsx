import * as React from 'react';
import { FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { Errors } from 'validatorjs';
import { Form } from '../Form';
import { omit } from '../utils';
import { IReactiveMobxFormProps, IFormStore } from '../createForm';
import { IFormValues } from '../interfaces/Form';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

// tslint:disable-next-line:max-line-length
export type ISubmitReactiveMobxFormProps<S = any> = Pick<IReactiveMobxFormProps<S>,  'valid' | 'dirty' |'submit' | 'reset' | 'submitError' | 'submitting' >;
// tslint:disable-next-line:max-line-length
export type IErrorsReactiveMobxFormProps<S = any> = Pick<IReactiveMobxFormProps<S>, 'submitError'> & { errors: Errors };
export interface IValuesReactiveMobxFormProps {
	values: IFormValues;
}

// tslint:disable-next-line:max-line-length
export type WithFormSubmitType<P = {}> = React.ComponentType<Subtract<P, ISubmitReactiveMobxFormProps> & IFormStore>;
// tslint:disable-next-line:max-line-length
export type WithFormErrorsType<P = {}> = React.ComponentType<Subtract<P, IErrorsReactiveMobxFormProps> & IFormStore>;
// tslint:disable-next-line:max-line-length
export type WithFormValuesType<P = {}> = React.ComponentType<Subtract<P, IValuesReactiveMobxFormProps> & IFormStore>;

// tslint:disable-next-line:max-line-length variable-name
export function withFormSubmit(formName: string): <P extends ISubmitReactiveMobxFormProps>(Component: React.ComponentType<P>) => WithFormSubmitType<P> {

	// tslint:disable-next-line:variable-name
	return <P extends ISubmitReactiveMobxFormProps>(Component: React.ComponentType<P>) => {
		@inject('formStore')
		@observer
		// tslint:disable-next-line:max-line-length
		class WithFormSubmit extends React.Component<(Subtract<P, ISubmitReactiveMobxFormProps> & IFormStore)> {
			private form: Form | undefined;

			constructor(props: P & IFormStore) {
				super(props);

				this.form = props.formStore!.getForm(formName);
			}

			public submitForm(...params: [FormEvent | MouseEvent, Array<unknown>] ) {
				const maybeEvent = params[0];

				// stupid assumption, but enzyme fails on check maybeEvent.nativeEvent instanceof Event
				if (maybeEvent.preventDefault) {
					maybeEvent.preventDefault();
					params.shift();
				}

				return this.form!.submit(...params);
			}

			public resetForm() {
				this.form!.reset();
			}

			public render() {
				return (
						<Component
							dirty={this.form!.isDirty}
							valid={this.form!.isValid}
							submit={this.submitForm.bind(this)}
							reset={this.resetForm.bind(this)}
							submitting={this.form!.submitting}
							submitError={this.form!.submitError}
							{...omit(this.props, ['formStore'])}
						/>
				);
			}
		}

		return WithFormSubmit;
	};
}

// tslint:disable-next-line:max-line-length variable-name
export function withFormErrors(formName: string): <P extends IErrorsReactiveMobxFormProps>(Component: React.ComponentType<P>) => WithFormErrorsType<P> {

	// tslint:disable-next-line:variable-name
	return <P extends IErrorsReactiveMobxFormProps>(Component: React.ComponentType<P>) => {
		// tslint:disable-next-line:max-classes-per-file
		@inject('formStore')
		@observer
		// tslint:disable-next-line:max-line-length
		class WithFormErrors extends React.Component<(Subtract<P, IErrorsReactiveMobxFormProps> & IFormStore)> {
			private form: Form | undefined;

			constructor(props: P & IFormStore) {
				super(props);

				this.form = props.formStore!.getForm(formName);
			}

			public render() {
				return (
						<Component
							submitError={this.form!.submitError}
							errors={this.form!.errors}
							{...omit(this.props, ['formStore'])}
						/>
				);
			}
		}

		return WithFormErrors;
	};
}

// tslint:disable-next-line:max-line-length variable-name
export function withFormValues(formName: string): <P extends IValuesReactiveMobxFormProps>(Component: React.ComponentType<P>) => WithFormValuesType<P> {

	// tslint:disable-next-line:variable-name
	return <P extends IValuesReactiveMobxFormProps>(Component: React.ComponentType<P>) => {
		// tslint:disable-next-line:max-classes-per-file
		@inject('formStore')
		@observer
		// tslint:disable-next-line:max-line-length
		class WithFormValues extends React.Component<(Subtract<P, IValuesReactiveMobxFormProps> & IFormStore)> {
			private form: Form | undefined;

			constructor(props: P & IFormStore) {
				super(props);

				this.form = props.formStore!.getForm(formName);
			}

			public render() {
				return (
						<Component
							values={this.form!.values}
							{...omit(this.props, ['formStore'])}
						/>
				);
			}
		}

		return WithFormValues;
	};
}
