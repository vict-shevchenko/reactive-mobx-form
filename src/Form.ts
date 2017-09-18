import React, { Component, createElement } from 'react';
import { observable, action, computed, reaction, ObservableMap, isObservableMap } from 'mobx';
import * as Validator from 'validatorjs';
import { IFieldDefinition, IFormSchema, IFormErrorMessages, IFormAttributeNames } from '../interfaces/Form';
import { formField } from './types';
import { Field } from './Field';
import { FieldArray } from './FieldArray';
import { FieldSection } from './FieldSection';
import { objectPath, isNumeric } from './utils';

export class Form {
	public component: any;

	@observable public fields = new ObservableMap<formField>();
	@observable public errors: Validator.Errors; // todo: initial value
	@observable public isValid: boolean | void; // todo: initial value

	@observable public submitting: boolean = false;
	@observable public validating: boolean = false;
	@observable public submitError: any;

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

	constructor(
		public formSchema: IFormSchema,
		private errorMessages: IFormErrorMessages,
		private attributeNames: IFormAttributeNames) {
	}

	@computed get isDirty(): boolean {
		return this.fields.values().some(field => field.isDirty);
	}

	// todo: on for initialize values are recomputed -> this cause validation to recompute, may be inefficient
	@computed get validation() {
		return new Validator(this.values, this.rules, this.errorMessages);
	}

	// todo: values are recomputed each time field is registered, think if this is good begavior for form initialization
	@computed get values() {
		// return this.fields.entries().map(entry =>
		// ({ [entry[0]]: entry[1].value })).reduce((val, entry) => Object.assign(val, entry), {});
		return this.fields.entries().reduce((values, [name, field]) => (values[name] = field.value, values), {});
	}

	@computed get rules(): {[propName: string]: string} { // todo: check if rule is computed on new field add
		return this.fields.values().reduce((rules, field) => Object.assign(rules, field.rules), {});
	}

	@action public registerField(field: formField): void {
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
			console.log(`Field ${field.name} can't be registred. Check name hierarchy.`, e); // tslint:disable-line
		}
	}

	@action public addField(field: formField): void {
		this.fields.set(field.name, field);
	}

	@action public removeField(fieldName: string) {
		const fieldPath = objectPath(fieldName);

		if (fieldPath.length === 1) { // this is form.fields first child
			(this.fields.get(fieldName) as formField).setAutoRemove();
			this.fields.delete(fieldName);
		}
		else { /* tslint:disable: indent */ // this is some nested field
			const lastIndex   = fieldPath.length - 1,
			      lastNode    = fieldPath[lastIndex],
			      parentField = this.findFieldInHierarchy(fieldPath.slice(0, lastIndex));
			/* tslint:enable: indent */
			// in React ComponentWillUnmount is fired from parent to child, so if no parent exist -> it was already unmounted.
			// No need to clean-up children
			if (parentField) {
				(parentField as FieldArray | FieldSection).removeSubField(lastNode);
			}
		}
	}

	@action public reset() {
		this.fields.forEach(field => field.reset());
	}

	public getField(index: string): formField {
		return (this.fields as ObservableMap<formField>).get(index);
	}

	public findFieldInHierarchy(path: string[]): Form | formField {
		// todo: f ? f.getField(node) : f - is super stupid check for parent was removed,
		// just pass udefined for all suc childrens
		return path.reduce((f: Form | FieldArray | FieldSection, node) => f ? f.getField(node) : f, this);
	}

	public registerValidation() {
		reaction(
			() => this.validation,
			() => {
				if (this.attributeNames) {
					this.validation.setAttributeNames(this.attributeNames);
				}
				this.isValid = this.validation.passes();
				this.errors = this.validation.errors;
			}
		);
	}
}
