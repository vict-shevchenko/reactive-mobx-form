import React, { Component, createElement } from 'react';
import { observable, action, computed, autorun, isObservableArray, ObservableMap } from 'mobx';

import { Form } from './Form';
import { Field } from './Field';
import { objectPath } from './utils';

import { fieldValue, IFieldDefinition, INormalizesdFieldDefinition, IFormValues } from '../interfaces/Form';
import { formField } from './types';


export class FieldSection {
	name: string;
	autoRemove: boolean = false;
	// readonly _isFieldSection: boolean = true;

	@observable subFields = new ObservableMap<formField>(); // todo: does not look good
	// @observable errors: Array<string> = [];

	constructor(name: string) {
		this.update(name);
	}

	update(name: string) {
		this.name = name;
	}

	@action addField(field: formField) {

		// todo: looks like this is not a good solution to copy this part of code 
		const fieldPath = objectPath(field.name);
		const lastPathNode = fieldPath[fieldPath.length - 1];
		
		this.subFields.set(lastPathNode, field);
	}

	@action reset() {
		this.subFields.values().forEach((field) => field.reset());
	}

	@action removeSubField(index) {
		this.subFields.delete(index);
	}

	getField(index:string): formField {
		return (this.subFields as ObservableMap<formField>).get(index);
	}

	setAutoRemove() {
		this.autoRemove = true;
		this.subFields.values().forEach((subField: formField) => subField.setAutoRemove())
	}

	@computed get value() {
		return this.subFields.entries().reduce((values: IFormValues, [name, field]) => (values[name] = field.value, values), {});
	}

	@computed get rules() {
		return this.subFields.values().reduce((rules:any, field: formField) => Object.assign(rules, field.rules), {});
	}

	@computed get isDirty() {
		return this.subFields.values().some(subField => subField.isDirty)
	}
}
