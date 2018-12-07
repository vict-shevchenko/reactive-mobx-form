import * as React from 'react';
import { FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from '../Form';
import { omit } from '../utils';
import { IReactiveMobxFormProps, IFormStore } from '../createForm';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

// tslint:disable-next-line:max-line-length
export type ISubmitReactiveMobxFormProps<S = any> = Pick<IReactiveMobxFormProps<S>, 'submit' | 'reset' | 'submitError' | 'submitting' >;

// tslint:disable-next-line:max-line-length
export type WithFormSubmitType<P = {}> = React.ComponentType<Subtract<P, ISubmitReactiveMobxFormProps> & IFormStore>;

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
