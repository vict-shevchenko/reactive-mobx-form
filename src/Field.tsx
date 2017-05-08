import * as React from 'react';
import { observer, Observer } from 'mobx-react';
import { MobxReactiveForm, MobxReactiveFormField } from './mobxReactiveForm'

const isClassComponent = Component => Boolean(
  Component &&
  Component.prototype &&
  typeof Component.prototype.isReactComponent === 'object'
)

/* function omit(obj:any, omitKeys:Array<string>) {
	const result = {};

	Object.keys(obj).forEach(key => {
		if(omitKeys.indexOf(key) === -1 ) {
			result[key] = obj[key];
		}
	});

	return result;
}
*/


//todo: add value property to make field a controled component

interface fieldProps {
	name: string;
	component: any;
	type: string;
	value?: string // should be fieldValue
	placeholder?: string;
	label?: string;
	children?: any;
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

		this.form = this.context._mobxReactiveForm;
		this.field = this.form.fields.find(field => field.name === this.props.name);

		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	componentWillMount() {
		if (!this.field) { // field was not registered in form definition
			this.field = this.form.registerField(this.props.name, '');
		}

		this.field.type = this.props.type;
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
		const handlers = {
				onChange: this.onChange,
				onFocus : this.onFocus,
				onBlur  : this.onBlur
			};

		const inputProps = {
			name : this.field.name,
			value: this.field.isRadio ? this.props.value : (this.field.value as string)
		}

		let checked = {};

		if (this.field.isCheckbox) {
			checked = {checked: (this.field.value as boolean)}
		}
		else if (this.field.isRadio) {
			checked = {checked: (this.field.value === this.props.value)}
		}


		const input = Object.assign({}, inputProps, handlers, (this.field.isCheckable ? checked : {}));

		const meta = {
			focused: this.field.isFocused,
			touched: this.field.isTouched,
			dirty  : this.field.isDirty,
			valid  : this.field.isValid
		}


		if (typeof this.props.component === 'function') {
			return React.createElement(this.props.component, Object.assign({}, { input }, { meta }, this.props))
		}
		
		if (this.props.component === 'select') {
			return <select {...input}>{this.props.children}</select>
		}

		/*if (this.field.type === 'checkbox') {
			return <input type="checkbox" {...input}/>
		}

		if (this.field.type === 'radio') {
			return <input type="radio" {...input}/>
		}*/

		// input with text, checkbox, radio, email, number, password type or textarea
		return React.createElement(this.props.component, Object.assign({}, input, {
			type: this.props.type,
			placeholder: this.props.placeholder,
		}));
	}
}