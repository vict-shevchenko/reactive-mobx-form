import * as React from 'react';
import * as PropTypes from 'prop-types';
import { observer, Observer } from 'mobx-react';
import { Form } from '../Form';
import { Field } from '../Field'

import { INormalizesdFieldDefinition, IFieldDefinition, fieldValue } from '../../interfaces/Form';
import { omit, objectPath } from "../utils";
import BaseControl from "./BaseControl";
import { IControlProps } from '../../interfaces/Control';


// todo: probabbly may be used when implementing withRef
/*const isClassComponent = Component => Boolean( 
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)*/

// todo: add value property to make field a controled component

@observer
export class Control extends BaseControl<IControlProps, any> {
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

	public static normalizeFieldDefinition(fieldDefinition: IFieldDefinition): INormalizesdFieldDefinition {
		if (Array.isArray(fieldDefinition)) {
			return (fieldDefinition.length === 2) ? (fieldDefinition as [fieldValue, string]) : [fieldDefinition[0], ''];
		}

		return [fieldDefinition, ''];
	}

	constructor(props, context) {
		super(props, context, Control.requiredProps);

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

	createField() {
		const fieldDefinition: INormalizesdFieldDefinition = this.form.formSchema[this.name] ?
			  Control.normalizeFieldDefinition(this.form.formSchema[this.name]) : // normalize field definition from initial form schema
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

	componentWillReceiveProps(nextProps: IControlProps, nextContext: any) {
		const nextName = BaseControl.constructName(nextContext._ReactiveMobxFormFieldNamePrefix, nextProps.name);

		if (this.name !== nextName || this.props.rules !== nextProps.rules) {
			const fieldDefinition: INormalizesdFieldDefinition = this.form.formSchema[nextName] ?
			  Control.normalizeFieldDefinition(this.form.formSchema[nextName]) : // normalize field definition from initial form schema
			  [this.isCheckbox ? false : '', nextProps.rules];

			this.field.update(nextName, fieldDefinition);
			this.name = nextName;
		}
	}

	warnOnIncorrectInitialValues(fieldDefinition:INormalizesdFieldDefinition) {
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