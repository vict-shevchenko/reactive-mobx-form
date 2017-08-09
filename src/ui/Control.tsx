import * as React from 'react';
import * as PropTypes from 'prop-types';
import { observer, Observer } from 'mobx-react';
import { Form } from '../Form';
import { Field } from '../Field'

import { normalizesdFieldDefinition, normalizedFormSchema } from '../interface'
import { omit, objectPath } from "../utils";


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
	name: string;
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

	static contextTypes = {
		_ReactiveMobxForm: PropTypes.object.isRequired,
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string
	}

	static defaultProps = {
		rules: ''
	}

	constructor(props, context) {
		super(props, context);

		this.verifyRequiredProps();

		this.form = context._ReactiveMobxForm;

		this.name = context._ReactiveMobxFormFieldNamePrefix ? `${context._ReactiveMobxFormFieldNamePrefix}.${props.name}` : props.name;

		this.isCheckbox  = props.type      === 'checkbox';
		this.isRadio     = props.type      === 'radio';
		this.isFile      = props.type      === 'file';
		this.isNumber    = props.type      === 'number';
		this.isSelect    = props.component === 'select';
		this.isCheckable = this.isCheckbox || this.isRadio;

		this.onChange = this.onChange.bind(this);
		this.onFocus  = this.onFocus.bind(this);
		this.onBlur   = this.onBlur.bind(this);
	}

	componentWillMount() {
		// Radio buttons have several controls which all should point to the same field in a form
		if (this.isRadio) {
			this.field = this.form.findFieldInHierarchy(objectPath(this.name)) as Field;

			if (!this.field) {
				this.createField();
			}
		} else {
			this.createField();
		}

		this.field.subscribeToFormValidation(this.form);
	}

	componentDidMount() {
		// this.field
	}

	createField() {
		const fieldDefinition: normalizesdFieldDefinition = this.form.formSchema[this.name] ?
			  Field.normalizeFieldDefinition(this.form.formSchema[this.name]) : // normalize field definition from initial form schema
			  [this.isCheckbox ? false : '', this.props.rules];

		this.warnOnIncorrectInitialValues(fieldDefinition);

		this.field = new Field(this.name, fieldDefinition)
		this.form.registerField(this.field);
	}

	componentWillUnmount() {
		if (!this.field.autoRemove) {
			this.form.removeField(this.name);
		}
	}

	componentWillReceiveProps(nextProps: ControlProps, nextContext: any) {
		const name = nextContext._ReactiveMobxFormFieldNamePrefix ? `${nextContext._ReactiveMobxFormFieldNamePrefix}.${nextProps.name}` : nextProps.name.toString();

		if (this.name !== name || this.props.rules !== nextProps.rules) {
			const fieldDefinition: normalizesdFieldDefinition = this.form.formSchema[name] ?
			  Field.normalizeFieldDefinition(this.form.formSchema[name]) : // normalize field definition from initial form schema
			  [this.isCheckbox ? false : '', nextProps.rules];

			this.field.update(name, fieldDefinition);
			this.name = name;
		}
	}

	verifyRequiredProps() {
		Control.requiredProps.forEach(reqiredPropName => {
			if (this.props[reqiredPropName] === undefined) {
				throw new Error(`You forgot to specify '${reqiredPropName}' property for <Field /> component. Cehck '${this.context._ReactiveMobxForm.component.name}' component`)
			}
		});
	}

	warnOnIncorrectInitialValues(fieldDefinition:normalizesdFieldDefinition) {
		const inititlaValue = fieldDefinition[0];
		const initialValueType = typeof inititlaValue; // initial value

		if (this.isSelect) {
			// todo: verify options to match select value
		}

		if (
			(this.isCheckbox && initialValueType !== 'boolean') ||
			(this.isNumber && initialValueType !== 'number') ||
			(!this.isCheckbox && !this.isNumber && initialValueType !== 'string')
		) {
			console.warn(`Incorrect initial value profided to field '${this.name}'. Got '${initialValueType}'`)
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

		const meta = {
			focused: this.field.isFocused,
			touched: this.field.isTouched,
			dirty  : this.field.isDirty,
			valid  : this.field.isValid,
			errors : this.field.errors
		}

		const className = [
			meta.touched ? 'rmf-touched' : 'rmf-untouched',
			meta.dirty   ? 'rmf-dirty'   : 'rmf-pristine',
			meta.valid   ? 'rmf-valid'   : 'rmf-invalid'
		].join(' ');

		const input = Object.assign({}, { className }, (this.isFile ? {} : inputValue), handlers, (this.isCheckable ? checked : {}));

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