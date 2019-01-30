import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from '../Form';
import { omit } from '../utils';
import { IReactiveMobxFormProps, IFormStore } from '../createForm';
import { FormStore } from '../Store';

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

				if (!this.form) {
					// tslint:disable-next-line:max-line-length
					throw (new Error(`Form '${formName}' does not exist in store. Please check call to 'withFormData(${formName})(${Component.name})'`));
				}
			}

			public destroyForm() {
				// to avoid this.props.formStore is possibly undefined
				(this.props.formStore as FormStore).unRegisterForm(formName);
			}

			public render() {
				if (this.form) {
					return (
						<Component
							valid={this.form.isValid}
							dirty={this.form.isDirty}
							submitting={this.form.submitting}
							submitError={this.form.submitError}
							step={this.form.snapshots.length}

							submit={this.form.submit}
							reset={this.form.reset}
							previous={this.form.restoreSnapshot}
							next={this.form.takeSnapshot}
							destroy={this.destroyForm.bind(this)}
							{...omit(this.props, ['formStore'])}
						/>
					);
				}
			}
		}

		return WithFormData;
	};
}
