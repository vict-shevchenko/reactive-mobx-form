import * as React from 'react';
import { Form } from '../Form';
import { IControlContext } from '../interfaces/Control';
interface IBaseControlProps extends IControlContext {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
	rules?: string;
}

export default class BaseControl<P extends IBaseControlProps, S> extends React.Component<P, S> {
	public name: string;
	public form: Form;

	public static constructName(parentName: string, name: string | number): string {
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

	private static verifyRequiredProps(required, props) {
		required.forEach(requiredPropName => {
			if (props[requiredPropName] === undefined) {
				// todo: revisit this error message
				throw new Error(`You forgot to specify '${requiredPropName}' property
					for <Control name="${props._reactiveMobxForm.component.name}" /> component.`);
			}
		});
	}

	// tslint:disable-next-line: max-line-length
	public static skipProp: string[] = ['__formContext', '__parentNameContext'];

	constructor(props: P, requiredProps) {
		super(props);

		BaseControl.verifyRequiredProps(requiredProps, props);
		this.form = props.__formContext.form;
		this.name = BaseControl.constructName(props.__parentNameContext, props.name);
	}
}
