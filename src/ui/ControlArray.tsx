import * as React from 'react';
import * as PropTypes from 'prop-types';
import { observable } from 'mobx'; 
import { observer, Observer } from 'mobx-react';
import { Form } from '../Form';
import { Field } from '../Field'
import ProxyFieldArray from '../ProxyFieldArray';

import { fieldDefinition, normalizesdFieldDefinition, normalizedFormSchema } from '../interface'
import { FieldArray } from "../FieldArray";
import { omit } from "../utils";
import BaseControl from "./BaseControl";

interface ControlArrayProps {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
}

@observer
export class ControlArray extends BaseControl<ControlArrayProps, any> {
	proxiedFieldsProp: ProxyFieldArray;
	name: string;
	field: FieldArray;
	form : Form;

	static requiredProps: Array<string> = ['component', 'name'];
	static propNamesToOmitWhenByPass: Array<string> = ['component', 'rules'];

	static contextTypes = {
		_ReactiveMobxForm: PropTypes.object.isRequired,
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string
	}

	static childContextTypes = {
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string.isRequired,
	}

	@observable fieldsProp: Array<string> = [];

	constructor(props, context) {
		super(props, context, ControlArray.requiredProps);
	}

	getChildContext() {
		return {
			_ReactiveMobxFormFieldNamePrefix: this.name
		};
	}

	componentWillMount() {
		this.field = new FieldArray(this.name);
		this.form.registerField(this.field);
		this.proxiedFieldsProp = new ProxyFieldArray(this.fieldsProp, this.field.subFields);
	}

	componentWillUnmount() {
		if (!this.field.autoRemove) {
			this.field.setAutoRemove();
			this.form.removeField(this.name);
		}
	}

	componentWillReceiveProps(nextProps: ControlArrayProps, nextContext: any) {
		const nextName = BaseControl.constructName(nextContext._ReactiveMobxFormFieldNamePrefix, nextProps.name);

		if (this.name !== nextName) {
			this.field.update(nextName);
			this.name = nextName;
			this.setState({}); // component Rerender -> gerChildContext -> contextUpdate
		}
	}

	render() {
		const propsToPass = omit(this.props, ControlArray.propNamesToOmitWhenByPass);

		const length =  this.fieldsProp.length; // todo: why we need this to rerender?

		return React.createElement((this.props.component as any), 
				Object.assign({}, { fields: this.proxiedFieldsProp }, propsToPass)
			);
	}
}