import * as React from 'react';
import { Form } from './Form';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

export interface IFormContext {
	form: Form;
	destroyControlStateOnUnmount: boolean;
}
export interface IControlFormContext {
	__formContext: IFormContext;
}

export interface IControlParentNameContext {
	__parentNameContext: string;
}

// tslint:disable-next-line: variable-name
export const FormContext = React.createContext({ form: {} as Form, destroyControlStateOnUnmount: true });
// tslint:disable-next-line: variable-name
export const ParentNameContext = React.createContext('');

// tslint:disable-next-line: variable-name
export function withForm<P extends IControlFormContext>(Component: React.ComponentType<P>) {
	return function ComponentWithFormContext(props: Subtract<P, IFormContext>) {
		return (
			<FormContext.Consumer>
				{formContext => <Component {...props} __formContext={formContext} />}
			</FormContext.Consumer>
		);
	};
}

// tslint:disable-next-line: variable-name
export function withParentName<P extends IControlParentNameContext>(Component: React.ComponentType<P>) {
	return function ComponentWithParentNameContext(props: Subtract<P, IControlParentNameContext>) {
		return (
			<ParentNameContext.Consumer>
				{parentNameContext => <Component {...props} __parentNameContext={parentNameContext} />}
			</ParentNameContext.Consumer>
		);
	};
}
