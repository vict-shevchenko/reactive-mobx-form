import * as React from 'react';
import { formField } from '../types';
import { IControlProps } from './Control';
import { IControlArrayProps } from './ControlArray';
import { IControlSectionProps } from './ControlSection';

type IControlWithFieldProps = IControlProps | IControlArrayProps | IControlSectionProps;

/* export type IReactComponent<P = any> =
    | React.StatelessComponent<P>
    | React.ComponentClass<P>
    | React.ClassicComponentClass<P>; */

// tslint:disable-next-line
export function withField(WrappedControl/* : IReactComponent<IControlWithFieldProps> */, fieldCreationFunction: (string, any) => formField ) {
	return class extends React.Component<IControlWithFieldProps> {
		public field: formField;

		constructor(props: IControlWithFieldProps) {
			super(props);
			const {__formContext: {form}, __parentNameContext, name } = props;
			const fieldName = constructName(__parentNameContext, name);

			this.field = form.registerField(fieldName, () => fieldCreationFunction(fieldName, props));
		}

		public render() {
			return <WrappedControl field={this.field} {...this.props} />;
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
