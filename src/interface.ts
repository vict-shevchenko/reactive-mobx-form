
export type fieldValue = string | number | boolean;
export type fieldDefinition = (fieldValue) | [fieldValue] | [(fieldValue), string];
export type normalizesdFieldDefinition = [(fieldValue), string];

export interface formSchema {
	[propType: string]: fieldDefinition
}

export interface normalizedFormSchema {
	[propType: string]: normalizesdFieldDefinition
}
