import * as React from 'react';
import { Subtract } from 'utility-types';
import { formField } from '../types';
import { IControlFormContext, IControlParentNameContext } from '../context';
import { IBaseControlProps } from './BaseControl';

export interface IControlWithFieldContext<F> {
	// tslint:disable-next-line:callable-types
	field: F;
}

export function withField<P extends IControlWithFieldContext<formField>>(
	// tslint:disable-next-line: variable-name
	Component: React.ComponentType<P>, fieldCreationFunction: (string, any) => formField
) {
	// tslint:disable-next-line:max-line-length
	return class ControlWithField<PP> extends React.Component<Subtract<P, IControlWithFieldContext<formField>> & PP> {
		field: formField;

		// tslint:disable-next-line:max-line-length
		constructor(props: Subtract<P, IControlWithFieldContext<formField>> & IBaseControlProps & IControlFormContext & IControlParentNameContext & PP) {
			super(props);
			const { form, parentName, name } = props;
			const fieldName = constructName(parentName, name);

			this.field = form.registerField(fieldName, () => fieldCreationFunction(fieldName, props));
		}

		render() {
			return <Component
				field={this.field}
				{...this.props as P & PP}
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
