import * as React from 'react';
import { observer } from 'mobx-react';
import { Field } from '../core/Field';

import { INormalizedFieldDefinition } from '../interfaces/Form';
import { omit, verifyRequiredProps } from '../utils';
import { IBaseControlProps, BaseControl } from './BaseControl';
import { withForm, withParentName, IControlFormContext, IControlParentNameContext } from '../react/Context';
import { withField, constructName, IControlWithFieldContext } from './WithFieldHoc';
import { IReactionDisposer } from 'mobx';

// todo: probably may be used when implementing withRef
/*const isClassComponent = Component => Boolean(
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)*/

// tslint:disable-next-line:max-line-length
export interface IControlProps extends IBaseControlProps, IControlFormContext, IControlParentNameContext, IControlWithFieldContext<Field> {
	type: string;
	rules?: string;
	children?: any;
	value?: string;
	className?: string;
	onFocus?(event: Event): void;
	onBlur?(event: Event): void;
	onChange?(event: Event): void;
	fieldRef?(f: Field): void;
}

// todo: add value property to make field a controlled component
function prepareFieldDefinition(name: string, props: IControlProps): INormalizedFieldDefinition {
	const { form, rules = '' } = props;
	const fieldDefinition: INormalizedFieldDefinition | undefined = form.formSchema[name];

	if (fieldDefinition) {
		// normalize field definition from initial form schema
		return [fieldDefinition[0], rules ? rules : fieldDefinition[1]];
	} else {
		return  [props.type === 'checkbox' ? false : '', rules];
	}
}

@observer
export class Control<P> extends React.Component<P & IControlProps, any> {
	// private isNumber: boolean;
	private isSelect: boolean;
	private isTextarea: boolean;
	private isCheckable: boolean;
	private isFile: boolean;
	private isRadio: boolean;
	private isCheckbox: boolean;

	private formErrorUnsubscribe: IReactionDisposer;

	public static requiredProps: string[] = ['component', 'name'];
	public static skipProp: string[] = ['component', 'rules', 'className', 'fieldRef'];

	constructor(props: P & IControlProps) {
		super(props);

		const requiredProps = [...Control.requiredProps];

		this.isRadio     = props.type      === 'radio';
		this.isCheckbox  = props.type      === 'checkbox';
		this.isFile      = props.type      === 'file';
		// this.isNumber    = props.type      === 'number';
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
		if (this.props.fieldRef) {
			this.props.fieldRef(this.props.field);
		}
	}

	public componentDidMount() {
		const { form, field } = this.props;
		this.formErrorUnsubscribe = field.subscribeToFormValidation(form);
	}

	public componentWillUnmount(): void {
		const { form, field} = this.props;

		this.formErrorUnsubscribe();
		form.unregisterField(field);
	}

 public componentDidUpdate(prevProps: IControlProps) {
		if (
			this.props.parentName !== prevProps.parentName ||
			this.props.name !== prevProps.name ||
			this.props.rules  !==  prevProps.rules
		) {
			const newName = constructName(this.props.parentName, this.props.name);
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
			errors : field.errors,
			reset  : field.reset.bind(field)
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

function createField(name: string, props: IControlProps): Field {
	const fieldDefinition: INormalizedFieldDefinition = prepareFieldDefinition(name, props);
	return new Field(name, fieldDefinition);
}

// tslint:disable-next-line: variable-name
export const ControlWithContext = withParentName(withForm(withField(Control, createField)));

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
