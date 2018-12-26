import { Field } from '../lib/Field';
import { Form } from '../lib/Form';
import { formField } from '../lib/types';

describe('Testing of Field class', () => {
	test('Creation of field instance should work correctly', () => {
		const field = new Field('name', ['', '']);

		expect(field).toBeDefined();
	});

	// todo: test creation with incorrect incoming parameters

	test('Verify field properties are defined correctly', () => {
		const field = new Field('name', ['', '']);
		const fieldWithInitial = new Field('name', ['Viktor', '']);
		const fieldWithRules = new Field('name', ['Viktor', 'required']);

		expect(field.name).toBe('name');
		expect(field.value).toBe('');
		expect(field.attachCount).toBe(1);
		expect(field.attached).toBeTruthy();
		expect(field.errors).toBeInstanceOf(Array);
		expect(field.errors.length).toBe(0);
		expect(field.isFocused).toBe(false);
		expect(field.isTouched).toBe(false);
		expect(field.isDirty).toBe(false);
		expect(field.isValid).toBe(true);
		expect(field.rules).toEqual({ });

		expect(fieldWithInitial.name).toBe('name');
		expect(fieldWithInitial.value).toBe('Viktor');
		expect(fieldWithInitial.rules).toEqual({ });

		expect(fieldWithRules.name).toBe('name');
		expect(fieldWithRules.value).toBe('Viktor');
		expect(fieldWithRules.rules).toEqual({ name: 'required' });
	});

	test('Verify setTouched method works correctly', () => {
		const field = new Field('name', ['Viktor', 'required']);

		expect(field.isTouched).toBe(false);

		field.setTouched();

		expect(field.isTouched).toBe(true);
	});

	test('Verify field methods Focus and Blur work correctly as expected', () => {
		const field = new Field('name', ['Viktor', 'required']);

		expect(field.isFocused).toBe(false);
		expect(field.isTouched).toBe(false);

		field.onFocus();

		expect(field.isFocused).toBe(true);
		expect(field.isTouched).toBe(true);

		field.onBlur();

		expect(field.isFocused).toBe(false);
		expect(field.isTouched).toBe(true);

		field.onFocus();

		expect(field.isFocused).toBe(true);
		expect(field.isTouched).toBe(true);
	});

	test('Verify field method Change works correctly as expected', () => {
		const field = new Field('name', ['Viktor', 'required']);

		expect(field.value).toBe('Viktor');

		field.onChange('Olena');

		expect(field.value).toBe('Olena');
		expect(field.isDirty).toBe(true);

	});

	test('Verify field method reset works correctly as expected', () => {
		const field = new Field('name', ['Viktor', 'required']);

		field.onChange('Olena');
		field.reset();

		expect(field.value).toBe('Viktor');
		expect(field.isDirty).toBe(false);
		expect(field.isTouched).toBe(false);
	});

	test('Verify field method setDetached works correctly as expected', () => {
		const field = new Field('name', ['Viktor', 'required']);

		field.onChange('Olena');
		field.detach();
		expect(field.attachCount).toBe(0);
	});

	test('Verify field method update works correctly as expected', () => {
		const field = new Field('name', ['Viktor', 'required']);

		field.update('firstName', ['Olena', 'max:3']);

		expect(field.name).toBe('firstName');
		expect(field.value).toBe('Viktor');
		expect(field.rules).toEqual({ firstName: 'max:3' });

		field.onChange(''); // clean field

		field.update('lastName', ['Anna', 'min:4']);

		expect(field.name).toBe('lastName');
		expect(field.value).toBe('Anna');
		expect(field.rules).toEqual({ lastName: 'min:4' });
	});

	test('Verify fetching errors for field from Form', () => {
		const form = new Form(v => v, {});

		function createField(): formField {
			return new Field('name', ['Viktor', 'required']);
		}

		form.registerValidation();
		const field = form.registerField('name', createField) as Field;

		field.subscribeToFormValidation(form);

		expect(field.errors.length).toBe(0);

		field.onChange('');

		expect(field.errors.length).toBe(1);
	});
});
