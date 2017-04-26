import { observable } from 'mobx';

export class MobxReactiveForm {
	@observable fields: Array<Field>;
	fieldsDefinition: any;

	constructor(fieldsDefinition) {
		this.fieldsDefinition = fieldsDefinition;

		Object.keys(fieldsDefinition).map(fieldName => {
			this.fields.push(new Field(fieldName, fieldsDefinition[fieldName]))
		})
	}
}

class Field {
	name: string;
	value: string | number | boolean = '';

	constructor(name, fieldDefinition ) {
		this.name = name;
		this.value = fieldDefinition[0];

	}
}