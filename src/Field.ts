import React, { Component, createElement } from 'react';
import { observable, action, computed, autorun } from 'mobx';
import { fieldValue, INormalizesdFieldDefinition } from './interfaces/Form';
import { Form } from './Form';

export class Field {
	public autoRemove: boolean = false;
	private initialValue: fieldValue;

	/* tslint:disable: typedef-whitespace */
	@observable public name     : string; // name is updated on FieldArray remove item
	@observable public value    : fieldValue;
	@observable public errors   : string[] = [];
	@observable public isFocused: boolean  = false;
	@observable public isTouched: boolean  = false;

	@observable private _rules: string; // rules are updated on FieldArray remove item
	/* tslint:enable: typedef-whitespace */

	constructor(name: string, fieldDefinition: INormalizesdFieldDefinition) {
		this.update(name, fieldDefinition);
	}

	public update(name: string, fieldDefinition: INormalizesdFieldDefinition): void {
		this.name = name;
		this.initialValue = fieldDefinition[0];
		this.value = this.value || this.initialValue;
		this._rules = fieldDefinition[1];
	}

	@computed get isDirty(): boolean {
		return this.value !== this.initialValue;
	}

	@computed get isValid(): boolean {
		return this.errors.length === 0;
	}

	@computed get rules() {
		return this._rules ? { [this.name]: this._rules } : {};
	}

	@action public onFocus(): void  {
		this.isFocused = true;
		if (!this.isTouched) {
			this.isTouched = true;
		}
	}

	@action public onBlur(): void  {
		this.isFocused = false;
	}

	@action public onChange(value: fieldValue): void  {
		this.value = value;
	}

	@action public reset(): void  {
		this.value = this.initialValue;
		this.isTouched = false;
	}

	@action public setTouched() {
		this.isTouched = false;
	}

	public setAutoRemove(): void  {
		this.autoRemove = true;
	}

	public subscribeToFormValidation(form: Form): void {
		autorun(() => {
			const errors: string[] = form.errors.get(this.name);

			if (this.errors.join() !== errors.join()) {
				this.errors = errors;
			}
		});
	}
}
