
export type fieldValue = string | number | boolean;
export type fieldDefinition = (fieldValue) | [fieldValue] | [(fieldValue), string];

export interface fiedsSchema {
	[propType: string]: fieldDefinition
}
