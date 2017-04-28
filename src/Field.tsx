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
	isCheckbox: boolean = false;

	static contextTypes = {
		_mobxReactiveForm: React.PropTypes.object.isRequired
	}

	constructor(props, context) {
		super(props, context);

		this.form = this.context._mobxReactiveForm;
		this.field = this.form.fields.find(field => field.name === this.props.name);
		this.isCheckbox  = this.props.type === 'checkbox';

		this.field.type = this.props.type;

		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}

	/*componentWillMount() {
		// todo: handle select box initial value and value when proving wrong initial value
		this.field.onChange(this.isCheckbox ? !!this.field.initialValue : this.field.initialValue)
	}*/

	onChange(event) {
		this.field.onChange(this.isCheckbox ? event.target.checked : event.target.value)

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
		const eventHandlers = {
				onChange: this.onChange,
				onFocus: this.onFocus,
				onBlur: this.onBlur
			};

		if (isClassComponent(this.props.component)) {
			// return React.createElement(Component, Object.assign({}, this.props, {field: field}))
		}
		
		if (this.props.component === 'select') {
			//todo: select constantly rerenders if options are passed
			return (
				<select name={this.field.name} value={(this.field.value as string)} {...eventHandlers}>{this.props.children}</select>
			)
		}

		if (this.field.type === 'checkbox') {
			return <input type="checkbox" name={this.field.name} checked={(this.field.value as boolean)} {...eventHandlers}/>
		}

		if (this.field.type === 'radio') {
			return <input type="radio" name={this.field.name} checked={(this.field.value === this.props.value)} value={this.props.value} {...eventHandlers}/>
		}

		// input with text type or textarea
		return React.createElement(this.props.component, Object.assign({}, {
			type: this.props.type,
			placeholder: this.props.placeholder,
			value: this.field.value,
		}, eventHandlers));
	}
}