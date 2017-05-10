import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import { MobxReactiveForm, MobxReactiveFormField } from './mobxReactiveForm'

const propNamesToOmitWhenByPass: Array<string> = ['component'];
const requiredProps: Array<string> = ['component', 'name']

const isClassComponent = Component => Boolean(
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)

function omit(obj:any, omitKeys:Array<string>) {
	const result = {};

	Object.keys(obj).forEach(key => {
		if(omitKeys.indexOf(key) === -1 ) {
			result[key] = obj[key];
		}
	});

	return result;
}

function verifyRequiredProps(componentProps, form) {
	requiredProps.forEach(reqiredPropName => {
		if(!componentProps[reqiredPropName]) {
			throw new Error(`You forgot to specify '${reqiredPropName}' property for <Field /> component. Cehck '${form.component.name}' component`)
		}
	});
}

function warnOnIncorrectInitialValues(field:MobxReactiveFormField, props) {
	const initialValueType = typeof field.initialValue;
	const isChechbox = props.type === 'checkbox';
	const isNumber = props.type === 'number';

	if (
		(isChechbox && initialValueType !== 'boolean') ||
		(isNumber && initialValueType !== 'number') ||
		(!isChechbox && !isNumber  && initialValueType !== 'string')
	) {
		console.warn(`Incorrect initial value profided to field '${field.name}'. Expected 'boolean' got '${initialValueType}'`)
	}
}


//todo: add value property to make field a controled component

interface fieldProps {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
	type: string;

	children?: any;

	
	value?: string // should be fieldValue
	/*
	placeholder?: string;
	label?: string;
	*/

	onFocus?(event:Event):void;
	onBlur?(event:Event):void;
	onChange?(event:Event):void;
}

@observer
export class Field extends React.Component<fieldProps, any> {
	form: MobxReactiveForm;
	field: MobxReactiveFormField;

	static contextTypes = {
		_mobxReactiveForm: React.PropTypes.object.isRequired
	}

	constructor(props, context) {
		super(props, context);

		verifyRequiredProps(props, context._mobxReactiveForm);

		this.form = context._mobxReactiveForm;
		this.field = this.form.fields.find(field => field.name === this.props.name);

		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	componentWillMount() {
		if (this.field) {
			// todo: remove warning in production build
			warnOnIncorrectInitialValues(this.field, this.props);
		}
		else { // field was not registered in form definition
			const initialValue: boolean | string = this.props.type === 'checkbox' ? false : '';
			this.field = this.form.registerField(this.props.name, initialValue); //todo: add definition of field like initial value and validation rules
		}
	}

	componentWillUnmount() {
		this.form.removeField(this.props.name);
	}

	onChange(event) {
		this.field.onChange(this.field.isCheckbox ? event.target.checked : event.target.value)

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
		// todo: implement withRef
		const handlers = {
				onChange: this.onChange,
				onFocus : this.onFocus,
				onBlur  : this.onBlur
			};

		const inputValue = {
			value: this.field.isRadio ? this.props.value : (this.field.value as string)
		}

		let checked = {};

		if (this.field.isCheckbox) {
			checked = {checked: (this.field.value as boolean)}
		}
		else if (this.field.isRadio) {
			checked = {checked: (this.field.value === this.props.value)}
		}


		const input = Object.assign({}, inputValue, handlers, (this.field.isCheckable ? checked : {}));

		const meta = {
			focused: this.field.isFocused,
			touched: this.field.isTouched,
			dirty  : this.field.isDirty,
			valid  : this.field.isValid
		}

		const propsToPass = omit(this.props, propNamesToOmitWhenByPass);


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