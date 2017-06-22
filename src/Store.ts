import { observable, ObservableMap } from 'mobx';
import { Form } from './Form';

export class FormStore {
	@observable forms: ObservableMap<{}> = observable.map();

	registerForm(name: string, form:Form) {
		this.forms.set(name, form);
	}

	unRegisterForm(name:string){
		if (this.forms.has(name)) {
			this.forms.delete(name)
		}
	}
}