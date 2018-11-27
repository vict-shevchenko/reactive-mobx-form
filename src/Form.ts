import { observable, action, computed, reaction } from 'mobx';
import { Errors, Validator as IValidator } from 'validatorjs';
import * as Validator from 'validatorjs';
// tslint:disable-next-line:max-line-length
import { IFormErrorMessages, IFormAttributeNames, IFormNormalizedSchema, IFormConfiguration, IFormDefinition } from './interfaces/Form';
import { formField } from './types';
import { FieldArray } from './FieldArray';
import { FieldSection } from './FieldSection';
import { objectPath, normalizeSchema } from './utils';

export const DEFAULT_FORM_CONFIG: IFormConfiguration = {
	destroyFormStateOnUnmount: true,
	destroyControlStateOnUnmount: true
};

export class Form {
	public formSchema: IFormNormalizedSchema = {};

	private errorMessages: IFormErrorMessages | undefined = undefined;
	private attributeNames: IFormAttributeNames | undefined = undefined;
	private config: IFormConfiguration;

	@observable public fields = new Map<string, formField>();
	@observable public errors: Errors; // todo: initial value
	@observable public isValid: boolean | void; // todo: initial value

	@observable public submitting: boolean = false;
	@observable public validating: boolean = false;
	@observable public submitError: any;

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

	constructor(options: IFormDefinition) {
		this.extendConfiguration(options);
		this.config = Object.assign({}, DEFAULT_FORM_CONFIG, options.config);

		this.registerValidation();
	}

	public extendConfiguration(options: IFormDefinition) {
		const { schema = {}, validator = {}} = options;
		const { errorMessages, attributeNames } = validator;

		Object.assign(this.formSchema, normalizeSchema(schema));
		this.errorMessages ? Object.assign(this.errorMessages, errorMessages) : this.errorMessages = errorMessages;
		this.attributeNames ? Object.assign(this.attributeNames, attributeNames) : this.attributeNames = attributeNames;
	}

	@computed get isDirty(): boolean {
		return Array.from(this.fields.values()).some(field => field.isDirty);
	}

	// todo: on for initialize values are recomputed -> this cause validation to recompute, may be inefficient
	@computed get validation(): IValidator<{ [name: string]: boolean | number | string }> {
		return new Validator(this.values, this.rules, this.errorMessages);
	}

	// todo: values are recomputed each time field is registered, think if this is good behavior for form initialization
	@computed get values() {
		// return this.fields.entries().map(entry =>
		// ({ [entry[0]]: entry[1].value })).reduce((val, entry) => Object.assign(val, entry), {});
		return Array.from(this.fields.entries()).reduce((values, [name, field]) => (values[name] = field.value, values), {});
	}

	@computed get rules(): { [propName: string]: string } { // todo: check if rule is computed on new field add
		return Array.from(this.fields.values()).reduce((rules, field) => Object.assign(rules, field.rules), {});
	}

	@action public reset() {
		this.fields.forEach(field => field.reset());
	}

	@action public setTouched() {
		this.fields.forEach(field => field.setTouched());
	}

	@action public addField(field: formField): void {
		this.fields.set(field.name, field);
	}

	@action public removeField(fieldName: string): void {
		(this.fields.get(fieldName) as formField).setAutoRemove();
		this.fields.delete(fieldName);
	}

	public getField(fieldName: string): (undefined | formField) {
		return this.fields.get(fieldName);
	}

	public registerValidation() {
		// todo: we need to dispose this reaction
		reaction(
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
		}

		return field as formField;
	}

	public unregisterField(fieldName: string) {
		if (this.config.destroyControlStateOnUnmount) {
			const fieldPath = objectPath(fieldName),
				lastIndex = fieldPath.length - 1,
				lastNode = fieldPath[lastIndex],
				fieldParent = this.getFieldParent(fieldPath);

			if (fieldParent) {
				(fieldParent as Form | FieldArray | FieldSection).removeField(lastNode);
			}
			else {
				console.log('Attempt to remove field on already removed parent field', fieldName) // tslint:disable-line
			}
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
