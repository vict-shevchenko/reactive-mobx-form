import { Form } from '../Form';
import { formField } from '../types';
import { Field } from '../Field';
import { FieldArray } from '../FieldArray';
import { FieldSection } from '../FieldSection';

interface IFormContext {
	form: Form;
	destroyControlStateOnUnmount: boolean;
}
export interface IControlContext {
	__formContext: IFormContext;
	__parentNameContext: string;
}
// todo: don't use it in withFieldHoc
export interface IControlProps extends IControlContext {
	field: Field;
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
	rules: string;
	type: string;
	children?: any;
	value?: string;
	className?: string;
	onFocus?(event: Event): void;
	onBlur?(event: Event): void;
	onChange?(event: Event): void;
}

interface IGroupControlProps extends IControlContext {
	field: FieldArray | FieldSection;
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
}

export interface IControlArrayProps extends IGroupControlProps {} // tslint:disable-line:  no-empty-interface
export interface IControlSectionProps extends IGroupControlProps {} // tslint:disable-line:  no-empty-interface
