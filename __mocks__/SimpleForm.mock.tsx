// tslint:disable:variable-name

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

export const SubmitForm: React.SFC<IReactiveMobxFormProps> = ({ submit }) => (
	<form onSubmit={submit}>
		<Control name="firstName" component="input" type="text" />
		<button type="submit" id="submit">Submit</button>
	</form>
);

export const CustomSubmitFormWithEvent: React.SFC<IReactiveMobxFormProps> = ({ submit }) => {
	const handleSubmit = (e: any) => {
		submit(e, 'test');
	};

	return (
		<form onSubmit={handleSubmit}>
			<Control name="firstName" component="input" type="text" />
			<button type="submit" id="submit">Submit</button>
		</form>
	);
};

export const CustomSubmitFormWithoutEvent: React.SFC<IReactiveMobxFormProps<string>> = ({ submit }) => {
	const handleSubmit = () => {
		submit('test').then(data => {
			return data.length;
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<Control name="firstName" component="input" type="text" />
			<button type="submit" id="submit">Submit</button>
		</form>
	);
};

export const WizardForm1: React.SFC<IReactiveMobxFormProps> = ({ submit }) => (
	<form onSubmit={submit}>
		<Control name="firstName" component="input" type="text" />
		<button type="submit" id="submit">Submit</button>
	</form>
);

export const WizardForm2: React.SFC<IReactiveMobxFormProps> = ({ submit }) => (
	<form onSubmit={submit}>
		<Control name="lastName" component="input" type="text" />
		<button type="submit" id="submit">Submit</button>
	</form>
);
