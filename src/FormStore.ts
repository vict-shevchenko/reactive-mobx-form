import { observable } from 'mobx';

export class FormStore {
	@observable forms: {[propType:string]:any} = {};

	registerForm(name: string, form:any) {
		this.forms[name] = form;
	}
}