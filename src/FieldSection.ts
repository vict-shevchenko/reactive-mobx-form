import React, { Component, createElement } from 'react';
import { observable, action, computed, ObservableMap } from 'mobx';
import { fieldValue, IFormValues } from '../interfaces/Form';
import { formField } from './types';
import { objectPath } from './utils';

export class FieldSection {
	public name: string;
	public autoRemove: boolean = false;

	@observable public subFields = new ObservableMap<formField>();

	constructor(name: string) {
		this.update(name);
	}

	public update(name: string) {
		this.name = name;
	}

	@action public addField(field: formField) {

		// todo: looks like this is not a good solution to copy this part of code fron FieldArray
		const fieldPath = objectPath(field.name);
		const lastPathNode = fieldPath[fieldPath.length - 1];

		this.subFields.set(lastPathNode, field);
	}

	@action public reset() {
		this.subFields.values().forEach(subField => subField.reset());
	}

	@action public removeSubField(index: string) {
		this.subFields.delete(index);
	}

	public getField(index: string) {
		return (this.subFields as ObservableMap<formField>).get(index);
	}

	public setAutoRemove(): void {
		this.autoRemove = true;
		this.subFields.values().forEach(subField => subField.setAutoRemove());
	}

	@computed get value() {
		return this.subFields.entries().reduce((values, [name, field]) => (values[name] = field.value, values), {});
	}

	@computed get rules() {
		return this.subFields.values().reduce((rules, field) => Object.assign(rules, field.rules), {});
	}

	@computed get isDirty() {
		return this.subFields.values().some(subField => subField.isDirty);
	}
}
