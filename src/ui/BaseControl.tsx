import * as React from 'react';

export interface IBaseControlProps {
	name: string;
	// !IMPORTANT We need a way to type the component we are passing into
	component: React.ComponentType<any> | string;
}

export class BaseControl {
	public static skipProp: string[] = ['form', 'parentName', 'field'];
}
