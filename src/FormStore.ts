import { observable } from 'mobx';
import { MobxReactiveForm } from './mobxReactiveForm';

export class FormStore {
	@observable forms: {[propType:string]:MobxReactiveForm} = {};

	registerForm(name: string, mobxReactiveForm:any) {
		this.forms[name] = mobxReactiveForm;
	}

	unRegisterForm(name:string){
		if (this.forms[name]) {
			delete this.forms[name];
		}
	}
}