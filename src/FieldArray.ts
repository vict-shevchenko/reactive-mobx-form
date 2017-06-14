import React, { Component, createElement } from 'react';
import { observable, action, computed, autorun, isObservableArray, ObservableMap } from 'mobx';
import * as Validator from 'validatorjs';

import { fieldValue, fieldDefinition, normalizesdFieldDefinition } from './interface';
import { Form } from "./Form";
import { Field } from "./Field";


export class FieldArray {
	initialValue: Array<fieldValue> = [];

	readonly name: string;
	readonly _isFieldArray: boolean = true;

	@observable subFields: Array<Field | Array<Field>> = [];
	@observable subFieldNames: Array<string> = []; // todo: strange as array is not obervable to its lenght change
	//@observable value: any = '';
	@observable errors: Array<string> = [];

	constructor(name: string) {
		this.name = name;
	}

	@action registerField(fieldName: string, fieldDefinition: normalizesdFieldDefinition, isArrayField?: boolean) {
		const match = fieldName.match(/^[0-9]*/); //we have 0, just index

		if (match[0] === fieldName) {  // we have a deal with array of one field
			const index = parseInt(fieldName, 10);
			this.subFields[index] = new Field(`${this.name}[${fieldName}]`, fieldDefinition);
			return this.subFields[index];
		}

		else { // we have a deal with array of group of fields
			const [index, ...rest] = fieldName.split('.');

			if (!this.subFields[index]) {
				this.subFields[index] = [];
			}

			if (rest.length > 1) {
				const parentFieldArray: FieldArray = this.subFields[index].find(field => field.name === rest[0]);

				if (parentFieldArray._isFieldArray) { // todo: may be we don`t need this;
					rest.shift();
					return parentFieldArray.registerField(rest.join('.'), fieldDefinition, isArrayField)
				}
			}

			this.subFields[index].push(isArrayField ? new FieldArray(rest.join('.')) : new Field(rest.join('.'), fieldDefinition))

			return this.subFields[index][this.subFields[index].length - 1];

		}
	}

	@action reset() {
		this.subFieldNames = [];
	}

	// TODO: debug behaviour of not reacting if using normal push
	push() {
		this.subFieldNames = [...this.subFieldNames, (`${this.name}[${this.subFields.length}]`)];
	}

	@computed get value() {
		return this.subFields.map((subField: Field | FieldArray | Array<Field | FieldArray>) => {
			if (isObservableArray(subField)) {
				return (subField as Array<Field | FieldArray>).reduce((val, field) => Object.assign(val, { [field.name]: field.value }), {});
			}
			else {
				return (subField as Field | FieldArray).value;
			}
		});
	}

	// todo: fix this
	@computed get isDirty() {
		return true;
	}
}
