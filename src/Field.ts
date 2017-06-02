import React, { Component, createElement } from 'react';
import { observable, action, computed, autorun } from 'mobx';
import * as Validator from 'validatorjs';

import { fieldValue, fieldDefinition, normalizesdFieldDefinition } from './interface';
import { Form } from "./Form";

// todo: may be removed
function hasErrorArraysChanged(oldErrors:Array<string>, newErrors:Array<string>):boolean {
	if (oldErrors.length !== newErrors.length) {
		return true
	}
	else if (oldErrors.length === newErrors.length && newErrors.length > 0) {
		for(let i = 0; i < newErrors.length; i++) {
			if (oldErrors[i] !== newErrors[i]) {
				return true;
			}
		}
	}

	return false;
}

export class Field {

	readonly name: string;
	readonly initialValue: fieldValue = '';
	readonly rules: string = '';

	type: string;

	@observable value: fieldValue = '';
	@observable errors: Array<string> = [];
	@observable isFocused: boolean = false;
	@observable isTouched: boolean = false;

	static normalizeFieldDefinition(fieldDefinition: fieldDefinition): normalizesdFieldDefinition {
		if (Array.isArray(fieldDefinition)) {
				return (fieldDefinition.length == 2) ? (fieldDefinition as [fieldValue, string])  : [fieldDefinition[0], ''];
		}
	
		return [fieldDefinition, ''];
	}
	
	constructor(name:string, fieldDefinition: normalizesdFieldDefinition) {
		this.name = name;
		this.initialValue = fieldDefinition[0];
		this.value = this.initialValue;
		this.rules = fieldDefinition[1];
	}

	@computed get isDirty() {
		return this.value !== this.initialValue;
	}

	@computed get isValid() {
		return this.errors.length === 0;
	}

	@action onFocus() {
		this.isFocused = true;
		if(!this.isTouched) {
			this.isTouched = true;
		}
	}

	@action onBlur() {
		this.isFocused = false;
	}

	@action onChange(value:fieldValue) {
		this.value = value;
	}

	subscribeToFormValidation(form: Form) {
		autorun(() => {
			const errors: Array<string> = form.errors.get(this.name);
			
			// todo: use .join here?
			// if (hasErrorArraysChanged(this.errors, errors)) {

			if (this.errors.join() !== errors.join()) {
				this.errors = errors;
			}
		})
	}
}
