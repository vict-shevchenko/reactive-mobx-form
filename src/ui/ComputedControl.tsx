import * as React from 'react';
import { observer } from 'mobx-react';
import { Field } from '../Field';

import { fieldValue } from '../interfaces/Form';
import { omit, verifyRequiredProps } from '../utils';
import { withForm, IFormContext } from '../context';
import { IReactionDisposer, reaction } from 'mobx';
import { ControlWithContext as Control } from './Control';
// todo: probably may be used when implementing withRef
/*const isClassComponent = Component => Boolean(
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)*/

export interface IComputedControlProps {
	__formContext: IFormContext;
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
	compute: (values: any, props: any) => fieldValue;
}

@observer
export class ComputedControl extends React.Component<IComputedControlProps> {
	private field: Field;
	private formValueUpdateUnsubscribe: IReactionDisposer;

	public static requiredProps: string[] = ['component', 'name', 'compute'];
	public static skipProp: string[] = ['compute'];

	constructor(props) {
		super(props);

		verifyRequiredProps(ComputedControl.requiredProps, this.props, this);
	}

	public componentDidMount() {
		const componentOwnProps = omit(this.props, ['__formContext']);

		this.formValueUpdateUnsubscribe = reaction(
			() => this.props.compute(this.props.__formContext.form.values, componentOwnProps),
			newValue => { this.field.onChange(newValue); },
			{ fireImmediately: true }
		);
	}

	public componentWillUnmount() {
		this.formValueUpdateUnsubscribe();
	}

	public render() {
		const controlProps = omit(this.props, ComputedControl.skipProp);

		return (
			<Control {...controlProps} fieldRef={(field: Field) => { this.field = field; } } />
		);
	}
}

// tslint:disable-next-line:variable-name
export const ComputedControlWithContext = withForm(ComputedControl);
