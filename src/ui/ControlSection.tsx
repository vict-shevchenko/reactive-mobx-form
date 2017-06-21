import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import { Form } from '../Form';
import { Field } from '../Field'

import { fieldDefinition, normalizesdFieldDefinition, normalizedFormSchema } from '../interface'
import { FieldSection } from "../FieldSection";
import { omit } from "../utils";

interface ControlSectionProps {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
}

@observer
export class ControlSection extends React.Component<ControlSectionProps, any> {
	name : string;
	form : Form;
	field: FieldSection;

	// todo: should be possible to use with children
	static requiredProps: Array<string> = ['component', 'name'];
	static propNamesToOmitWhenByPass: Array<string> = ['component', 'rules'];

	static contextTypes = {
		_ReactiveMobxForm: React.PropTypes.object.isRequired,
		_ReactiveMobxFormFieldNamePrefix: React.PropTypes.string
	}

	static childContextTypes = {
		_ReactiveMobxFormFieldNamePrefix: React.PropTypes.string.isRequired,
	}

	constructor(props, context) {
		super(props, context);

		this.verifyRequiredProps();

		this.form = context._ReactiveMobxForm;
		this.name = context._ReactiveMobxFormFieldNamePrefix ? `${context._ReactiveMobxFormFieldNamePrefix}.${props.name}` : props.name.toString();
	}

	getChildContext() {
		return {
			_ReactiveMobxFormFieldNamePrefix: this.name
		};
	}


	componentWillMount() {
		// As ControlSection is an aggregation unit it should not present in section
		if (this.form.formSchema[this.name]) {
			throw (new Error(`Control Section with name ${this.name} should not be in schema`));
		}

		this.field = new FieldSection(this.name)
		this.form.registerField(this.field);
	}

	componentWillUnmount() {
		if (this.form.mounted) {
			this.form.removeField(this.name);
		}
	}

	verifyRequiredProps() {
		ControlSection.requiredProps.forEach(reqiredPropName => {
			if (this.props[reqiredPropName] === undefined) {
				throw new Error(`You forgot to specify '${reqiredPropName}' property for <Field /> component. Cehck '${this.context._ReactiveMobxForm.component.name}' component`)
			}
		});
	}

	render() {
		const propsToPass = omit(this.props, ControlSection.propNamesToOmitWhenByPass);
		return React.createElement((this.props.component as any), Object.assign({}, { fields: this.field.subFields }, propsToPass));
	}
}