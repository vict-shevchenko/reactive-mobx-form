import { observable } from 'mobx';
import { Form } from './Form';
import { IFormDefinition, IFormSchema } from './interfaces/Form';
import { submitCallback } from './types';

export class FormStore {
	@observable public forms: Map<string, Form> = observable.map();

	public registerForm( name: string, submit: submitCallback, options: IFormDefinition) {
		let form: Form;

		if (!this.hasForm(name)) {
			form = new Form(submit, options);
			this.forms.set(name, form);
			return form;
		}
		else {
			throw(new Error(`Form with name "${name}" already exist. Use "withFormData" HOC to extend it`));
		}
	}

	public extendForm(name: string, options: {schema: IFormSchema}) {
		if (this.hasForm(name)) {
			const form = this.getForm(name) as Form;
			form.attachCount++;
			form.extendConfiguration(options);
			return form;
		}
		else {
			// tslint:disable-next-line:max-line-length
			throw(new Error(`Form with name "${name}" does not exist so can not be extended. Use "reactiveMobxForm" HOC to create it firstly`));
		}
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
