export type fieldValue = string | number | boolean;
export type normalizesdFieldDefinition = [(fieldValue), string];
export type fieldDefinition = (fieldValue) | [fieldValue] | normalizesdFieldDefinition;


export interface IFormSchema {
	[propType: string]: fieldDefinition;
}

export interface IFormErrorMessages {
	[propType: string]: string
}

export interface IFormAttributeNames {
	[propType: string]: string
}

export interface IFormValidatiorDefinnition {
	errorMessages?: IFormErrorMessages
	attributeNames?: IFormAttributeNames
}

export interface IFormDefinition {
	validator?: IFormValidatiorDefinnition, 
	schema?: IFormSchema
}

export interface IFormValues {
	[propType: string]: fieldValue
}

export interface IValidatorjsConfiguration {
	language?: string,
	setAttributeFormatter?: (attribute: string) => string,
}
