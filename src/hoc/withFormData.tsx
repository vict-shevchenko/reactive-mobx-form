import * as React from 'react';
import { FormEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from '../Form';
import { omit } from '../utils';
import { IReactiveMobxFormProps, IFormStore } from '../createForm';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

// tslint:disable-next-line:max-line-length
export type WithFormDataType<P = {}> = React.ComponentType<Subtract<P, IReactiveMobxFormProps> & IFormStore>;

// tslint:disable-next-line:max-line-length variable-name
export function withFormData(formName: string): <P extends IReactiveMobxFormProps>(Component: React.ComponentType<P>) => WithFormDataType<P> {

	// tslint:disable-next-line:variable-name
	return <P extends IReactiveMobxFormProps>(Component: React.ComponentType<P>) => {
		@inject('formStore')
		@observer
		class WithFormData extends React.Component<(Subtract<P, IReactiveMobxFormProps> & IFormStore)> {
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

		return WithFormData;
	};
}
