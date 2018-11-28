import * as React from 'react';
import { Control } from '../index';
import { IReactiveMobxFormProps } from '../index';

export interface IToggle {
	controlVisible: boolean;
}

export class ToggleControlForm extends React.Component<IReactiveMobxFormProps & IToggle> {
	public render() {
		return (
		<form onSubmit={this.props.submit}>
			{
				this.props.controlVisible ?
				<Control name="firstName" component="input" type="text" />
				: null
			}
			<button type="submit" id="submit">Submit</button>
		</form>
		);
	}
}
