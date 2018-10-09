import React from 'react';
import { Control } from '../index';

interface IMyComponentProps {
	placehoder: string;
}

export class ToggleControlForm extends React.Component<any> {
	public state = {
		controlVisible: true
	};

	public render() {
		return (
		<form onSubmit={this.props.submit}>
			{
				this.state.controlVisible ?
				<Control name="hello" component="input" type="text" />
				: null
			}

			<Control<IMyComponentProps> type="text" name="welcome" component={MyComponent} placehoder='placeholder'/>
			<button type="submit" id="submit">Submit</button>
		</form>
		);
	}
}

// tslint:disable-next-line:variable-name
const MyComponent = () => (
	<div>
		<input type="text" />
	</div>
);
