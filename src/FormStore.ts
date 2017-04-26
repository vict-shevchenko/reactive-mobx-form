export class FormStore {
	forms: {[propType:string]:any} = {};

	registerForm(name: string, form:any) {
		this.forms[name] = form;
	}
}