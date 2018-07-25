import * as React from 'react';
import { Form } from './Form';

interface IFormContext {
	form: Form;
	destroyControlStateOnUnmount: boolean;
}
export interface IControlContext {
	__formContext: IFormContext;
	__parentNameContext: string;
}

// tslint:disable-next-line: variable-name
export const FormContext = React.createContext({ form: {}, destroyControlStateOnUnmount: true });
// tslint:disable-next-line: variable-name
export const ParentNameContext = React.createContext('');

// tslint:disable-next-line: variable-name
export function withForm(Component) {
	return function ComponentWithFormContext(props) {
		return (
			<FormContext.Consumer>
				{formContext => <Component {...props} __formContext={formContext} />}
			</FormContext.Consumer>
		);
	};
}

// tslint:disable-next-line: variable-name
export function withParentName(Component) {
	return function ComponentWithParentNameContext(props) {
		return (
			<ParentNameContext.Consumer>
				{parentNameContext => <Component {...props} __parentNameContext={parentNameContext} />}
			</ParentNameContext.Consumer>
		);
	};
}
