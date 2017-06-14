import React, { Component, createElement } from 'react';
import { observable, action, computed, reaction, ObservableMap } from 'mobx';
import * as Validator from 'validatorjs';


import { fieldDefinition, normalizesdFieldDefinition, formSchema, normalizedFormSchema, formField } from './interface';

import { Field } from './Field';
import { FieldArray } from "./FieldArray";
import { FieldSection } from "./FieldSection";

export class Form {
	formSchema: normalizedFormSchema;

	component: any;

	@observable fields: ObservableMap<{}> = observable.map();
	@observable errors: Validator.Errors; // todo: initial value
	@observable isValid: boolean | void; // todo: initial value

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

	static normalizeSchema(formSchema: formSchema): normalizedFormSchema {
		const normalized = {};

		Object.keys(formSchema).map(fieldName => {
			normalized[fieldName] = Field.normalizeFieldDefinition(formSchema[fieldName])
		});

		return normalized;
	}

	constructor(formSchema) {
		this.formSchema = Form.normalizeSchema(formSchema);
	}

	@computed get isDirty() { // todo: should be implementede for ControlArray
		return this.fields.values().some((field:formField) => field.isDirty);
	}

	// todo: on for initialize values are recomputed -> this cause validation to recompute, may be inefficient
	@computed get validation() {
		return new Validator(this.values, this.rules);
	}

	// todo: values are recomputed each time field is registered, think if this is good begavior for form initialization
	@computed get values() {
		//return this.fields.entries().map(entry => ({ [entry[0]]: entry[1].value })).reduce((val, entry) => Object.assign(val, entry), {});
		return this.fields.entries().reduce((values:any, entry:[string, formField]) => Object.assign(values, { [entry[0]]: entry[1].value }), {});
	}

	@computed get rules() { // todo: check if rule is computed on new field add
		return Object.keys(this.formSchema).reduce((rules: any, fieldName) => {
			const rule = this.formSchema[fieldName][1];
			return Object.assign(rules, rule ? { [fieldName]: rule } : {});
		}, {});
	}

	// todo: may be use transaction to make values recompute once
	@action registerField(fieldName: string, isArrayField?: boolean, isSectionField?: boolean) { // todo: remove this shit coding
		const [FieldArrayName, ...rest]: Array<string> = fieldName.replace(/\[([0-9]*)\]/g, '.$1.').split('.');

		if (rest[rest.length - 1] === '') {
			rest.pop();
		}

		const isNestedField: boolean = rest.length > 0;

		if (isNestedField) {
			// todo: verify field not found if name was iccorectly provided like [Object object]
			const parentField: FieldArray | FieldSection = this.fields.get(FieldArrayName) as FieldArray | FieldSection;

			return parentField.registerField(rest.join('.'), this.formSchema[fieldName], isArrayField)
		}



		if (!this.fields.get(fieldName)) {
			this.fields.set(fieldName, isArrayField ? new FieldArray(fieldName) : isSectionField ? new FieldSection(fieldName) : new Field(fieldName, this.formSchema[fieldName]))
		}

		return this.fields.get(fieldName);
	}

	@action removeField(fieldName: string) {
		this.fields.delete(fieldName);

		// todo: delete field from schema also ????
	}

	@action extendSchema(schemaExtension: formSchema) {
		// todo: Probably ist good to have some safe extension
		const normalizeSchemaExtension = Form.normalizeSchema(schemaExtension);

		Object.assign(this.formSchema, normalizeSchemaExtension);
	}

	@action reset() {
		this.fields.forEach((field: formField)=> {
			field.reset();
		});
	}

	registerValidation() {
		reaction(
			() => this.validation,
			() => {
				this.isValid = this.validation.passes();
				this.errors = this.validation.errors;
			}
		)
	}
}