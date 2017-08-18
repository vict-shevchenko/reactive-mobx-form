
import { Field } from "./Field";
import { FieldArray } from "./FieldArray";
import { FieldSection } from "./FieldSection";

export type fieldValue = string | number | boolean;
export type fieldDefinition = (fieldValue) | [fieldValue] | [(fieldValue), string];
export type normalizesdFieldDefinition = [(fieldValue), string];

export type formField = Field | FieldArray | FieldSection;

export interface IFormSchema {
	[propType: string]: fieldDefinition
}

export interface normalizedFormSchema {
	[propType: string]: normalizesdFieldDefinition
}

export interface IValidatorjsConfiguration {
	language?: string,
	setAttributeFormatter?: (attribute: string) => string,
}

export interface IFormErrorMessages {
	[propType: string]: string
}

export interface IFormDefinition {
	validator?: IValidatorjsConfiguration, 
	schema?: IFormSchema,
	errorMessages?: IFormErrorMessages
}

export interface IFormValues {
	[propType: string]: fieldValue
}
