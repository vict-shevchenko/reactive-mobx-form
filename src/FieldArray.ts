import React, { Component, createElement } from 'react';
import { observable, action, computed, autorun, isObservableArray, ObservableMap, isObservableMap } from 'mobx';
import * as Validator from 'validatorjs';

import { fieldValue, fieldDefinition, normalizesdFieldDefinition, formField } from './interface';
import { Form } from "./Form";
import { Field } from "./Field";
import { objectPath, isNumeric } from "./utils";


export class FieldArray {
	readonly name: string;
	readonly _rules: string;
	// readonly _isFieldArray: boolean = true;

	@observable subFields: ObservableMap<{}> = observable.map();
	@observable errors: Array<string> = [];

	constructor(name: string, fieldDefinition: normalizesdFieldDefinition) {
		this.name = name;
		this._rules = fieldDefinition[1];
	}

	@action registerField(field: formField) {
		const fieldPath = objectPath(field.name);
		const lastPathNode = fieldPath[fieldPath.length - 1];

		if (isNumeric(lastPathNode)) {
			this.subFields.set(lastPathNode, field);
		}
		else {
			const preLastPathNode = fieldPath[fieldPath.length - 2];

			if (!this.subFields.get(preLastPathNode)) {
				this.subFields.set(preLastPathNode, observable.map());
			}

			(this.subFields.get(preLastPathNode) as ObservableMap<{}>).set(lastPathNode, field);
		}
	}

	@action reset() {
		this.subFields.clear();
	}

	// we need some normal solution here, as pushing empty map to -> render Controls in View -> replace empty map with FieldSection
	push() {
		this.subFields.set((this.subFields.size).toString(), observable.map())
	}

	@computed get value() {
		return this.subFields.values().map((subField: formField | ObservableMap<formField>) => {

			if (isObservableMap(subField)) {
				return (subField as ObservableMap<formField>).entries()
					.reduce((val, [fieldName, field]: [string, formField]) => Object.assign(val, { [fieldName]: field.value }), {});
			}
			else {
				return (subField as formField).value;
			}
		});
	}

	@computed get rules() {
		return this.subFields.values().reduce((rules, subField: formField | ObservableMap<formField>) => {

			if (isObservableMap(subField)) {
				return (subField as ObservableMap<formField>).values()
					.reduce((rul, field: formField) => Object.assign(rul, field.rules ), rules);
			}
			else {
				return Object.assign(rules, subField.rules )
			}
		}, { [this.name]: this._rules })
	}

	// todo: fix this
	@computed get isDirty() {
		return true;
	}
}
