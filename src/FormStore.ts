import { observable } from 'mobx';

export class FormStore {
	@observable forms: {[propType:string]:any} = {};

	registerForm(name: string, mobxReactiveForm:any) {
		this.forms[name] = mobxReactiveForm;
	}

	unRegisterForm(name:string){
		if (this.forms[name]) {
			delete this.forms[name];
		}
	}
}