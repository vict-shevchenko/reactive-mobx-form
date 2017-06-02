import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import { Form } from '../Form';
import { Field } from '../Field'

import { fieldDefinition, normalizesdFieldDefinition, normalizedFormSchema } from '../interface'
import { omit } from "../utils";


// todo: probabbly may be used when implementing withRef
/*const isClassComponent = Component => Boolean( 
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)*/

//todo: add value property to make field a controled component

interface ControlProps {
	name: string;

	component: React.Component<any, any> | React.SFC<any> | string;
	rules: string;

	type: string;

	children?: any;


	value?: string // should be fieldValue
	/*
	placeholder?: string;
	label?: string;
	*/

	onFocus?(event: Event): void;
	onBlur?(event: Event): void;
	onChange?(event: Event): void;
}

@observer
export class Control extends React.Component<ControlProps, any> {
	isNumber: boolean;
	isSelect: boolean;
	isCheckable: boolean;
	isFile: boolean;
	isRadio: boolean;
	isCheckbox: boolean;
	form: Form;
	field: Field;

	static requiredProps: Array<string> = ['component', 'name'];
	static propNamesToOmitWhenByPass: Array<string> = ['component', 'rules'];

	static defaultProps = {
		rules: ''
	}

	static contextTypes = {
		_ReactiveMobxForm: React.PropTypes.object.isRequired
	}

	constructor(props, context) {
		super(props, context);

		this.verifyRequiredProps();

		this.form = context._ReactiveMobxForm;

		this.isCheckbox = props.type === 'checkbox';
		this.isRadio = props.type === 'radio';
		this.isFile = props.type === 'file';
		this.isSelect = props.component === 'select';
		this.isNumber = props.type === 'number';
		this.isCheckable = this.isCheckbox || this.isRadio;

		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	componentWillMount() {
		// verify Control name duplications
		if (this.form.fields[this.props.name] && !this.isRadio) {
			throw(new Error(`Field with name ${this.props.name} already exist in Form`));
		}

		if (this.form.formSchema[this.props.name]) {
			// todo: remove warning in production build
			this.warnOnIncorrectInitialValues();
		}
		else { // field was not registered in form schema or exteded as <Form schema/> parameter
			const initialValue: boolean | string = this.isCheckbox ? false : '';
			const rules: string = this.props.rules;
			const fieldDefinition: normalizesdFieldDefinition = [initialValue, rules];
			const schemaExtension: normalizedFormSchema = { [this.props.name]: fieldDefinition }

			this.form.extendSchema(schemaExtension);
		}

		this.field = this.form.registerField(this.props.name) as Field;
		this.field.subscribeToFormValidation(this.form);
	}

	componentWillUnmount() {
		this.form.removeField(this.props.name);
	}

	verifyRequiredProps() {
		Control.requiredProps.forEach(reqiredPropName => {
			if (!this.props[reqiredPropName]) {
				throw new Error(`You forgot to specify '${reqiredPropName}' property for <Field /> component. Cehck '${this.context._ReactiveMobxForm.component.name}' component`)
			}
		});
	}

	warnOnIncorrectInitialValues() {
		const inititlaValue = this.form.formSchema[this.props.name][0];
		const initialValueType = typeof inititlaValue; // initial value

		if (this.isSelect) {
			// todo: verify options to match select value
		}

		if (
			(this.isCheckbox && initialValueType !== 'boolean') ||
			(this.isNumber && initialValueType !== 'number') ||
			(!this.isCheckbox && !this.isNumber && initialValueType !== 'string')
		) {
			console.warn(`Incorrect initial value profided to field '${this.props.name}'. Got '${initialValueType}'`)
		}
	}

	onChange(event) {
		let value;

		if (this.isCheckbox) {
			value = event.target.checked
		} else if (this.isFile) {
			value = event.target.files;
		} else {
			value = event.target.value;
		}

		this.field.onChange(value);

		if (this.props.onChange) {
			this.props.onChange(event);
		}
	}

	onFocus(event) {
		this.field.onFocus();

		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
	}

	onBlur(event) {
		this.field.onBlur();

		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	}

	render() {
		// todo: implement withRef today
		const handlers = {
			onChange: this.onChange,
			onFocus: this.onFocus,
			onBlur: this.onBlur
		};

		const inputValue = {
			value: this.isRadio ? this.props.value : (this.field.value as string)
		}

		let checked = {};

		if (this.isCheckbox) {
			checked = { checked: (this.field.value as boolean) }
		}
		else if (this.isRadio) {
			checked = { checked: (this.field.value === this.props.value) }
		}

		const input = Object.assign({}, (this.isFile ? {} : inputValue), handlers, (this.isCheckable ? checked : {}));

		const meta = {
			focused: this.field.isFocused,
			touched: this.field.isTouched,
			dirty  : this.field.isDirty,
			valid  : this.field.isValid,
			errors : this.field.errors
		}

		const propsToPass = omit(this.props, Control.propNamesToOmitWhenByPass);


		if (typeof this.props.component === 'function') {
			return React.createElement(this.props.component, Object.assign({}, { input }, { meta }, propsToPass));
		}

		if (this.props.component === 'select') {
			return <select {...input} {...propsToPass}>{this.props.children}</select>
		}

		// input with text, checkbox, radio, email, number, password type or textarea
		return React.createElement(this.props.component as string, Object.assign({}, input, propsToPass));
	}
}