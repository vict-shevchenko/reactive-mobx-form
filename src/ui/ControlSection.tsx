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
	field: FieldSection;
	form: Form;

	// todo: should be possible to use with children
	static requiredProps: Array<string> = ['component', 'name'];
	static propNamesToOmitWhenByPass: Array<string> = ['component', 'rules'];

	static contextTypes = {
		_ReactiveMobxForm: React.PropTypes.object.isRequired
	}

	constructor(props, context) {
		super(props, context);

		this.verifyRequiredProps();

		this.form = context._ReactiveMobxForm;
	}

	componentWillMount() {
		// verify Control name duplications
		if (this.form.fields.get(this.props.name)) {
			throw(new Error(`Field with name ${this.props.name} already exist in Form`));
		}

		// 
		if (this.form.formSchema[this.props.name]) {
			throw(new Error(`Control Section with name ${this.props.name} should not be in schema`));
		}

		this.field = this.form.registerField(this.props.name, false, true) as FieldSection;
	}

	componentWillUnmount() {
		this.form.removeField(this.props.name);
	}

	verifyRequiredProps() {
		ControlSection.requiredProps.forEach(reqiredPropName => {
			if (!this.props[reqiredPropName]) {
				throw new Error(`You forgot to specify '${reqiredPropName}' property for <Field /> component. Cehck '${this.context._Form.component.name}' component`)
			}
		});
	}

	render() {
		const propsToPass = omit(this.props, ControlSection.propNamesToOmitWhenByPass);
		return React.createElement((this.props.component as any), Object.assign({}, { fields: this.field.subFields }, propsToPass));
	}
}