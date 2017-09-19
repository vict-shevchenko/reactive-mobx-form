import * as React from 'react';
import * as PropTypes from 'prop-types';
import { observer, Observer } from 'mobx-react';
import { Form } from '../Form';
import { FieldSection } from '../FieldSection';
import { omit } from '../utils';
import BaseControl from './BaseControl';
import { IFieldDefinition, INormalizesdFieldDefinition } from '../../interfaces/Form';
import { IControlSectionProps, IGroupControlContext } from '../../interfaces/Control';

@observer
export class ControlSection extends BaseControl<IControlSectionProps, any> {
	public name: string;
	public form: Form;
	public field: FieldSection;

	public static contextTypes = {
		_ReactiveMobxForm: PropTypes.object.isRequired,
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string
	};

	public static childContextTypes = {
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string.isRequired
	};

	// todo: should be possible to use with children
	private static requiredProps: string[] = ['component', 'name'];
	private static propNamesToOmitWhenByPass: string[] = ['component', 'rules'];

	constructor(props, context) {
		super(props, context, ControlSection.requiredProps);
	}

	public getChildContext(): IGroupControlContext  {
		return {
			_ReactiveMobxFormFieldNamePrefix: this.name
		};
	}

	public componentWillMount(): void {
		// As ControlSection is an aggregation unit it should not present in schema
		if (this.form.formSchema[this.name]) {
			throw (new Error(`Control Section with name ${this.name} should not be in schema`));
		}

		this.field = new FieldSection(this.name);
		this.form.registerField(this.field);
	}

	public componentWillUnmount(): void {
		if (!this.field.autoRemove) {
			this.field.setAutoRemove();
			this.form.removeField(this.name);
		}
	}

	public componentWillReceiveProps(nextProps: IControlSectionProps, nextContext: IGroupControlContext): void {
		const name = BaseControl.constructName(nextContext._ReactiveMobxFormFieldNamePrefix, nextProps.name);

		if (this.name !== name) {
			this.name = name;
			this.field.update(name);
		}
	}

	public render() {
		const propsToPass = omit(this.props, ControlSection.propNamesToOmitWhenByPass);
		return React.createElement((this.props.component as any),
			Object.assign({}, { fields: this.field.subFields }, propsToPass)
		);
	}
}
