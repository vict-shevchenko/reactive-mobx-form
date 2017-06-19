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
		return this.fields.values().some((field: formField) => field.isDirty);
	}

	// todo: on for initialize values are recomputed -> this cause validation to recompute, may be inefficient
	@computed get validation() {
		return new Validator(this.values, this.rules);
	}

	// todo: values are recomputed each time field is registered, think if this is good begavior for form initialization
	@computed get values() {
		//return this.fields.entries().map(entry => ({ [entry[0]]: entry[1].value })).reduce((val, entry) => Object.assign(val, entry), {});
		return this.fields.entries().reduce((values: any, entry: [string, formField]) => Object.assign(values, { [entry[0]]: entry[1].value }), {});
	}

	@computed get rules() { // todo: check if rule is computed on new field add
		return this.fields.values().reduce((rules: any, field: formField) => {
			return Object.assign(rules, field.rules)
		}, {});
	}

	@action registerField(field: formField): void {
		const fieldPath = objectPath(field.name);

		try {
			const existField: formField = this.findFieldInHierarchy(fieldPath);
			const parentField: FieldArray | FieldSection | ObservableMap<formField> = this.findFieldInHierarchy(fieldPath.slice(0, fieldPath.length - 1));

			// we need to additinally check for not be observable, because in fieldArray push method just puts empty observable into map
			if (existField && !isObservableMap(existField)) {
				throw(new Error(`Field with name ${existField.name} already exist in Form. `));
			}
			else {
				if (isObservableMap(parentField)) {
					parentField.set(field.name, field)
				} else {
					parentField.registerField(field);
				}
			}
			
		}
		catch (e) {
			console.log(`Field ${field.name} can't be registred. Check name hierarchy.`, e)
		}
		
	}

	@action removeField(fieldName: string) {
		const fieldPath = objectPath(fieldName);
		const lastNode = fieldPath[fieldPath.length - 1];
		const parentField: FieldArray | FieldSection | ObservableMap<formField> = this.findFieldInHierarchy(fieldPath.slice(0, fieldPath.length - 1));

		if (isObservableMap(parentField)) {
			parentField.delete(lastNode); 
		} else {
			parentField.subFields.delete(lastNode);
		}
	}

	@action reset() {
		this.fields.forEach((field: formField) => {
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