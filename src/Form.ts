import React, { Component, createElement } from 'react';
import { observable, action, computed } from 'mobx';
import * as Validator from 'validatorjs';

import { fieldDefinition, fiedsSchema } from './interface';

import { ReactiveMobxFormField } from './Field';

export class ReactiveMobxForm {
	readonly fieldsSchema: fiedsSchema;

	component: any;

	@observable fields: Array<ReactiveMobxFormField> = [];
	@observable submitting: boolean = false;
	@observable validating: boolean = false;
	@observable submissionError: string = '';

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

	@computed get validation() {
		return new Validator(this.values, this.rules);
	}

	@computed get isValid() {
		return this.validation.passes();
	}

	@computed get values() {
		const dict = {};

		this.fields.forEach(field => {
			dict[field.name] = field.value;
		})

		return dict;
	}

	@computed get rules() {
		const dict = {};

		this.fields.forEach(field => {
			if(field.rules) {
				dict[field.name] = field.rules;
			}
		})

		return dict;
	}

	@action addField(fieldName:string, fieldDefinition: fieldDefinition) {
		this.fieldsSchema[fieldName] = fieldDefinition;
		return this.registerField(fieldName, fieldDefinition);
	}

	@action registerField(fieldName:string, fieldDefinition: fieldDefinition){
		this.fields.push(new ReactiveMobxFormField(fieldName, fieldDefinition));

		return this.fields[this.fields.length - 1];
	}

	@action removeField(fieldName:string) {
		const fieldIdx = this.fields.findIndex(field => field.name === fieldName);

		this.fields.splice(fieldIdx, 1);
	}

	@action reset() {
		this.fields.forEach(field => {
			field.value = field.initialValue;
		})
	}
}