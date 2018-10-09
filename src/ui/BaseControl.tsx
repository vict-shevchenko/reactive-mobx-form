import * as React from 'react';

export interface IBaseControlProps {
	name: string;
	// React.ComponentType<P> ????
	component: React.Component<any, any> | React.SFC<any> | string;
}

export class BaseControl {
	public static skipProp: string[] = ['__formContext', '__parentNameContext', 'field'];
}
