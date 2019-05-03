import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from '../Form';
import { omit } from '../utils';
import { IFormStore } from '../createForm';
import { IFormValues } from '../interfaces/Form';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

export interface IReactiveMobxFormValuesProps {
	values?: IFormValues;
}

// tslint:disable-next-line:max-line-length
export type WithFormValuesType<P = {}, T = {}> = React.ComponentType<Subtract<P, IReactiveMobxFormValuesProps> & T & IFormStore>;

// tslint:disable-next-line:max-line-length
export type mapFormValuesToPropsType<T> = (values: IFormValues) => T;

// tslint:disable-next-line:max-line-length variable-name
export function withFormValues<T, P extends IReactiveMobxFormValuesProps>(formName: string, mapValues?: mapFormValuesToPropsType<T>): (Component: React.ComponentType<P & T>) => WithFormValuesType<P, T> {

	// tslint:disable-next-line:variable-name
	return (Component: React.ComponentType<P & T>) => {
		// tslint:disable-next-line:max-classes-per-file
		@inject('formStore')
		@observer
		class WithFormValues extends React.Component<(Subtract<P, IReactiveMobxFormValuesProps> & T & IFormStore)> {
			private form: Form | undefined;

			constructor(props: P & T & IFormStore) {
				super(props);

				this.form = props.formStore!.getForm(formName);

				if (!this.form) {
					// tslint:disable-next-line:max-line-length
					throw(new Error(`Form '${formName}' does not exist in store.
						Please check call to 'withFormValues(${formName})(${Component.name})'`));
				}
			}

			public render() {
				const formValuesToPass = mapValues ? mapValues(this.form!.values) : {values: this.form!.values};

				return (
						<Component
							{...formValuesToPass}
							{...omit(this.props, ['formStore'])}
						/>
				);
			}
		}

		return WithFormValues;
	};
}
