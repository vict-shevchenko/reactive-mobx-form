import { observable, ObservableMap } from 'mobx';
import { Form } from './Form';

export class FormStore {
	@observable public forms: ObservableMap<Form> = observable.map();

	public registerForm(name: string, form: Form): void {
		this.forms.set(name, form);
	}

	public unRegisterForm(name: string): void {
		if (this.forms.has(name)) {
			this.forms.delete(name);
		}
	}
}
