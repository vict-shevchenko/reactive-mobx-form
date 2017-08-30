import * as React from 'react';
import * as PropTypes from 'prop-types';
import { observer, Observer } from 'mobx-react';
import { Form } from '../Form';
import { Field } from '../Field'

import { fieldDefinition, normalizesdFieldDefinition, normalizedFormSchema } from '../interface'
import { FieldSection } from "../FieldSection";
import { omit } from "../utils";
import BaseControl from "./BaseControl";

interface ControlSectionProps {
	name: string;
	component: React.Component<any, any> | React.SFC<any> | string;
}

@observer
export class ControlSection extends BaseControl<ControlSectionProps, any> {
	name : string;
	form : Form;
	field: FieldSection;

	// todo: should be possible to use with children
	static requiredProps: Array<string> = ['component', 'name'];
	static propNamesToOmitWhenByPass: Array<string> = ['component', 'rules'];

	static contextTypes = {
		_ReactiveMobxForm: PropTypes.object.isRequired,
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string
	}

	static childContextTypes = {
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string.isRequired,
	}

	constructor(props, context) {
		super(props, context, ControlSection.requiredProps);
	}

	getChildContext() {
		return {
			_ReactiveMobxFormFieldNamePrefix: this.name
		};
	}


	componentWillMount() {
		// As ControlSection is an aggregation unit it should not present in schema
		if (this.form.formSchema[this.name]) {
			throw (new Error(`Control Section with name ${this.name} should not be in schema`));
		}

		this.field = new FieldSection(this.name)
		this.form.registerField(this.field);
	}

	componentWillUnmount() {
		if (!this.field.autoRemove) {
			this.field.setAutoRemove();
			this.form.removeField(this.name);
		}
	}

	componentWillReceiveProps(nextProps: ControlSectionProps, nextContext:any) {
		const name = BaseControl.constructName(nextContext._ReactiveMobxFormFieldNamePrefix, nextProps.name);

		if (this.name !== name) {
			this.name = name;
			this.field.update(name);
		}
	}

	render() {
		const propsToPass = omit(this.props, ControlSection.propNamesToOmitWhenByPass);
		return React.createElement((this.props.component as any), Object.assign({}, { fields: this.field.subFields }, propsToPass));
	}
}