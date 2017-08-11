import React, { Component, createElement } from 'react';
import { observable, action, computed, reaction, ObservableMap, isObservableMap } from 'mobx';
import * as Validator from 'validatorjs';


import { fieldDefinition, normalizesdFieldDefinition, formSchema, formField, IFormValues } from './interface';

import { Field } from './Field';
import { FieldArray } from "./FieldArray";
import { FieldSection } from "./FieldSection";
import { objectPath, isNumeric } from "./utils";

export class Form {
	formSchema: formSchema;

	component: any;

	mounted: boolean = false;

	@observable fields = new ObservableMap<formField>();
	@observable errors : Validator.Errors; // todo: initial value
	@observable isValid: boolean | void; // todo: initial value

	@observable submitting: boolean = false;
	@observable validating: boolean = false;
	@observable submitError: any;

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
		return this.fields.values().some(field => field.isDirty);
	}

	// todo: on for initialize values are recomputed -> this cause validation to recompute, may be inefficient
	@computed get validation() {
		return new Validator(this.values, this.rules);
	}

	// todo: values are recomputed each time field is registered, think if this is good begavior for form initialization
	@computed get values() {
		//return this.fields.entries().map(entry => ({ [entry[0]]: entry[1].value })).reduce((val, entry) => Object.assign(val, entry), {});
		return this.fields.entries().reduce((values: IFormValues, [name, field]) => (values[name] = field.value, values), {});
	}

	@computed get rules() { // todo: check if rule is computed on new field add
		return this.fields.values().reduce((rules:any, field) => Object.assign(rules, field.rules), {});
	}

	@action registerField(field: formField): void {
		const fieldPath = objectPath(field.name);

		try {
			const existField  = this.findFieldInHierarchy(fieldPath);
			const parentField = this.findFieldInHierarchy(fieldPath.slice(0, fieldPath.length - 1));

			if (existField) {
				throw (new Error(`Field with name ${(existField as formField).name} already exist in Form. `));
			}
			else {
				(parentField as FieldArray | FieldSection | Form).addField(field);
			}

		}
		catch (e) {
			console.log(`Field ${field.name} can't be registred. Check name hierarchy.`, e)
		}
	}

	@action addField(field: formField) {
		this.fields.set(field.name, field);
	}

	@action removeField(fieldName: string) {
		const fieldPath: Array<string> = objectPath(fieldName);


		if (fieldPath.length === 1) { // this is form.fields first child
			(this.fields.get(fieldName) as formField).setAutoRemove();
			this.fields.delete(fieldName);
		}
		else { // this is some nested field
			const lastIndex  : number = fieldPath.length - 1;
			const lastNode   : string = fieldPath[lastIndex];
			const parentField         = this.findFieldInHierarchy(fieldPath.slice(0, lastIndex));

			// in React ComponentWillUnmount is fired from parent to child, so if no parent exist -> it was already unmounted.
			// No need to clean-up children
			if (parentField) {
				(parentField as FieldArray | FieldSection).removeSubField(lastNode);
			}
		}
	}

	@action reset() {
		this.fields.forEach(field => field.reset());
	}

	getField(index:string): formField {
		return (this.fields as ObservableMap<formField>).get(index);
	}

	findFieldInHierarchy(path: Array<string>) : Form | formField {
		// todo: f ? f.getField(node) : f - is super stupid check for parent was removed, just pass udefined for all suc childrens
		return path.reduce((f: Form | FieldArray | FieldSection, node:string) => f ? f.getField(node) : f, this);
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