import { observable } from 'mobx';
import { Form } from './Form';
import { IFormDefinition } from './interfaces/Form';

export class FormStore {
	@observable public forms: Map<string, Form> = observable.map();

	public registerForm(
			name: string,
			options: IFormDefinition): Form
		{ // tslint:disable-line
		let form: Form;

		if (this.hasForm(name)) {
			form = this.getForm(name) as Form;
			form.extendConfiguration(options);
		}
		else {
			form = new Form(options);
			this.forms.set(name, form);
		}

		return form;
	}

	public unRegisterForm(name: string): void {
		if (this.forms.has(name)) {
			const form = this.getForm(name) as Form;
			form.cleanup();
			this.forms.delete(name);
		}
	}

	public hasForm(name: string): boolean {
		return this.forms.has(name);
	}

	public getForm(name: string): Form | undefined {
		return this.forms.get(name);
	}
}
