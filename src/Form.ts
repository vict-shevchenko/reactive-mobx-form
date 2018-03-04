import React, { Component, createElement } from 'react';
import { observable, action, computed, reaction, ObservableMap, isObservableMap } from 'mobx';
import * as Validator from 'validatorjs';
import { IFieldDefinition, IFormSchema, IFormErrorMessages, IFormAttributeNames } from './interfaces/Form';
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

	// todo: values are recomputed each time field is registered, think if this is good behavior for form initialization
	@computed get values() {
		// return this.fields.entries().map(entry =>
		// ({ [entry[0]]: entry[1].value })).reduce((val, entry) => Object.assign(val, entry), {});
		return this.fields.entries().reduce((values, [name, field]) => (values[name] = field.value, values), {});
	}

	@computed get rules(): {[propName: string]: string} { // todo: check if rule is computed on new field add
		return this.fields.values().reduce((rules, field) => Object.assign(rules, field.rules), {});
	}

	@action public reset() {
		this.fields.forEach(field => field.reset());
	}

	@action public setTouched() {
		this.fields.forEach(field => field.setTouched());
	}

	@action public registerField(field: formField): void {
		const fieldPath = objectPath(field.name);

		try {
			const existField  = this.getField(fieldPath);
			const fieldParent = this.getFieldParent(fieldPath);

			if (existField) {
				throw (new Error(`Field with name ${(existField as formField).name} already exist in Form. `));
			}
			else {
				(fieldParent as FieldArray | FieldSection | Form).addField(field);
			}

		}
		catch (e) {
			console.warn(`Field ${field.name} can't be registered. Check name hierarchy.`, e); // tslint:disable-line
		}
	}

	// in React ComponentWillUnmount is fired from parent to child, so if no parent exist -> it was already unmounted.
	// No need to clean-up children
	@action public unregisterField(fieldName: string) {
		const fieldPath   = objectPath(fieldName),
		      lastIndex   = fieldPath.length - 1,
		      lastNode    = fieldPath[lastIndex],
		      fieldParent = this.getFieldParent(fieldPath);

		if (fieldParent) {
			(fieldParent as Form | FieldArray | FieldSection).removeField(lastNode);
		}
		else {
			console.log('Attempt to remove field on already removed parent field', fieldName) // tslint:disable-line
		}
	}

	@action public addField(field: formField): void {
		this.fields.set(field.name, field);
	}

	@action public removeField(fieldName: string): void {
		(this.fields.get(fieldName) as formField).setAutoRemove();
		this.fields.delete(fieldName);
	}

	public selectField(fieldName: string): formField {
		return this.fields.get(fieldName);
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

	public extendConfiguration(schema: IFormSchema = {}, errorMsg: IFormErrorMessages, attributeNames: IFormAttributeNames): void { // tslint:disable-line
		Object.assign(this.formSchema, schema);
		this.errorMessages ? Object.assign(this.errorMessages, errorMsg) : this.errorMessages = errorMsg;
		this.attributeNames ? Object.assign(this.attributeNames, attributeNames) : this.attributeNames = attributeNames;
	}

	public getField(fieldPath: string | string[]): formField {
		try {
			return this.findFieldInHierarchy(Array.isArray(fieldPath) ? fieldPath : objectPath(fieldPath));
		}
		catch (e) {
			console.warn(`Field can't be selected. Check name hierarchy. Probably some field on the chain does not exist`, e); // tslint:disable-line
		}
	}

	private getFieldParent(path: string[]): Form | FieldArray | FieldSection {
		return path.length === 1 ? this : (this.getField(path.slice(0, path.length - 1)) as FieldArray | FieldSection);
	}

	private findFieldInHierarchy(path: string[]): formField {
		// f is Form initially, and formField after, can`t handle type error
		return path.reduce((f: any, node) => (f as Form | FieldArray | FieldSection).selectField(node), this);
	}
}
