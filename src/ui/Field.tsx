import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import { ReactiveMobxForm } from '../Form';
import { ReactiveMobxFormField } from '../Field'

import { fieldDefinition, normalizesdFieldDefinition } from '../interface'


// todo: probabbly may be used when implementing withRef
/*const isClassComponent = Component => Boolean( 
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)*/

function omit(obj:any, omitKeys:Array<string>) {
	const result = {};

	Object.keys(obj).forEach(key => {
		if(omitKeys.indexOf(key) === -1 ) {
			result[key] = obj[key];
		}
	});

	return result;
}

//todo: add value property to make field a controled component

interface FieldProps {
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

	onFocus?(event:Event):void;
	onBlur?(event:Event):void;
	onChange?(event:Event):void;
}

@observer
export class Field extends React.Component<FieldProps, any> {
	form: ReactiveMobxForm;
	field: ReactiveMobxFormField;

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

		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	componentWillMount() {
		if (this.form.formSchema[this.props.name]) {
			// todo: remove warning in production build
			this.warnOnIncorrectInitialValues();
		}
		else { // field was not registered in form schema or exteded as <Form schema/> parameter
			const initialValue   : boolean | string           = this.props.type === 'checkbox' ? false : '';
			const rules          : string                     = this.props.rules;
			const fieldDefinition: normalizesdFieldDefinition = [ initialValue, rules ];

			this.form.extend({[this.props.name]: fieldDefinition})
		}

		this.field = this.form.fields.find(field => field.name === this.props.name);
	}

	componentWillUnmount() {
		this.form.removeField(this.props.name);
	}

	verifyRequiredProps() {
		Field.requiredProps.forEach(reqiredPropName => {
			if(!this.props[reqiredPropName]) {
				throw new Error(`You forgot to specify '${reqiredPropName}' property for <Field /> component. Cehck '${this.context._ReactiveMobxForm.component.name}' component`)
			}
		});
	}

	warnOnIncorrectInitialValues() {
		const inititlaValue = this.form.formSchema[this.props.name][0];
		const initialValueType = typeof inititlaValue; // initial value
		const isChechbox = this.props.type === 'checkbox';
		const isNumber   = this.props.type === 'number';
		const isSelect   = this.props.component === 'select';

		if (isSelect) {
			// todo: verify options to match select value
		}

		if (
			(isChechbox  && initialValueType !== 'boolean') ||
			(isNumber    && initialValueType !== 'number')  ||
			(!isChechbox && !isNumber  && initialValueType !== 'string')
		) {
			console.warn(`Incorrect initial value profided to field '${this.props.name}'. Expected 'boolean' got '${initialValueType}'`)
		}
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

		const propsToPass = omit(this.props, Field.propNamesToOmitWhenByPass);


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