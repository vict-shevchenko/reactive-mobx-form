import * as React from 'react';
import { formField } from '../types';
import { IControlFormContext, IControlParentNameContext } from '../context';
import { IBaseControlProps } from './BaseControl';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

// export type IControlWithFieldContext<T> = (field: T) => T;

export interface IControlWithFieldContext<F> {
	// tslint:disable-next-line:callable-types
	field: F;
}

// tslint:disable-next-line:max-line-length
// export interface IControlPropsAndContext extends IBaseControlProps, IControlWithFieldContext<formField>, IControlFormContext, IControlParentNameContext {}

/* export type IReactComponent<P = any> =
    | React.StatelessComponent<P>
    | React.ComponentClass<P>
    | React.ClassicComponentClass<P>; */

// tslint:disable-next-line
export function withField<P extends IControlWithFieldContext<formField>>(WrappedComponent: React.ComponentType<P>, fieldCreationFunction: (string, any) => formField) {
	// tslint:disable-next-line:max-line-length
	return class ControlWithField<PP> extends React.Component<Subtract<P, IControlWithFieldContext<formField>> & PP> {
		public field: formField;

		// tslint:disable-next-line:max-line-length
		constructor(props: Subtract<P, IControlWithFieldContext<formField>> & IBaseControlProps & IControlFormContext & IControlParentNameContext & PP) {
			super(props);
			const { __formContext: { form }, __parentNameContext, name } = props;
			const fieldName = constructName(__parentNameContext, name);

			this.field = form.registerField(fieldName, () => fieldCreationFunction(fieldName, props));
		}

		public render() {
			return <WrappedComponent
				field={this.field}
				{...this.props}
			/>;
		}
	};
}

export function constructName(parentName: string, name: string | number): string {
	if (typeof name === 'number') {
		if (!parentName) {
			throw new Error('Field with numeric name can not be a root field.');
		}

		return `${parentName}[${name}]`;
	}
	else {
		return parentName ? `${parentName}.${name}` : name;
	}
}
