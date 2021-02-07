import * as React from 'react';
import { Subtract } from 'utility-types';
import { Form } from '../core/Form';
import { FormStore } from './Store';

export interface IControlFormContext {
	form: Form;
}

export interface IControlParentNameContext {
	parentName: string;
}

// tslint:disable-next-line: variable-name
export const FormStoreContext = React.createContext({} as FormStore);
// tslint:disable-next-line: variable-name
export const FormContext = React.createContext({} as Form);
// tslint:disable-next-line: variable-name
export const ParentNameContext = React.createContext('');

// tslint:disable-next-line: variable-name
export function withForm<P extends IControlFormContext>(Component: React.ComponentType<P>) {
	return class ComponentWithFormContext<PP> extends React.Component<Subtract<P, IControlFormContext> & PP> {
		render() {
			return (
				<FormContext.Consumer>
					{(form: Form) => <Component {...this.props as P & PP} form={form} />}
				</FormContext.Consumer>
			);
		}
	};
}

// tslint:disable-next-line: variable-name
export function withParentName<P extends IControlParentNameContext>(Component: React.ComponentType<P>) {
	// tslint:disable-next-line:max-classes-per-file
	return class ComponentWithParentNameContext<PP> extends React.Component<Subtract<P, IControlParentNameContext> & PP> {
		render() {
			return (
				<ParentNameContext.Consumer>
					{(parentName: string)  => <Component {...this.props as P & PP} parentName={parentName} />}
				</ParentNameContext.Consumer>
			);
		}
	};
}
