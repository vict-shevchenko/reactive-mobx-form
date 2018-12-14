import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Errors } from 'validatorjs';
import { Form } from '../Form';
import { omit } from '../utils';
import { IReactiveMobxFormProps, IFormStore } from '../createForm';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

// tslint:disable-next-line:max-line-length
export type IReactiveMobxFormErrorsProps<S = any> = Pick<IReactiveMobxFormProps<S>, 'submitError'> & { errors: Errors };

// tslint:disable-next-line:max-line-length
export type WithFormErrorsType<P = {}> = React.ComponentType<Subtract<P, IReactiveMobxFormErrorsProps> & IFormStore>;

// tslint:disable-next-line:max-line-length variable-name
export function withFormErrors(formName: string): <P extends IReactiveMobxFormErrorsProps>(Component: React.ComponentType<P>) => WithFormErrorsType<P> {

	// tslint:disable-next-line:variable-name
	return <P extends IReactiveMobxFormErrorsProps>(Component: React.ComponentType<P>) => {
		// tslint:disable-next-line:max-classes-per-file
		@inject('formStore')
		@observer
		class WithFormErrors extends React.Component<(Subtract<P, IReactiveMobxFormErrorsProps> & IFormStore)> {
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
