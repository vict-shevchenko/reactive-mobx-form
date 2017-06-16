import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import { Form } from '../Form';
import { Field } from '../Field'

import { fieldDefinition, normalizesdFieldDefinition, normalizedFormSchema } from '../interface'
import { FieldArray } from "../FieldArray";
import { omit } from "../utils";

interface ControlArrayProps {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
	rules?: string;
}

@observer
export class ControlArray extends React.Component<ControlArrayProps, any> {
	name: string;
	field: FieldArray;
	form: Form;

	static requiredProps: Array<string> = ['component', 'name'];
	static propNamesToOmitWhenByPass: Array<string> = ['component', 'rules'];

	static contextTypes = {
		_ReactiveMobxForm: React.PropTypes.object.isRequired,
		_ReactiveMobxFormFieldSection: React.PropTypes.string
	}

	static defaultProps = {
		rules: 'array'
	}

	constructor(props, context) {
		super(props, context);

		this.verifyRequiredProps();

		this.form = context._ReactiveMobxForm;
		this.name = context._ReactiveMobxFormFieldSection ? `${context._ReactiveMobxFormFieldSection}.${props.name}` : props.name;
	}

	componentWillMount() {
		// verify Control name duplications, this code is duplicated in all controls
		if (this.form.fields.get(this.name)) {
			throw(new Error(`Field with name ${this.name} already exist in Form`));
		}

		// todo: we need to handle exceptions with 2 fields with same name
		if (this.form.formSchema[this.name]) {
			throw(new Error(`Control Array with name ${this.name} should not be in schema`));
		}

		const fieldDefinition: normalizesdFieldDefinition = ['', this.props.rules];
		const schemaExtension: normalizedFormSchema = { [this.name]: fieldDefinition }

		this.form.extendSchema(schemaExtension);

		this.field = new FieldArray(this.name)
		this.form.registerField(this.field);
	}

	componentWillUnmount() {
		this.form.removeField(this.name);
	}

	verifyRequiredProps() {
		ControlArray.requiredProps.forEach(reqiredPropName => {
			if (!this.props[reqiredPropName]) {
				throw new Error(`You forgot to specify '${reqiredPropName}' property for <Field /> component. Cehck '${this.context._Form.component.name}' component`)
			}
		});
	}

	render() {
		const propsToPass = omit(this.props, ControlArray.propNamesToOmitWhenByPass);
		return React.createElement((this.props.component as any), 
				Object.assign(
						{}, 
						{ fields: this.field.subFields.keys().map(key => `${this.field.name}[${key}]`),
						push: this.field.push.bind(this.field) },
						propsToPass
					)
			);
	}
}