import * as React from 'react';
import { observer } from 'mobx-react';
import { Form } from '../Form';
import { FieldSection } from '../FieldSection';
import { omit } from '../utils';
import BaseControl from './BaseControl';
import { IControlSectionProps } from '../interfaces/Control';
import { ParentNameContext, withParentName, withForm} from '../context';

@observer
class ControlSection extends BaseControl<IControlSectionProps, any> {
	public name: string;
	public form: Form;
	public field: FieldSection;

	/* public static contextTypes = {
		_ReactiveMobxForm: PropTypes.object.isRequired,
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string
	};

	public static childContextTypes = {
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string.isRequired
	}; */

	// todo: should be possible to use with children
	private static requiredProps: string[] = ['component', 'name'];
	public static skipProp: string[] = ['component', 'rules'];

	constructor(props) {
		super(props, ControlSection.requiredProps);

		this.state = {
			name: this.name
		};
	}

	/* 	public getChildContext(): IGroupControlContext  {
			return {
				_ReactiveMobxFormFieldNamePrefix: this.name
			};
		} */

	public componentWillMount(): void {
		// As ControlSection is an aggregation unit it should not present in schema
		if (this.form.formSchema[this.name]) {
			throw (new Error(`Control Section with name ${this.name} should not be in schema`));
		}

		this.field = new FieldSection(this.name);
		this.form.registerField(this.field);
	}

	public componentWillUnmount(): void {
		if (!this.field.autoRemove || this.props.__formContext.destroyControlStateOnUnmount) {
			this.field.setAutoRemove();
			this.form.unregisterField(this.name);
		}
	}

	public componentWillReceiveProps(nextProps: IControlSectionProps): void {
		const name = BaseControl.constructName(nextProps.__parentNameContext, nextProps.name);

		if (this.name !== name) {
			this.name = name;
			this.field.update(name);
			this.setState({ name: this.name });
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
