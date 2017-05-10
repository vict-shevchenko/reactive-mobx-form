import React, { Component, createElement, PropTypes } from 'react';
import { observable, action, computed } from 'mobx';
import { inject } from 'mobx-react';
import * as Validator from 'validatorjs';


type fieldValue = string | number | boolean;
type fieldDefinition = (fieldValue) | [fieldValue] | [(fieldValue), string];

interface fiedsSchema {
	[propType: string]: fieldDefinition
}

export function mobxReactiveForm(formName: string, fields:fiedsSchema) {
	var form = new MobxReactiveForm(fields); // for debugging/error handling purposes

	return wrappedForm => {
		form.component = wrappedForm;

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
	readonly fieldsSchema: fiedsSchema;

	component: any;

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
			this.registerField(fieldName, fieldsSchema[fieldName]);
		})
	}

	@computed get isDirty() {
		return this.fields.some(field => field.isDirty);
	}

	@action registerField(fieldName:string, fieldDefinition: fieldDefinition){
		this.fields.push(new MobxReactiveFormField(fieldName, fieldDefinition));

		return this.fields[this.fields.length - 1];
	}

	@action removeField(fieldName:string) {
		const fieldIdx = this.fields.findIndex(field => field.name === fieldName);

		this.fields.splice(fieldIdx, 1);
	}
}

export class MobxReactiveFormField {
	readonly name: string;
	readonly initialValue: fieldValue = '';
	readonly rules: string = '';

	type: string;

	@observable value: fieldValue = '';
	@observable isFocused: boolean = false;
	@observable isTouched: boolean = false;
	
	constructor(name:string, fieldDefinition: fieldDefinition ) {
		const definitionIsArray: boolean = Array.isArray(fieldDefinition);
		const initialValue = definitionIsArray ? fieldDefinition[0] : fieldDefinition;

		this.name = name;
		this.initialValue = initialValue;
		this.value = initialValue;
		this.rules = (definitionIsArray && fieldDefinition[1]) ? fieldDefinition[1] : '';
	}

	@computed get isCheckbox() {
		return this.type === 'checkbox';
	}

	@computed get isRadio() {
		return this.type === 'radio';
	}

	@computed get isCheckable() {
		return (this.isCheckbox || this.isRadio);
	}

	@computed get isDirty() {
		return this.value !== this.initialValue;
	}

	// todo: optimize this, not to run for fields that have no validation
	@computed get validation() {
		return new Validator({[this.name]:this.value}, this.rules ? {[this.name]:this.rules} : {});
	}

	//todo: optimize this, not to run for fields that have no validation
	@computed get isValid() {
		return this.validation.passes(); 
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
}
