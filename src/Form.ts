import React, { Component, createElement } from 'react';
import { observable, action, computed, reaction, ObservableMap, isObservableMap } from 'mobx';
import * as Validator from 'validatorjs';


import { fieldDefinition, normalizesdFieldDefinition, formSchema, formField } from './interface';

import { Field } from './Field';
import { FieldArray } from "./FieldArray";
import { FieldSection } from "./FieldSection";
import { objectPath, isNumeric } from "./utils";

export class Form {
	formSchema: formSchema;

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

	/*static normalizeSchema(formSchema: formSchema): normalizedFormSchema {
		const normalized = {};

		Object.keys(formSchema).map(fieldName => {
			normalized[fieldName] = Field.normalizeFieldDefinition(formSchema[fieldName])
		});

		return normalized;
	}*/

	constructor(formSchema) {
		this.formSchema = formSchema;
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
		return this.fields.values().reduce((rules:any, field: formField) => {
			return Object.assign(rules, field.rules)
		}, {});
	}

	@action registerField(field: formField): void {
		const fieldPath = objectPath(field.name);

		// this is a root field in a form, just register field by addign it to map
		if (fieldPath.length === 1) {
			this.fields.set(field.name, field);
		}
		else {
			// the field is inside of hierarchy, find its parent and call parents register function

			let parentField: FieldArray | FieldSection;

			try {
				parentField = this.findFieldInHierarchy(fieldPath.slice(0, fieldPath.length - 1));
				parentField.registerField(field);
			}
			catch (e) {
				console.log(`Field ${field.name} can't be registred. Check name hierarchy.` , e)
			}
		}
	}

	@action removeField(fieldName: string) {
		this.fields.delete(fieldName);

		// todo: handle delete also nested fields
	}

	@action reset() {
		this.fields.forEach((field: formField)=> {
			field.reset();
		});
	}

	findFieldInHierarchy(path) {
		return path.reduce((f, node, idx) => (idx === 0 ? f.get(node) : f.subFields.get(node)), this.fields);
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