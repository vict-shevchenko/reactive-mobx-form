import * as React from 'react';
import { observer } from 'mobx-react';
import { FieldSection } from '../FieldSection';
import { omit, verifyRequiredProps } from '../utils';
import {BaseControl, IBaseControlProps} from './BaseControl';
import { ParentNameContext, withParentName, withForm, IControlFormContext, IControlParentNameContext} from '../context';
import { constructName, withField, IControlWithFieldContext } from './WithFieldHoc';

// tslint:disable-next-line:max-line-length
export interface IControlSectionProps extends IBaseControlProps, IControlFormContext, IControlParentNameContext, IControlWithFieldContext<FieldSection> {}

@observer
export class ControlSection extends React.Component<IControlSectionProps> {
	// todo: should be possible to use with children
	private static requiredProps: string[] = ['component', 'name'];
	public static skipProp: string[] = ['component', 'rules'];

	constructor(props: IControlSectionProps) {
		super(props);

		verifyRequiredProps([...ControlSection.requiredProps], this.props, this);
	}

	public componentWillUnmount(): void {
		const { form, field } = this.props;
		if (!field.detached) {
			field.setDetached();
			form.unregisterField(field.name);
		}
	}

	public componentDidUpdate(prevProps: IControlSectionProps) {
		if (
			this.props.parentName !== prevProps.parentName ||
			this.props.name !== prevProps.name
		) {
				const newName = constructName(this.props.parentName, this.props.name);
				this.props.field.update(newName);
		}
	}

	public render() {
		const propsToPass = omit(this.props, [...BaseControl.skipProp, ...ControlSection.skipProp]);
		return (
			<ParentNameContext.Provider value={this.props.field.name}>
				{
					React.createElement((this.props.component as any),
						Object.assign({}, { fields: this.props.field.subFields }, propsToPass)
					)
				}
			</ParentNameContext.Provider>
		);
	}
}

// tslint:disable-next-line:variable-name
function createField(name: string) {
	return new FieldSection(name);
}

// tslint:disable-next-line
export const ControlSectionWithContext = withParentName(withForm(withField(ControlSection, createField)));
