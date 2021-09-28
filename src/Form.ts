import { observable, action, computed, reaction, IReactionDisposer, makeObservable } from 'mobx';
import { Errors, Validator as IValidator } from 'validatorjs';
import * as Validator from 'validatorjs';
// tslint:disable-next-line:max-line-length
import { IFormErrorMessages, IFormAttributeNames, IFormNormalizedSchema, /* IFormConfiguration, */ IFormDefinition, IFormValues } from './interfaces/Form';
import { formField, submitCallback } from './types';
import { FieldArray } from './FieldArray';
import { FieldSection } from './FieldSection';
import { objectPath, normalizeSchema } from './utils';
import { FormEvent } from 'react';

export class Form {
	public formSchema: IFormNormalizedSchema = {};
	public attached: boolean = false;

	private errorMessages: IFormErrorMessages | undefined = undefined;
	private attributeNames: IFormAttributeNames | undefined = undefined;
	// private config: IFormConfiguration;
	private externalSubmit: submitCallback;
	private validationReactionDisposer: IReactionDisposer;

	@observable public fields = new Map<string, formField>();
	@observable public errors: Errors; // todo: initial value
	@observable public isValid: boolean | void; // todo: initial value

	@observable public submitting: boolean = false;
	@observable public validating: boolean = false;
	@observable public submitError: any;

	@observable public snapshots: IFormValues[] = [];
	@computed private get snapshot() {
		if (!this.snapshots.length) {
			return {} as IFormValues;
		}

		return this.snapshots[this.snapshots.length - 1];
	}
	@computed public get currentStep() {
		return this.snapshots.length + 1;
	}

	// computed
	/*
	hasErrors
	isValid
	isDirty
	isPristine
	isDefault
	isEmpty
	isFocused
	isToucehd
	isChanged
	error
	*/

	constructor(submit: submitCallback, options: IFormDefinition) {
		makeObservable(this);
		// tslint:disable-next-line:no-console
		this.externalSubmit = submit;

		this.extendConfiguration(options);

		this.registerValidation();
	}

	public extendConfiguration(options: IFormDefinition) {
		const { schema = {}, validator = {} } = options;
		const { errorMessages, attributeNames } = validator;

		Object.assign(this.formSchema, normalizeSchema(schema));
		this.errorMessages ? Object.assign(this.errorMessages, errorMessages) : this.errorMessages = errorMessages;
		this.attributeNames ? Object.assign(this.attributeNames, attributeNames) : this.attributeNames = attributeNames;
	}

	@computed get isDirty(): boolean {
		return Array.from(this.fields.values()).some(field => field.isDirty);
	}

	// todo: on for initialize values are recomputed -> this cause validation to recompute, may be inefficient
	@computed get validation(): IValidator<IFormValues> {
		return new Validator(this.values, this.rules, this.errorMessages);
	}

	// todo: values are recomputed each time field is registered, think if this is good behavior for form initialization
	@computed get values() {
		// return this.fields.entries().map(entry =>
		// ({ [entry[0]]: entry[1].value })).reduce((val, entry) => Object.assign(val, entry), {});
		return Array.from(this.fields.entries()).reduce((values, [name, field]) => {
			if (field.attached) {
				values[name] = field.value;
			}

			return values;
		}, Object.assign({}, this.snapshot));
	}

	@computed get rules(): { [propName: string]: string } {
		// todo: check if rule is computed on new field add
		// Rules are collect only for attached fields
		return Array.from(this.fields.values()).reduce((rules, field) => {
			if (field.attached) {
				Object.assign(rules, field.rules);
			}

			return rules;
		}, {});
	}

	@action.bound public reset() {
		this.fields.forEach(field => field.reset());
	}

	@action.bound public setTouched() {
		this.fields.forEach(field => field.setTouched());
	}

	@action.bound public takeSnapshot() {
		this.snapshots.push(Object.assign({}, this.values));
	}

