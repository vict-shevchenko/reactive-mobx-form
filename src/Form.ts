import React, { Component, createElement } from 'react';
import { observable, action, computed, reaction } from 'mobx';
import * as Validator from 'validatorjs';


import { fieldDefinition, normalizesdFieldDefinition, formSchema, normalizedFormSchema } from './interface';

import { ReactiveMobxFormField } from './Field';

export class ReactiveMobxForm {
	formSchema: normalizedFormSchema;
	rules: {[propType: string]: string} = {};
	
	component: any;

	@observable fields: Array<ReactiveMobxFormField> = [];
	@observable errors: Validator.Errors;
	@observable isValid: boolean | void;

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

	// todo: on for initialize values are recomputed -> this cause validation to recompute, may be inefficient
	@computed get validation() {
		return new Validator(this.values, this.rules);
	}

	// todo: values are recomputed each time field is registered, think if this is good begavior for form initialization
	@computed get values() {
		const dict = {};

		this.fields.forEach(field => {
			dict[field.name] = field.value;
		})

		return dict;
	}

	// todo: may be use transaction to make values recompute once
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
		// todo: delete field from schema also ????
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

	registerValidation() {
		// todo: rules should be computed, to handle dynamic field add/remove
		Object.keys(this.formSchema).forEach((fieldName) => {
			if (this.formSchema[fieldName][1]) {
				this.rules[fieldName] = this.formSchema[fieldName][1];
			}
		})

		reaction(
			() => this.validation,
			() => {
				this.isValid = this.validation.passes();
				this.errors = this.validation.errors;
			}
		)
	}
}