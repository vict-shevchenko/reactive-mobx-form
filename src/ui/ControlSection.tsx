import * as React from 'react';
import { observer } from 'mobx-react';
import { Form } from '../Form';
import { FieldSection } from '../FieldSection';
import { omit } from '../utils';
import BaseControl from './BaseControl';
import { IControlSectionProps } from '../interfaces/Control';
import { ParentNameContext, withParentName, withForm} from '../context';

@observer
class ControlSection extends BaseControl<IControlSectionProps> {
	public field: FieldSection;

	// todo: should be possible to use with children
	private static requiredProps: string[] = ['component', 'name'];
	public static skipProp: string[] = ['component', 'rules'];

	constructor(props) {
		super(props, ControlSection.requiredProps);

		// As ControlSection is an aggregation unit it should not present in schema
		if (this.form.formSchema[this.state.name]) {
			throw (new Error(`Control Section with name ${this.state.name} should not be in schema`));
		}

		this.field = new FieldSection(this.state.name);
		this.form.registerField(this.field);
	}

	public componentWillUnmount(): void {
		if (!this.field.autoRemove || this.props.__formContext.destroyControlStateOnUnmount) {
			this.field.setAutoRemove();
			this.form.unregisterField(this.state.name);
		}
	}

	public componentWillReceiveProps(nextProps: IControlSectionProps): void {
		const nextName = BaseControl.constructName(nextProps.__parentNameContext, nextProps.name);

		if (this.state.name !== nextName) {
			this.field.update(nextName);
			this.setState({ name: nextName });
		}
	}

	public render() {
		const propsToPass = omit(this.props, [...BaseControl.skipProp, ...ControlSection.skipProp]);
		return (
			<ParentNameContext.Provider value={this.state.name}>
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
