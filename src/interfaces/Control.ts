import { Form } from '../Form';

interface IFormContext {
	form: Form;
	destroyControlStateOnUnmount: boolean;
}
export interface IControlContext {
	__formContext: IFormContext;
	__parentNameContext: string;
}

export interface IControlProps extends IControlContext {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
	rules: string;
	type?: string;
	children?: any;
	value?: string;
	className?: string;
	onFocus?(event: Event): void;
	onBlur?(event: Event): void;
	onChange?(event: Event): void;
}

interface IGroupControlProps extends IControlContext {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
}

export interface IControlArrayProps extends IGroupControlProps {} // tslint:disable-line:  no-empty-interface
export interface IControlSectionProps extends IGroupControlProps {} // tslint:disable-line:  no-empty-interface
