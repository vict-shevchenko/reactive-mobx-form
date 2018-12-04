
import { Field } from './Field';
import { FieldArray } from './FieldArray';
import { FieldSection } from './FieldSection';
import { IFormValues } from './interfaces/Form';

export type formField = Field | FieldArray | FieldSection;

export type submitCallback = (values: IFormValues, ...rest: any[]) => unknown;
