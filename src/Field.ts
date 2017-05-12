import React, { Component, createElement } from 'react';
import { observable, action, computed } from 'mobx';
import * as Validator from 'validatorjs';

import { fieldValue, fieldDefinition, normalizesdFieldDefinition } from './interface';

export class ReactiveMobxFormField {
	readonly name: string;
	readonly initialValue: fieldValue = '';
	readonly rules: string = '';

	type: string;

	@observable value: fieldValue = '';
	@observable isFocused: boolean = false;
	@observable isTouched: boolean = false;

	static normalizeFieldDefinition(fieldDefinition: fieldDefinition): normalizesdFieldDefinition {
		if (Array.isArray(fieldDefinition)) {
				return (fieldDefinition.length == 2) ? (fieldDefinition as [fieldValue, string])  : [fieldDefinition[0], ''];
		}
	
		return [fieldDefinition, ''];
	}
	
	constructor(name:string, fieldDefinition: normalizesdFieldDefinition ) {
		this.name = name;
		this.initialValue = fieldDefinition[0];
		this.value = this.initialValue;
		this.rules = fieldDefinition[1];
	}

	@computed get isCheckbox() {
		return this.type === 'checkbox';
	}

	@computed get isRadio() {
		return this.type === 'radio';
	}

	@computed get isCheckable() {
		return (this.isCheckbox || this.isRadio);
	}

	@computed get isDirty() {
		return this.value !== this.initialValue;
	}

	// todo: optimize this, not to run for fields that have no validation
	@computed get validation() {
		return new Validator({[this.name]:this.value}, this.rules ? {[this.name]:this.rules} : {});
	}

	//todo: optimize this, not to run for fields that have no validation
	@computed get isValid() {
		return this.validation.passes(); 
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
}
