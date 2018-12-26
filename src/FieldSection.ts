import { observable, action, computed } from 'mobx';
import { formField } from './types';
import { objectPath } from './utils';

export class FieldSection {
	public name: string;

	@observable public attachCount: number = 1;
	@observable public subFields = new Map<string, formField>();

	constructor(name: string) {
		this.update(name);
	}

	public update(name: string) {
		this.name = name;
	}

	@computed get attached(): boolean {
		return this.attachCount > 0;
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

	public getField(index: string): formField | undefined {
		return this.subFields.get(index);
	}

	public detach(): void {
		if (this.attached) {
			this.attachCount = this.attachCount - 1;
		}
		this.subFields.forEach(subField => subField.detach());
	}

	@computed get value() {
		// tslint:disable-next-line: max-line-length
		return Array.from(this.subFields.entries()).reduce((values, [name, field]) => {
			if (field.attached) {
				values[name] = field.value;
			}

			return values;
		}, {});
	}

	@computed get rules() {
		// tslint:disable-next-line: max-line-length
		return Array.from(this.subFields.values()).reduce((rules, field) => {
			if (!field.attached) {
				Object.assign(rules, field.rules);
			}

			return rules;
		}, {});
	}

	@computed get isDirty() {
		// tslint:disable-next-line: max-line-length
		return Array.from(this.subFields.values()).some(subField => subField.isDirty);
	}
}
