export type fieldValue = string | number | boolean;
export type INormalizedFieldDefinition = [fieldValue, string];
export type IFieldDefinition = fieldValue | [fieldValue] | INormalizedFieldDefinition;

export interface IFormSchema {
	[propType: string]: IFieldDefinition;
}

export interface IFormNormalizedSchema {
	[propType: string]: INormalizedFieldDefinition;
}

export interface IFormErrorMessages {
	[propType: string]: string;
}

export interface IFormAttributeNames {
	[propType: string]: string;
}

export interface IFormValidatorDefinition {
	errorMessages: IFormErrorMessages;
	attributeNames: IFormAttributeNames;
}

export interface IFormConfiguration {
	destroyFormStateOnUnmount: boolean;
	destroyControlStateOnUnmount: boolean;
}

export interface IFormDefinition {
	validator?: Partial<IFormValidatorDefinition>;
	schema?: IFormSchema;
	config?: Partial<IFormConfiguration>;
}

export interface IFormValues {
	[propType: string]: fieldValue;
}

export interface IValidatorjsConfiguration {
	language?: string;
	setAttributeFormatter?: (attribute: string) => string;
}
