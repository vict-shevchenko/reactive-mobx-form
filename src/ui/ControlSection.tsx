import * as React from 'react';
import { observer } from 'mobx-react';
import { FieldSection } from '../FieldSection';
import { omit, verifyRequiredProps } from '../utils';
import BaseControl from './BaseControl';
import { IControlSectionProps } from '../interfaces/Control';
import { ParentNameContext, withParentName, withForm} from '../context';
import { constructName } from './WithFieldHoc';

@observer
class ControlSection extends React.Component<IControlSectionProps> {
	public field: FieldSection;

	// todo: should be possible to use with children
	private static requiredProps: string[] = ['component', 'name'];
	public static skipProp: string[] = ['component', 'rules'];

	constructor(props) {
		super(props);

		verifyRequiredProps([...ControlSection.requiredProps], this.props, this);
	}

	public componentWillUnmount(): void {
		const {__formContext: { destroyControlStateOnUnmount, form }, field} = this.props;
		if (!field.autoRemove || destroyControlStateOnUnmount) {
			field.setAutoRemove();
			form.unregisterField(field.name);
		}
	}

	public componentDidUpdate(prevProps: IControlSectionProps) {
		if (
			this.props.__parentNameContext !== prevProps.__parentNameContext ||
			this.props.name !== prevProps.name
		) {
				const newName = constructName(this.props.__parentNameContext, this.props.name);
				this.props.field.update(newName);
		}
	}

	public render() {
		const propsToPass = omit(this.props, [...BaseControl.skipProp, ...ControlSection.skipProp]);
		return (
			<ParentNameContext.Provider value={this.props.field.name}>
				{
					React.createElement((this.props.component as any),
						Object.assign({}, { fields: this.field.subFields }, propsToPass)
					)
				}
			</ParentNameContext.Provider>
		);
	}
}

// tslint:disable-next-line: variable-name
export const ControlSectionWithContext = withParentName(withForm(ControlSection));
