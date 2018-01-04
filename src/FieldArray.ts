import React, { Component, createElement } from 'react';
import { observable, action, computed, autorun } from 'mobx';
import { fieldValue, IFieldDefinition, INormalizesdFieldDefinition } from './interfaces/Form';
import { formField } from './types';
import { objectPath, isNumeric } from './utils';

export class FieldArray {
	public name: string;
	public autoRemove: boolean = false;

	public subFields = observable<formField>([]);
	@observable public errors: string[] = [];

	constructor(name: string) {
		this.update(name);
	}

	public update(name: string): void {
		this.name = name;
	}

	@action public addField(field: formField): void {
		const fieldPath = objectPath(field.name);
		const lastPathNode = fieldPath[fieldPath.length - 1];

		// When lastPathNode is numeric this means that in FormArray we register a direct children on FormArray
		if (isNumeric(lastPathNode)) {
			this.subFields[parseInt(lastPathNode, 10)] = field;
		}
		// we registering a Field in childrend on FormArray, like Field in a FieldSection
		// todo: clarify when this condition fires
		else {
			const preLastPathNode = parseInt(fieldPath[fieldPath.length - 2], 10);

			if (!this.subFields[preLastPathNode]) {
				throw new Error(`Attempt to register field named "${lastPathNode}" without registring its parent first.
					Probably you should refactor your <Control name="[index]${lastPathNode}" /> into
					<ControlSection name={index} component={...}> and <Control name="${lastPathNode}" /> as component`);
			}

			this.subFields[preLastPathNode][lastPathNode] = field;
		}
	}

	@action public reset() {
		this.subFields.forEach(subField => subField.setAutoRemove());
		this.subFields.clear();
	}

	@action public removeSubField(index: string) {
		this.subFields.splice(parseInt(index, 10), 1);
	}

	public getField(index: string): formField | undefined {
		// Avoid mobx.js:1905 [mobx.array] Attempt to read an array index (0) that is out of bounds (0).
		// Please check length first. Out of bound indices will not be tracked by MobX
		return (this.subFields.length > parseInt(index, 10)) ? this.subFields[index] : undefined;
	}

	public setAutoRemove() {
		this.autoRemove = true;
		this.subFields.forEach(subField => subField.setAutoRemove());
	}

	@computed get realSubFields(): formField[] {
		// filter in order to avoid errors when subFields has a gap for item to be insetred
		return this.subFields.filter(subField => subField);
	}

	@computed get value() {
		return this.realSubFields.map(subField => subField.value);
	}

	@computed get rules() {
		return this.realSubFields.reduce((rules, subField) => Object.assign(rules, subField.rules), {});
	}

	@computed get isDirty(): boolean {
		return this.realSubFields.some(subField => subField.isDirty);
	}
}
