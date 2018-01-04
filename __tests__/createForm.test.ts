declare var jest, describe, it, expect, beforeAll;
import { createForm, configureValidatorjs } from '../src/createForm';
import BasicForm from '../__mocks__/BasicForm.mock';

describe('Testing creation of Form Component', () => {

	test('Calling "createForm should return a function, and be defined"', () => {
		const formCreationFunction = createForm('myForm');

		expect(formCreationFunction).toBeDefined();
	});

	test('Calling of creation function should return React.Component', () => {
		const formCreationFunction = createForm('myForm');
		const ReactiveBasicForm = formCreationFunction(BasicForm); // tslint:disable-line

		expect(ReactiveBasicForm).toBeDefined();
	});
});

describe('Testing configuration of validators', () => {

	test('Setting up the validatoin config should happen without errors', () => {
		configureValidatorjs({ language: 'ru', setAttributeFormatter: attr => (attr) });
	});

	// todo: requires full thesting that validation was correctly set up
});
