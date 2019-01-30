import { observable } from 'mobx';
import { Form } from './Form';
import { IFormDefinition } from './interfaces/Form';
import { submitCallback } from './types';

export class FormStore {
	@observable public forms: Map<string, Form> = observable.map();

	public registerForm(
			name: string,
			submit: submitCallback,
			options: IFormDefinition)
		{ // tslint:disable-line
		let form: Form;

		if (this.hasForm(name)) {
			form = this.getForm(name) as Form;
			form.attachCount++;
			form.extendConfiguration(options);
		}
		else {
			form = new Form(submit, options);
			this.forms.set(name, form);
		}

		return form;
	}

	public unRegisterForm(name: string) {
		if (this.hasForm(name)) {
			const form = this.getForm(name) as Form;
			form.attachCount--;

			if (form.attachCount === 0) {
				form.cleanup();
				this.forms.delete(name);
			}
		}
	}

	public hasForm(name: string) {
		return this.forms.has(name);
	}

	public getForm(name: string) {
		return this.forms.get(name);
	}
}
