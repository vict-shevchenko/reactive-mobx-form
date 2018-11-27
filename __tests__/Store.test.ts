import { FormStore } from '../lib/Store';

describe('Testing the FormStore', () => {
	let formStore: FormStore;

	beforeAll(() => {
		formStore = new FormStore();
	});

	test('Creation on new FormStore instance should wokr correctly', () => {
		expect(formStore).toEqual(expect.any(FormStore));
	});

	test('created instance of FormStore should have proper methods and properties', () => {
		expect(formStore.forms).toBeDefined();
		expect(formStore.forms.size).toBe(0);

		/* formStore.registerForm('myform', {}, {}, {});

		expect(formStore.forms.get('myform')).toBeDefined();

		formStore.unRegisterForm('myform');

		expect(formStore.forms.get('myform')).not.toBeDefined();
		expect(formStore.forms.size).toBe(0); */
	});

	test('It should be possible to register new Form', () => {
		formStore.registerForm('myform', {});
		expect(formStore.forms.size).toBe(1);
	});

	test('It should not be possible to register new Form with same name', () => {
		formStore.registerForm('myform', {});
		expect(formStore.forms.size).toBe(1);

		formStore.registerForm('myform', {});
		expect(formStore.forms.size).toBe(1);
		expect(formStore.forms.get('myform')!.formSchema).toEqual({});
	});

	test('It should be possible to extend form configuration', () => {
		formStore.registerForm('myform', {});
		expect(formStore.forms.size).toBe(1);
		expect(formStore.forms.get('myform')!.formSchema).toEqual({});

		formStore.registerForm('myform', { schema: { name: ['Viktor', 'required'] } });
		expect(formStore.forms.size).toBe(1);
		expect(formStore.forms.get('myform')!.formSchema).toEqual({ name: ['Viktor', 'required'] });
	});

	test('It should be possible to unregister form', () => {
		formStore.registerForm('myform', {});
		expect(formStore.forms.size).toBe(1);

		formStore.unRegisterForm('myform');
		expect(formStore.forms.size).toBe(0);
	});

	test('It should be possible. Unregistring of form with invalid name should not throw', () => {
		formStore.registerForm('myform', {});
		expect(formStore.forms.size).toBe(1);

		formStore.unRegisterForm('yourform');
		expect(formStore.forms.size).toBe(1);
	});

	test('It should be possible to check form existance', () => {
		formStore.registerForm('myform', {});
		expect(formStore.hasForm('myform')).toBe(true);
		expect(formStore.hasForm('yourform')).toBe(false);
	});

	test('It should be possible to fetch form', () => {
		formStore.registerForm('myform', { schema: { name: ['Viktor', 'required'] } });
		const form = formStore.getForm('myform');
		const yourForm = formStore.getForm('yourform');

		expect(form).toBeDefined();
		expect(form!.formSchema).toEqual({ name: ['Viktor', 'required'] });

		expect(yourForm).not.toBeDefined();
	});
});
