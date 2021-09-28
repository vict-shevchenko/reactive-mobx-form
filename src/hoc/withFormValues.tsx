import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from '../Form';
import { omit } from '../utils';
import { IFormStore } from '../createForm';
import { IFormValues } from '../interfaces/Form';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

export interface IReactiveMobxFormValuesProps {
	values: IFormValues;
}

// tslint:disable-next-line:max-line-length
export type WithFormValuesType<P = {}> = React.ComponentType<Subtract<P, IReactiveMobxFormValuesProps> & IFormStore>;

// tslint:disable-next-line:max-line-length variable-name
export function withFormValues<P extends IReactiveMobxFormValuesProps>(formName: string): (Component: React.ComponentType<P>) => WithFormValuesType<P> {

	// tslint:disable-next-line:variable-name
	return (Component: React.ComponentType<P>) => {
		// tslint:disable-next-line:max-classes-per-file
		@inject('formStore')
		@observer
		class WithFormValues extends React.Component<(Subtract<P, IReactiveMobxFormValuesProps> & IFormStore)> {
			private form: Form | undefined;

			constructor(props: P & IFormStore) {
				super(props);

				this.form = props.formStore!.getForm(formName);

				if (!this.form) {
					// tslint:disable-next-line:max-line-length
					throw(new Error(`Form '${formName}' does not exist in store. Please check call to 'withFormValues(${formName})(${Component.name})'`));
				}
			}

			public render() {
				return (
						<Component
							values={this.form!.values}
							{...omit(this.props, ['formStore']) as any}
						/>
				);
			}
		}

		return WithFormValues;
	};
}
