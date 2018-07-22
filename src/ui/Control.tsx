import * as React from 'react';
import { observer } from 'mobx-react';
import { Field } from '../Field';

import { INormalizedFieldDefinition, IFieldDefinition, fieldValue } from '../interfaces/Form';
import { omit, verifyRequiredProps } from '../utils';
import BaseControl from './BaseControl';
import { withForm, withParentName } from '../context';
import { IControlProps } from '../interfaces/Control';
import { withField, constructName } from './WithFieldHoc';
import { formField } from '../types';

// todo: probably may be used when implementing withRef
/*const isClassComponent = Component => Boolean(
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)*/

// todo: add value property to make field a controlled component

@observer
class Control extends React.Component<IControlProps> {
	private isNumber: boolean;
	private isSelect: boolean;
	private isTextarea: boolean;
	private isCheckable: boolean;
	private isFile: boolean;
	private isRadio: boolean;
	private isCheckbox: boolean;

	public static defaultProps = {
		rules: ''
	};

	public static normalizeFieldDefinition(fieldDefinition: IFieldDefinition): INormalizedFieldDefinition {
		if (Array.isArray(fieldDefinition)) {
			return (fieldDefinition.length === 2) ? (fieldDefinition as [fieldValue, string]) : [fieldDefinition[0], ''];
		}

		return [fieldDefinition, ''];
	}

	public static requiredProps: string[] = ['component', 'name'];
	public static skipProp: string[] = ['component', 'rules', 'className'];

	constructor(props) {
		super(props);

		const requiredProps = [...Control.requiredProps];

		this.isRadio     = props.type      === 'radio';
		this.isCheckbox  = props.type      === 'checkbox';
		this.isFile      = props.type      === 'file';
		this.isNumber    = props.type      === 'number';
		this.isSelect    = props.component === 'select';
		this.isTextarea  = props.component === 'textarea';
		this.isCheckable = this.isCheckbox || this.isRadio;

		this.onChange = this.onChange.bind(this);
		this.onFocus  = this.onFocus.bind(this);
		this.onBlur   = this.onBlur.bind(this);

		if (this.isRadio) {
			requiredProps.push('value');
		}

		if (!(this.isSelect || this.isTextarea)) {
			requiredProps.push('type');
		}

		verifyRequiredProps(requiredProps, this.props, this);

		// we assume, that there can be several controls in form connected with on field instance in form
		// so before field creation - we check for existance of field with this name
		// this is useful in radiobutton case
		/* this.field = this.form.getField(this.state.name) as Field;

		if (!this.field) {
			this.createField();
			this.field.subscribeToFormValidation(this.form);
		} */
	}

/* 	private createField(): void {
		const fieldDefinition = this.prepareFieldDefinition(this.state.name, this.props.rules);

		this.warnOnIncorrectInitialValues(fieldDefinition[0]);

		this.field = new Field(this.state.name, fieldDefinition);
		this.form.registerField(this.field);
	} */

	public componentWillUnmount(): void {
		const { __formContext: { form, destroyControlStateOnUnmount }, field} = this.props;

		if (!field.autoRemove && destroyControlStateOnUnmount) {
			form.unregisterField(field.name);
		}
	}

 public componentDidUpdate(prevProps: IControlProps) {
		if (
			this.props.__parentNameContext !== prevProps.__parentNameContext ||
			this.props.name !== prevProps.name ||
			this.props.rules  !==  prevProps.rules
		) {
			const newName = constructName(this.props.__parentNameContext, this.props.name);
			const newFieldDefinition = prepareFieldDefinition(newName, this.props);

			this.props.field.update(newName, newFieldDefinition);
		}
	}

	private onChange(event): void {
		let value;

		if (this.isCheckbox) {
			// checkboxes may have(not) a value property that corresponds to true value
			value = (event.target.checked && this.props.value) ? event.target.value : event.target.checked;
		}
		else if (this.isFile) {
			value = event.target.files;
		}
		else {
			value = event.target.value;
		}

		this.props.field.onChange(value);

		if (this.props.onChange) {
			this.props.onChange(event);
		}
	}

	private onFocus(event): void {
		this.props.field.onFocus();

		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
	}

	private onBlur(event): void {
		this.props.field.onBlur();

		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
	}

	public render() {
		// tslint:disable-next-line:no-console
		console.log(`render ${this.props.name}`);
		// todo: implement withRef today
		const { field } = this.props;

		const handlers = {
			onChange: this.onChange,
			onFocus: this.onFocus,
			onBlur: this.onBlur
		};

		const inputValue = {
			value: (this.isCheckable && this.props.value) ? this.props.value : (field.value as string)
		};

		const inputChecked = {
			checked: {}
		};

		if (this.isCheckbox) {
			inputChecked.checked = !!field.value;
		}
		else if (this.isRadio) {
			inputChecked.checked = field.value === this.props.value;
		}

		const meta = {
			focused: field.isFocused,
			touched: field.isTouched,
			dirty  : field.isDirty,
			valid  : field.isValid,
			errors : field.errors
		};

		const className = [
			this.props.className,
			meta.touched ? 'rmf-touched' : 'rmf-untouched',
			meta.dirty   ? 'rmf-dirty'   : 'rmf-pristine',
			meta.valid   ? 'rmf-valid'   : 'rmf-invalid'
		].join(' ');

		const input = Object.assign(
			{},
			{ className },
			// input type file, and checkbox without value should not have this attribute
			((this.isFile || (this.isCheckbox && !this.props.value)) ? {} : inputValue),
			handlers,
			(this.isCheckable ? inputChecked : {})
		);

		const propsToPass = omit(this.props, [...BaseControl.skipProp, ...Control.skipProp]);

		if (typeof this.props.component === 'function') {
			return React.createElement(this.props.component, Object.assign({}, { input }, { meta }, propsToPass));
		}

		if (this.props.component === 'select') {
			return <select {...input} {...propsToPass}>{this.props.children}</select>;
		}

		// input with text, checkbox, radio, email, number, password type or textarea
		return React.createElement(this.props.component as string, Object.assign({}, input, propsToPass));
	}
}

// tslint:disable-next-line: variable-name
const ControlWithField = withField(Control, (name: string, props: IControlProps) => {
	const { __formContext : { form }} = props;
	const fieldDefinition: INormalizedFieldDefinition = prepareFieldDefinition(name, props);
	let field: formField;

	// this.warnOnIncorrectInitialValues(fieldDefinition[0]);
	field = new Field(name, fieldDefinition);

	field.subscribeToFormValidation(form);

	return field;
});

// tslint:disable-next-line: variable-name
export const ControlWithContext = withParentName(withForm(ControlWithField));

/*
	private warnOnIncorrectInitialValues(initialValue: fieldValue): void {
		const initialValueType = typeof initialValue; // initial value

		if (this.isSelect) {
			// todo: verify options to match select value
		}

		if (
			(this.isCheckbox && initialValueType !== 'boolean') ||
			(this.isNumber && initialValueType !== 'number') ||
			(!this.isCheckbox && !this.isNumber && initialValueType !== 'string')
		) {
			// tslint:disable-next-line
			console.warn(`Incorrect initial value provided to field '${this.state.name}'. Got '${initialValueType}'`)
		}
	}
*/
function prepareFieldDefinition(name: string, props: IControlProps): INormalizedFieldDefinition {
	const { __formContext: { form }, rules } = props;

	if (form.formSchema[name]) {
		// normalize field definition from initial form schema
		return Control.normalizeFieldDefinition(form.formSchema[name]);
	} else {
		return  [props.type === 'checkbox' ? false : '', rules];
	}
}
