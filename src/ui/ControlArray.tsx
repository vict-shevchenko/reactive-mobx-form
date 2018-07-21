import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import ProxyFieldArray from '../ProxyFieldArray';
import { FieldArray } from '../FieldArray';
import { omit, verifyRequiredProps } from '../utils';
import BaseControl from './BaseControl';
import { ParentNameContext, withParentName, withForm } from '../context';
import { IControlArrayProps } from '../interfaces/Control';

@observer
class ControlArray extends React.Component<IControlArrayProps> {
	public field: FieldArray;

	private proxiedFieldsProp: ProxyFieldArray;
	private fieldsProp = observable<string>([]);

	private static requiredProps: string[] = ['component', 'name'];
	public static skipProp: string[] = ['component', 'rules'];

	constructor(props) {
		super(props);

		verifyRequiredProps([...ControlArray.requiredProps], this.props, this);

		this.field = new FieldArray(this.state.name);
		this.form.registerField(this.field);
		this.proxiedFieldsProp = new ProxyFieldArray(this.fieldsProp, this.field.subFields);
	}

	public componentWillUnmount(): void {
		if (!this.field.autoRemove || this.props.__formContext.destroyControlStateOnUnmount) {
			this.field.setAutoRemove();
			this.form.unregisterField(this.state.name);
		}
	}

	public componentDidUpdate() {
		if (this.field.name !== this.state.name) {
			this.field.update(this.state.name);
		}
	}

	public render() {
		const propsToPass = omit(this.props, [...BaseControl.skipProp, ...ControlArray.skipProp]);

		const length = this.fieldsProp.length; // todo: why we need this to rerender?

		return (
			<ParentNameContext.Provider value={this.state.name}>
				{
					React.createElement((this.props.component as any),
						Object.assign({}, { fields: this.proxiedFieldsProp }, propsToPass)
					)
				}
			</ParentNameContext.Provider>
		);
	}
}

// tslint:disable-next-line: variable-name
export const ControlArrayWithContext = withParentName(withForm(ControlArray));
