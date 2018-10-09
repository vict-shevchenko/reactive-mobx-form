import * as React from 'react';
import { observer } from 'mobx-react';
import { Field } from '../Field';

import { fieldValue } from '../interfaces/Form';
import { omit, verifyRequiredProps } from '../utils';
import { withForm, IControlFormContext } from '../context';
import { IReactionDisposer, reaction } from 'mobx';
import { ControlWithContext as Control } from './Control';
import { IBaseControlProps } from './BaseControl';
// todo: probably may be used when implementing withRef
/*const isClassComponent = Component => Boolean(
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)*/

export interface IComputedControlProps extends IBaseControlProps, IControlFormContext {
	type: string;
	compute: (values: any, props: any) => fieldValue;
}

interface IOmitProps {
  compute: any;
}
type OmitType<O> = Array<keyof O>;
type OmitTypeSet = keyof IOmitProps;

@observer
export class ComputedControl extends React.Component<IComputedControlProps> {
	private field: Field;
	private formValueUpdateUnsubscribe: IReactionDisposer;

	public static requiredProps: string[] = ['component', 'name', 'compute'];
	public static skipProp: OmitType<IOmitProps> = ['compute'];

	constructor(props: IComputedControlProps) {
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
		// tslint:disable-next-line:max-line-length
		const controlProps = omit<IComputedControlProps, OmitTypeSet>(this.props, ComputedControl.skipProp);

		return (
			<Control {...controlProps} fieldRef={(field: Field) => { this.field = field; } } />
		);
	}
}

// tslint:disable-next-line:variable-name
export const ComputedControlWithContext = withForm(ComputedControl);
