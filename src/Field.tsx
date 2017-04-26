import * as React from 'react';

export class Field extends React.Component {
	render() {
		const form = this.context._mobxReactiveForm;

		return (
			React.createElement('input', {type: 'text', value: form.fields[this.props.name][0]})
		)
	}
}

Field.contextTypes = {
	_mobxReactiveForm: React.PropTypes.object.isRequired
};