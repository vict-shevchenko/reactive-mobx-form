import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import ProxyFieldArray from '../ProxyFieldArray';
import { FieldArray } from '../FieldArray';
import { omit, verifyRequiredProps } from '../utils';
import {BaseControl, IBaseControlProps} from './BaseControl';
// tslint:disable-next-line:max-line-length
import { ParentNameContext, withParentName, withForm, IControlFormContext, IControlParentNameContext } from '../context';
import { constructName, withField, IControlWithFieldContext } from './WithFieldHoc';

// tslint:disable-next-line:max-line-length
export interface IControlArrayProps extends IBaseControlProps, IControlFormContext, IControlParentNameContext, IControlWithFieldContext<FieldArray> {}

@observer
export class ControlArray extends React.Component<IControlArrayProps> {
	private proxiedFieldsProp: ProxyFieldArray;
	private fieldsProp = observable<string>([]);

	private static requiredProps: string[] = ['component', 'name'];
	public static skipProp: string[] = ['component', 'rules'];

	constructor(props: IControlArrayProps) {
		super(props);

		verifyRequiredProps([...ControlArray.requiredProps], this.props, this);
		this.proxiedFieldsProp = new ProxyFieldArray(this.fieldsProp, this.props.field.subFields);
	}

	public componentWillUnmount(): void {
		const { form, field} = this.props;
		form.unregisterField(field);
	}

	public componentDidUpdate(prevProps: IControlArrayProps) {
		if (
			this.props.parentName !== prevProps.parentName ||
			this.props.name !== prevProps.name
		) {
				const newName = constructName(this.props.parentName, this.props.name);
				this.props.field.update(newName);
		}
	}

	public render() {
		const propsToPass = omit(this.props, [...BaseControl.skipProp, ...ControlArray.skipProp]);

		// @ts-ignore
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
function createField(name: string) {
	return new FieldArray(name);
}

// tslint:disable-next-line: variable-name
export const ControlArrayWithContext = withParentName(withForm(withField(ControlArray, createField)));
