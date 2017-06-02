import { observable } from 'mobx';
import { Form } from './Form';

export class FormStore {
	@observable forms: {[propType:string]:Form} = {};

	registerForm(name: string, form:Form) {
		this.forms[name] = form;
	}

	unRegisterForm(name:string){
		if (this.forms[name]) {
			delete this.forms[name];
		}
	}
}