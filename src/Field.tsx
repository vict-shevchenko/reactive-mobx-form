import * as React from 'react';

export class Field extends React.Component<{name: string}, any> {
	static contextTypes = {
			_mobxReactiveForm: React.PropTypes.object.isRequired
	}

	render() {
		const form = this.context._mobxReactiveForm;

		return (
			React.createElement('input', {type: 'text', value: form.fields[this.props.name][0]})
		)
	}
}
