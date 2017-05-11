import { observable } from 'mobx';
import { ReactiveMobxForm } from './Form';

export class FormStore {
	@observable forms: {[propType:string]:ReactiveMobxForm} = {};

	registerForm(name: string, ReactiveMobxForm:ReactiveMobxForm) {
		this.forms[name] = ReactiveMobxForm;
	}

	unRegisterForm(name:string){
		if (this.forms[name]) {
			delete this.forms[name];
		}
	}
}