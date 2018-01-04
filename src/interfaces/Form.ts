export type fieldValue = string | number | boolean;
export type INormalizesdFieldDefinition = [(fieldValue), string];
export type IFieldDefinition = (fieldValue) | [fieldValue] | INormalizesdFieldDefinition;

export interface IFormSchema {
	[propType: string]: IFieldDefinition;
}

export interface IFormErrorMessages {
	[propType: string]: string;
}

export interface IFormAttributeNames {
	[propType: string]: string;
}

export interface IFormValidatiorDefinnition {
	errorMessages?: IFormErrorMessages;
	attributeNames?: IFormAttributeNames;
}

export interface IFormDefinition {
	validator?: IFormValidatiorDefinnition;
	schema?: IFormSchema;
	unregisterOnUnmount?: boolean;
}

export interface IFormValues {
	[propType: string]: fieldValue;
}

export interface IValidatorjsConfiguration {
	language?: string;
	setAttributeFormatter?: (attribute: string) => string;
}
