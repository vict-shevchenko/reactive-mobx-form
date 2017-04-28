import React, { Component, createElement, PropTypes } from 'react';
import { observable, action, computed } from 'mobx';
import { inject } from 'mobx-react';


type fieldValue = string | number | boolean;
type fieldDefinition = (fieldValue) | [fieldValue] | [(fieldValue), string];

interface fiedsSchema {
	[propType: string]: fieldDefinition
}

export function mobxReactiveForm(formName: string, fields:fiedsSchema) {
	var form = new MobxReactiveForm(fields);

	return wrappedForm => {
		@inject('formStore')
		class MobxReactiveForm extends Component<{formStore: any}, any> {
			static childContextTypes = {
				_mobxReactiveForm: PropTypes.object.isRequired
			}

			getChildContext() {
				return {_mobxReactiveForm: form};
			}

			componentWillMount() {
				this.props.formStore.registerForm(formName, form);
			}

			render() {
				return createElement(wrappedForm, {});
			}
		}

		return MobxReactiveForm;
	}
}



export class MobxReactiveForm {
	fieldsSchema: fiedsSchema;
	@observable fields: Array<MobxReactiveFormField> = [];
	@observable submitting: boolean = false;
	@observable validating: boolean = false;

	// computed
	/*
	hasErrors
	isValid
	isDirty
	isPristine
	isDefault
	isEmpty
	isFocused
	isToucehd
	isChanged
	error
	*/
	 

	constructor(fieldsSchema) {
		this.fieldsSchema = fieldsSchema;

		Object.keys(fieldsSchema).map((fieldName:string) => {
			this.fields.push(new MobxReactiveFormField(fieldName, fieldsSchema[fieldName]))
		})
	}

	@computed get isDirty() {
		return this.fields.some(field => field.isDirty);
	}
}

export class MobxReactiveFormField {
	readonly name: string;
	readonly initialValue: fieldValue= '';
	readonly rules: string;

	type: string;

	@observable value: fieldValue = '';
	@observable isFocused: boolean = false;
	@observable isTouched: boolean = false;
	
	constructor(name:string, fieldDefinition: fieldDefinition ) {
		const definitionIsArray: boolean = Array.isArray(fieldDefinition);
		const initialValue = definitionIsArray ? fieldDefinition[0] : '' 

		this.name = name;
		this.initialValue = initialValue;
		this.value = initialValue;
		this.rules = (definitionIsArray && fieldDefinition[1]) ? fieldDefinition[1] : '';
	}

	@action onFocus() {
		this.isFocused = true;
		if(!this.isTouched) {
			this.isTouched = true;
		}
	}

	@action onBlur() {
		this.isFocused = false;
	}

	@action onChange(value:fieldValue) {
		this.value = value;
	}

	@computed get isDirty() {
		return this.value !== this.initialValue;
	}

	@computed get isValid() {
		return true;
	}
}
