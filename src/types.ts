import { Field } from './core/Field';
import { FieldArray } from './core/FieldArray';
import { FieldSection } from './core/FieldSection';

export type formField = Field | FieldArray | FieldSection;

export type submitCallback<V> = (values: V, ...rest: Array<unknown>) => unknown;
