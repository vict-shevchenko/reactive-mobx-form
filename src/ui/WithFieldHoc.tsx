import * as React from 'react';
import { IControlProps, IControlArrayProps, IControlSectionProps } from '../interfaces/Control';
import { formField } from '../types';

// tslint:disable-next-line:variable-name
export function withField(WrappedControl, fieldCreationFunction: (string, any) => formField ) {
	return class extends React.Component<IControlProps | IControlArrayProps | IControlSectionProps> {
		private field: formField;

		constructor(props: IControlProps | IControlArrayProps | IControlSectionProps) {
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