	// steps (-1, -2 same like browserHistory)
	@action.bound public restoreSnapshot(steps: unknown) {
		const _steps = typeof steps === 'number' ? steps : -1;
		const step = this.snapshots.length + _steps;

		if (step <= 0) {
			this.snapshots.length = 0;
		}
		else {
			this.snapshots.splice(step, Math.abs(_steps));
		}
	}

	@action.bound public submit(...params: [FormEvent | MouseEvent, unknown[]]) {
		const maybeEvent = params[0];

		// stupid assumption, but enzyme fails on check maybeEvent.nativeEvent instanceof Event
		if (maybeEvent.preventDefault) {
			maybeEvent.preventDefault();
			params.shift();
		}

		this.submitError = undefined;
		this.setTouched();

		if (!this.isValid) {
			this.submitError = this.errors.all();
			return Promise.reject(this.submitError);
		}

		this.submitting = true;

		return Promise.all([this.externalSubmit(this.values, ...params)])
			.then(result => {
				this.submitting = false;
				return result[0];
			}, error => {
				this.submitting = false;
				this.submitError = error;
				return Promise.reject(this.submitError);
			});
		// todo: move into finally when it is part of standard
	}

	@action public addField(field: formField): void {
		this.fields.set(field.name, field);
	}

	@action public removeField(fieldName: string): void {
		this.fields.get(fieldName)!.detach();
		this.fields.delete(fieldName);
	}

	public getField(fieldName: string): (undefined | formField) {
		return this.fields.get(fieldName);
	}

	public registerValidation() {
		// todo: we need to dispose this reaction
		this.validationReactionDisposer = reaction(
			() => this.validation,
			() => {
				if (this.attributeNames) {
					this.validation.setAttributeNames(this.attributeNames);
				}
				this.isValid = this.validation.passes();
				this.errors = this.validation.errors;
			}
		);
	}

	public cleanup() {
		this.validationReactionDisposer();
	}

	// Field Manipulation
	public registerField(name: string, creationFn: () => formField): formField {
		const fieldPath = objectPath(name);
		const lastPathNode = fieldPath[fieldPath.length - 1];
		const fieldParent = this.getFieldParent(fieldPath);
		let field: formField | undefined;

		if (fieldParent) {
			field = fieldParent.getField(lastPathNode);

			if (!field) {
				field = creationFn();
				(fieldParent as Form | FieldArray | FieldSection).addField(field as formField);
			}
			else {
				field.attachCount++;
			}
		}

		return field as formField;
	}

	public unregisterField(field: formField) { // goes from parent to child ControlSection -> Control
		if (field.attached) { // subfield may be already detached when parent detaches

			field.detach(); // to trigger disappear from rules and not cause validation error

			/* if (this.config.destroyControlStateOnUnmount) {
					const fieldPath = objectPath(field.name),
					lastIndex = fieldPath.length - 1,
					lastNode = fieldPath[lastIndex],
					fieldParent = this.getFieldParent(fieldPath);

				if (fieldParent) {
					(fieldParent as Form | FieldArray | FieldSection).removeField(lastNode);
				}
				else {
						console.log('Attempt to remove field on already removed parent field', field.name) // tslint:disable-line
					}
				} */
		}
	}

	public findField(name: string): formField | undefined {
		const fieldPath = objectPath(name);

		return this.findFieldInHierarchy(fieldPath);
	}

	private findFieldInHierarchy(path: string[]): formField | undefined {
		try {
			// f is Form initially, and formField after, can`t handle type error
			return path.reduce((f: any, node) => (f as Form | FieldArray | FieldSection).getField(node), this);
		}
		catch (e) {
			console.error(`Field can't be selected. Check name hierarchy. Probably some field on the chain does not exist`, e); // tslint:disable-line
		}
	}

	private getFieldParent(path: string[]): Form | FieldArray | FieldSection | undefined {
		const pathToParent = path.slice(0, path.length - 1);
		return path.length === 1 ? this : (this.findFieldInHierarchy(pathToParent) as FieldArray | FieldSection | undefined); // tslint:disable-line
	}
}
