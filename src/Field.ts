import { observable, action, computed, autorun, IReactionDisposer, makeObservable } from 'mobx';
import { fieldValue, INormalizedFieldDefinition } from './interfaces/Form';
import { Form } from './Form';

export class Field {
	private initialValue: fieldValue;

	/* tslint:disable: typedef-whitespace */
	@observable public attachCount: number = 1;
	@observable public name       : string; // name is updated on FieldArray remove item
	@observable public value      : fieldValue;
	@observable public errors     : string[] = [];
	@observable public isFocused  : boolean  = false;
	@observable public isTouched  : boolean  = false;

	@observable private _rules: string; // rules are updated on FieldArray remove item
	/* tslint:enable: typedef-whitespace */

	constructor(name: string, fieldDefinition: INormalizedFieldDefinition) {
		makeObservable(this);
		this.update(name, fieldDefinition);
	}

	public update(name: string, fieldDefinition: INormalizedFieldDefinition): void {
		this.name = name;
		this.initialValue = fieldDefinition[0];
		this.value = this.value || this.initialValue;
		this._rules = fieldDefinition[1];
	}

	@computed get attached(): boolean {
		return this.attachCount > 0;
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

	@action public onChange(value: fieldValue): void {
		this.value = value;
	}

	@action public reset(): void  {
		this.value = this.initialValue;
		this.isTouched = false;
	}

	@action public setTouched() {
		this.isTouched = true;
	}

	@action public detach(): void  {
		if (this.attached) {
			this.attachCount = this.attachCount - 1;
		}
	}

	public subscribeToFormValidation(form: Form): IReactionDisposer {
		return autorun(() => {
			const errors: string[] = form.errors?.get(this.name);

			if (errors && this.errors.join() !== errors?.join()) {
				this.errors = errors;
			}
		});
	}
}
