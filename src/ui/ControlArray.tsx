import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import ProxyFieldArray from '../ProxyFieldArray';
import { FieldArray } from '../FieldArray';
import { omit, verifyRequiredProps } from '../utils';
import BaseControl from './BaseControl';
import { ParentNameContext, withParentName, withForm } from '../context';
import { IControlArrayProps } from '../interfaces/Control';
import { constructName, withField } from './WithFieldHoc';

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
		this.proxiedFieldsProp = new ProxyFieldArray(this.fieldsProp, this.field.subFields);
	}

	public componentWillUnmount(): void {
		const {__formContext: { destroyControlStateOnUnmount, form }, field} = this.props;
		if (!field.autoRemove || destroyControlStateOnUnmount) {
			field.setAutoRemove();
			form.unregisterField(field.name);
		}
	}

	public componentDidUpdate(prevProps: IControlArrayProps) {
		if (
			this.props.__parentNameContext !== prevProps.__parentNameContext ||
			this.props.name !== prevProps.name
		) {
				const newName = constructName(this.props.__parentNameContext, this.props.name);
				this.props.field.update(newName);
		}
	}

	public render() {
		const propsToPass = omit(this.props, [...BaseControl.skipProp, ...ControlArray.skipProp]);

		const length = this.fieldsProp.length; // todo: why we need this to rerender?

		return (
			<ParentNameContext.Provider value={this.props.field.name}>
				{
					React.createElement((this.props.component as any),
						Object.assign({}, { fields: this.proxiedFieldsProp }, propsToPass)
					)
				}
			</ParentNameContext.Provider>
		);
	}
}

// tslint:disable-next-line:variable-name
const ControlArrayWithField = withField(ControlArray, (name: string) => {
	return new FieldArray(name);
});

// tslint:disable-next-line: variable-name
export const ControlArrayWithContext = withParentName(withForm(ControlArrayWithField));
