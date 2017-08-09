import React, { Component, createElement } from 'react';
import { observable, action, computed, autorun, isObservableArray, ObservableMap } from 'mobx';
import * as Validator from 'validatorjs';

import { fieldValue, fieldDefinition, normalizesdFieldDefinition, formField } from './interface';
import { Form } from "./Form";
import { Field } from "./Field";
import { FieldArray } from './FieldArray';
import { objectPath } from "./utils";


export class FieldSection {
	name: string;
	autoRemove: boolean = false;
	// readonly _isFieldSection: boolean = true;

	@observable subFields: ObservableMap<{}> = observable.map(); // todo: does not look good
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
		this.subFields.values().forEach((field:formField) => field.reset());
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
		return this.subFields.entries().reduce((values:any, entry:[string, formField]) => Object.assign(values, { [entry[0]]: entry[1].value }), {});
	}

	@computed get rules() {
		return this.subFields.values().reduce((rules:any, field: formField) => Object.assign(rules, field.rules), {});
	}

	// todo: fix this
	@computed get isDirty() {
		return true;
	}
}
