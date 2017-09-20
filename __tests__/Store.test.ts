declare var jest, describe, it, expect, beforeAll;
import { FormStore} from '../src/Store';
import { Form } from '../src/Form';

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

		formStore.registerForm('myform', new Form({}, {}, {}));

		expect(formStore.forms.get('myform')).toBeDefined();

		formStore.unRegisterForm('myform');

		expect(formStore.forms.get('myform')).not.toBeDefined();
		expect(formStore.forms.size).toBe(0);
	});
});
