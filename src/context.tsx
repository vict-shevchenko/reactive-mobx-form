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

// tslint:disable-next-line: variable-name
export const FormContext = React.createContext({ form: {} as Form, destroyControlStateOnUnmount: true });
// tslint:disable-next-line: variable-name
export const ParentNameContext = React.createContext('');

// tslint:disable-next-line: variable-name
export function withForm<P extends IControlFormContext>(Component: React.ComponentType<P>) {
	/* return function ComponentWithFormContext(props: Subtract<P, IFormContext>) {
		return (
			<FormContext.Consumer>
				{formContext => <Component {...props} __formContext={formContext} />}
			</FormContext.Consumer>
		);
	}; */
	return class ComponentWithFormContext extends React.Component<Subtract<P, IControlFormContext>, any> {
		public render() {
			return (
				<FormContext.Consumer>
				{(formContext: IFormContext) => <Component {...this.props} __formContext={formContext} />}
				</FormContext.Consumer>
			);
		}
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



interface ICounterProps extends IControlFormContext {
	bla: string;
}

// tslint:disable-next-line:variable-name
const Counter = (props: ICounterProps) => (
  <div>
    <button onClick={props.onDecrement}> - </button>
    {props.__formContext}
    <button onClick={props.onIncrement}> + </button>
  </div>
);

// tslint:disable-next-line:variable-name
const WrappedConuter = withForm(Counter);
const wc = <WrappedConuter bla="sdfsdfsfd" __formContext={{} as Form}/>;
