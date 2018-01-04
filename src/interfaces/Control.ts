export interface IControlProps {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
	rules: string;
	type?: string;
	children?: any;
	value?: string;
	onFocus?(event: Event): void;
	onBlur?(event: Event): void;
	onChange?(event: Event): void;
}

interface IGroupControlProps {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
}

export interface IGroupControlContext {
	_ReactiveMobxFormFieldNamePrefix: string;
}

export interface IControlArrayProps extends IGroupControlProps {}
export interface IControlSectionProps extends IGroupControlProps {}
