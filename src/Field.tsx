import * as React from 'react';
import { observer } from 'mobx-react';
import { MobxReactiveForm, MobxReactiveFormField } from './mobxReactiveForm'

/*const isClassComponent = Component => Boolean(
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
*/

interface fieldProps {
	name: string;
	component: any;
	type: string;
	placeholder?: string;
	label?: string;
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
	}

	onChange(event) {
		this.field.value = (this.props.type === 'checkbox') ? event.target.checked : event.target.value;

		if(this.props.onChange) {
			this.props.onChange(event);
		}
	}

	render() {

		/*if (isClassComponent(Component)) {
			return React.createElement(Component, Object.assign({}, this.props, {field: field}))
		}
		else {*/
		return React.createElement(this.props.component, {
			type: this.props.type || 'text',
			placeholder: this.props.placeholder,
			value: this.field.value,
			onChange: this.onChange
		})

		//}
	}
}