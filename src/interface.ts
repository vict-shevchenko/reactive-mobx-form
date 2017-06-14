
import { Field } from "./Field";
import { FieldArray } from "./FieldArray";
import { FieldSection } from "./FieldSection";

export type fieldValue = string | number | boolean;
export type fieldDefinition = (fieldValue) | [fieldValue] | [(fieldValue), string];
export type normalizesdFieldDefinition = [(fieldValue), string];

export type formField = Field | FieldArray | FieldSection;

export interface formSchema {
	[propType: string]: fieldDefinition
}

export interface normalizedFormSchema {
	[propType: string]: normalizesdFieldDefinition
}
