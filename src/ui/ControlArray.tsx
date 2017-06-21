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
		_ReactiveMobxFormFieldNamePrefix: React.PropTypes.string
	}

	static childContextTypes = {
		_ReactiveMobxFormFieldNamePrefix: React.PropTypes.string.isRequired,
	}

	static defaultProps = {
		rules: 'array'
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
		// [initilaValue, rules]
		const fieldDefinition: normalizesdFieldDefinition = this.form.formSchema[this.name] ? 
				Field.normalizeFieldDefinition(this.form.formSchema[this.name]) : // normalize field definition from initial form schema
				[ '', this.props.rules]; // construct normalised field definition

		this.field = new FieldArray(this.name, fieldDefinition);
		this.form.registerField(this.field);
	}

	componentWillUnmount() {
		if (this.form.mounted) {
			this.form.removeField(this.name);
		}
	}

	verifyRequiredProps() {
		ControlArray.requiredProps.forEach(reqiredPropName => {
			if (!this.props[reqiredPropName]) {
				throw new Error(`You forgot to specify '${reqiredPropName}' property for <Field /> component. Cehck '${this.context._ReactiveMobxForm.component.name}' component`)
			}
		});
	}

	render() {
		const propsToPass = omit(this.props, ControlArray.propNamesToOmitWhenByPass);
		return React.createElement((this.props.component as any), 
				Object.assign(
						{}, 
						{
							fields: this.field.subFields.keys(),
							push  : this.field.push.bind(this.field) 
						},
						propsToPass
					)
			);
	}
}