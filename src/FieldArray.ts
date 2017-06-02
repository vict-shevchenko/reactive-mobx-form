import React, { Component, createElement } from 'react';
import { observable, action, computed, autorun } from 'mobx';
import * as Validator from 'validatorjs';

import { fieldValue, fieldDefinition, normalizesdFieldDefinition } from './interface';
import { Form } from "./Form";
import { Field } from "./Field";


export class FieldArray {
	initialValue: Array<fieldValue> = [];

	readonly name: string;

	@observable fields: Array<Field> = [];
	//@observable value: any = '';
	@observable errors: Array<string> = [];
	
	constructor(name:string) {
		this.name = name;
	}

	@computed get value() {
		return 'value';
	}

	@computed get isDirty() {
		return true;
	}
}
