import React, { Component, createElement } from 'react';
import { observable, action, computed } from 'mobx';
import * as Validator from 'validatorjs';

import { fieldDefinition, normalizesdFieldDefinition, formSchema, normalizedFormSchema } from './interface';

import { ReactiveMobxFormField } from './Field';

export class ReactiveMobxForm {
	formSchema: normalizedFormSchema;

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

	static normalizeSchema(formSchema:formSchema):normalizedFormSchema {
		const normalized = {};

		Object.keys(formSchema).map(fieldName => {
			normalized[fieldName] = ReactiveMobxFormField.normalizeFieldDefinition(formSchema[fieldName])
		});

		return normalized;
	}
	 

	constructor(formSchema) {
		this.formSchema = ReactiveMobxForm.normalizeSchema(formSchema);
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

	@action registerField(fieldName:string) {
		let field = this.fields.find(field => field.name === fieldName);

		if (!field) {
			this.fields.push(new ReactiveMobxFormField(fieldName, this.formSchema[fieldName]));
			field = this.fields[this.fields.length - 1];
		}

		return field;
	}

	@action removeField(fieldName:string) {
		const fieldIdx = this.fields.findIndex(field => field.name === fieldName);

		this.fields.splice(fieldIdx, 1);
	}

	@action extendSchema(schemaExtension:formSchema) {
		// todo: Probably ist good to have some safe extension
		const normalizeSchemaExtension = ReactiveMobxForm.normalizeSchema(schemaExtension);
		
		Object.assign(this.formSchema, normalizeSchemaExtension);
	}

	@action reset() {
		this.fields.forEach(field => {
			field.value = field.initialValue;
		})
	}
}