import * as React from 'react';

export class Field extends React.Component<{name: string}, any> {
	static contextTypes = {
			_mobxReactiveForm: React.PropTypes.object.isRequired
	}

	render() {
		const form = this.context._mobxReactiveForm;
		const field = form.fields.find(field => field.name = this.props.name);

		return (
			React.createElement('input', {type: 'text', value: field.value})
		);
	}
}
