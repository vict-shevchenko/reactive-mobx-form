
import { Field } from './Field';
import { FieldArray } from './FieldArray';
import { FieldSection } from './FieldSection';

export type formField = Field | FieldArray | FieldSection;

export type submitCallback<V> = (values: V, ...rest: Array<unknown>) => unknown;
