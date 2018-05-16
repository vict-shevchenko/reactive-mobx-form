import { observable, action, computed } from 'mobx';
import { formField } from './types';
import { objectPath } from './utils';

export class FieldSection {
	public name: string;
	public autoRemove: boolean = false;

	@observable public subFields = new Map<string, formField>();

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

	// todo: probably we dont need values()
	@action public reset() {
		this.subFields.forEach(subField => subField.reset());
	}

	@action public setTouched() {
		this.subFields.forEach(subField => subField.setTouched());
	}

	@action public removeField(index: string) {
		this.subFields.delete(index);
	}

	public selectField(index: string) {
		return (this.subFields as Map<string, formField>).get(index);
	}

	public setAutoRemove(): void {
		this.autoRemove = true;
		this.subFields.forEach(subField => subField.setAutoRemove());
	}

	@computed get value() {
		// tslint:disable-next-line: max-line-length
		return Array.from(this.subFields.entries()).reduce((values, [name, field]) => (values[name] = field.value, values), {});
	}

	@computed get rules() {
		// tslint:disable-next-line: max-line-length
		return Array.from(this.subFields.values()).reduce((rules, field) => Object.assign(rules, field.rules), {});
	}

	@computed get isDirty() {
		// tslint:disable-next-line: max-line-length
		return Array.from(this.subFields.values()).some(subField => subField.isDirty);
	}
}
