import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Form } from '../Form';
import { Field } from '../Field'

import { normalizesdFieldDefinition } from '../../interfaces/Form';
import { omit, objectPath } from "../utils";

interface iBaseControlProps {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
	rules?: string;
}

export default class BaseControl<P extends iBaseControlProps, S> extends React.Component<P, S> {
	name: string;
	form: Form;

	static verifyRequiredProps(required, props, context) {
		required.forEach(reqiredPropName => {
			if (props[reqiredPropName] === undefined) {
				throw new Error(`You forgot to specify '${reqiredPropName}' property for <Field /> component. Cehck '${context._ReactiveMobxForm.component.name}' component`)
			}
		});
	}

	static constructName(prefix: string, name: string | number) : string {
		if (typeof name === 'number') {
			if (!prefix) {
				throw new Error('Field with numeric name can not be a root field.')
			}

			return `${prefix}[${name}]`;
		}
		else {
			return prefix ? `${prefix}.${name}` : name;
		}
	}

	constructor(props: P, context, requiredProps) {
		super(props, context);

		BaseControl.verifyRequiredProps(requiredProps, props, context);
		this.form = context._ReactiveMobxForm;
		this.name = BaseControl.constructName(context._ReactiveMobxFormFieldNamePrefix, props.name);
	}
}