import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Form } from '../core/Form';
import { omit } from '../utils';
import { IFormStore } from '../createForm';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

export interface IReactiveMobxFormValuesProps<V> {
	values?: V;
}

// tslint:disable-next-line:max-line-length
export type WithFormValuesType<V, T, P> = React.ComponentType<Subtract<P, IReactiveMobxFormValuesProps<V>> & T & IFormStore>;

// tslint:disable-next-line:max-line-length
export type mapFormValuesToPropsType<V, T> = (values: V) => T;

// tslint:disable-next-line:max-line-length variable-name
export function withFormValues<V, T, P extends IReactiveMobxFormValuesProps<V>>(formName: string, mapValues?: mapFormValuesToPropsType<V, T>): (Component: React.ComponentType<P>) => WithFormValuesType<V, T, P> {

	// tslint:disable-next-line:variable-name
	return (Component: React.ComponentType<P>) => {
		// tslint:disable-next-line:max-classes-per-file
		@inject('formStore')
		@observer
		class WithFormValues extends React.Component<(Subtract<P, IReactiveMobxFormValuesProps<V>> & T & IFormStore)> {
			private form: Form<V> | undefined;

			constructor(props: P & T & IFormStore) {
				super(props);

				this.form = props.formStore!.getForm(formName);

				if (!this.form) {
					// tslint:disable-next-line:max-line-length
					throw(new Error(`Form '${formName}' does not exist in store.
						Please check call to 'withFormValues(${formName})(${Component.name})'`));
				}
			}

			render() {
				const formValuesToPass = mapValues ? mapValues(this.form!.values) : {values: this.form!.values};

				return (
						<Component
							{...formValuesToPass}
							{...omit(this.props, ['formStore']) as P}
						/>
				);
			}
		}

		return WithFormValues;
	};
}
