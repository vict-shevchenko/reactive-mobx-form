import { FormStore } from '../lib/Store';

describe('Testing the FormStore', () => {
	const formStore: FormStore = new FormStore();

	beforeEach(() => {
		formStore.forms.clear();
	});

	test('Creation on new FormStore instance should work correctly', () => {
		expect(formStore).toEqual(expect.any(FormStore));
	});

	test('created instance of FormStore should have proper methods and properties', () => {
		expect(formStore.forms).toBeDefined();
		expect(formStore.forms.size).toBe(0);
	});

	test('It should be possible to register new Form', () => {
		formStore.registerForm('myform', v => v, {});
		expect(formStore.forms.size).toBe(1);
		expect(formStore.forms.get('myform')!.formSchema).toEqual({});
		expect(formStore.forms.get('myform')!.attached).toBeTruthy();
	});

	test('It should not be possible to register new Form with same name, should throw', () => {
		formStore.registerForm('myform', v => v, {});
		expect(formStore.forms.size).toBe(1);
		expect(formStore.forms.get('myform')!.formSchema).toEqual({});

		expect(() => formStore.registerForm('myform', v => v, {})).toThrowErrorMatchingSnapshot();
	});

	test('It should be possible to extend form configuration', () => {
		formStore.registerForm('myform', v => v, {});
		formStore.extendForm('myform', { schema: { name: ['Viktor', 'required'] } });

		expect(formStore.forms.size).toBe(1);
		expect(formStore.forms.get('myform')!.attached).toBeTruthy();
		expect(formStore.forms.get('myform')!.formSchema).toEqual({ name: ['Viktor', 'required'] });
	});

	test('It should throw when extending form that was not created', () => {
		expect(() => formStore.extendForm('myform', { schema: {} })).toThrowErrorMatchingSnapshot();
	});

	test('It should be possible to unregister form', () => {
		formStore.registerForm('myform', v => v, {});
		expect(formStore.forms.size).toBe(1);

		formStore.unRegisterForm('myform');
		expect(formStore.forms.size).toBe(0);
	});

	test('Form should stay in FormStore if detachForm was called', () => {
		formStore.registerForm('myform', v => v, {});

		formStore.detachForm('myform');
		expect(formStore.forms.size).toBe(1);
		expect(formStore.forms.get('myform')!.attached).toBeFalsy();
	});

	test('It should be possible to check form existence', () => {
		formStore.registerForm('myform', v => v, {});
		expect(formStore.hasForm('myform')).toBe(true);
		expect(formStore.hasForm('yourform')).toBe(false);
	});

	test('It should be possible to fetch form', () => {
		formStore.registerForm('myform', v => v, { schema: { name: ['Viktor', 'required'] } });
		const form = formStore.getForm('myform');
		const yourForm = formStore.getForm('yourform');

		expect(form).toBeDefined();
		expect(form!.formSchema).toEqual({ name: ['Viktor', 'required'] });

		expect(yourForm).not.toBeDefined();
	});
});
