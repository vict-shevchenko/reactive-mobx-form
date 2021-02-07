import { observable } from 'mobx';
import { Form } from '../core/Form';
import { IFormDefinition, IFormSchema } from '../interfaces/Form';
import { submitCallback } from '../types';

export class FormStore {
	@observable public forms: Map<string, Form<any>> = observable.map();

	public registerForm<V>(name: string, submit: submitCallback<V>, options: IFormDefinition) {
		let form: Form<V>;

		if (!this.hasForm(name)) {
			form = new Form<V>(submit, options);
			this.forms.set(name, form);
		} else {
			form = this.getForm(name) as Form<V>;
			if (form.attached) {
				// attempt to double register form
				throw new Error(`Form with name "${name}" already exist. Use "withFormData" HOC to extend it`);
			}
		}

		// looks ok, we created new form or retrieved form form store as it was disconnected with keepState=true
		form.attached = true;
		return form;
	}

	public extendForm(name: string, options: { schema: IFormSchema }) {
		if (this.hasForm(name)) {
			const form = this.getForm(name) as Form;
			form.extendConfiguration(options);
			return form;
		} else {
			// tslint:disable-next-line:max-line-length
			throw new Error(
				`Form with name "${name}" does not exist so can not be extended. Use "reactiveMobxForm" HOC to create it firstly`
			);
		}
	}

	public unRegisterForm(name: string) {
		const form = this.getForm(name) as Form;

		form.cleanup();
		this.forms.delete(name);
	}

	public detachForm(name) {
		const form = this.getForm(name) as Form;
		form.attached = false;
	}

	public hasForm(name: string) {
		return this.forms.has(name);
	}

	public getForm(name: string) {
		return this.forms.get(name);
	}
}
