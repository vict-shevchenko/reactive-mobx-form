declare var jest, describe, it, expect, beforeAll;
import * as React from 'react';
import {
	isConfigParamValid,
	createForm,
	configureValidatorjs,
	validateConfigParams
} from '../src/createForm';
import BasicForm from '../__mocks__/BasicForm.mock';
import { IFormSchema } from '../src/interfaces/Form';
import { shallow } from 'enzyme';
import { FormStore } from '../src/Store';

import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Testing isConfigParamValid', () => {
	test('Calling isConfigParamValid should return correct value', () => {
		expect(isConfigParamValid({})).toBeTruthy();
		expect(isConfigParamValid({ a: 15 })).toBeTruthy();
		expect(isConfigParamValid('')).toBeFalsy();
		expect(isConfigParamValid([])).toBeFalsy();
		expect(isConfigParamValid(25)).toBeFalsy();
		expect(isConfigParamValid(null)).toBeFalsy();
		expect(isConfigParamValid(undefined)).toBeFalsy();
	});
});

describe('Testing validateConfigParams', () => {
	test('Calling validateConfigParams should return correct values', () => {
		expect(validateConfigParams('myForm', [])).not.toBeDefined();
		expect(validateConfigParams('myForm', [{}])).not.toBeDefined();
		expect(validateConfigParams('myForm', [{}, {}])).not.toBeDefined();

		expect(() => validateConfigParams('', [])).toThrow('Form name should be non empty string');
		expect(() => validateConfigParams('myForm', [[]])).toThrow('Error validating form initialization parameters');
		expect(() => validateConfigParams('myForm', ['string'])).toThrow('Error validating form initialization parameters');
	});
});

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

describe('Testing interaction of Form Component', () => {
	// tslint:disable-next-line:variable-name
	let ReactiveBasicForm, formStore;

	beforeEach(() => {
		ReactiveBasicForm = createForm('myForm')(BasicForm); // tslint:disable-line
		formStore = new FormStore();
		formStore.registerForm('myForm', {}, {}, {});
	});

	test('Rendering Form with incorrect "schema" parameter should throw error"', () => {
		expect(() => shallow(
			<ReactiveBasicForm.wrappedComponent
				formStore={formStore}
				// tslint:disable-next-line:no-empty
				onSubmit={() => {}}
				schema={'hello'}
				/>
			)).toThrow('Attribute "schema" provided to Form has incorrect format. Object expected');
	});

	test('Rendering Form with incorrect "onSubmit" parameter should throw error"', () => {
		// tslint:disable-next-line:no-empty
		expect(() => shallow(
			<ReactiveBasicForm.wrappedComponent
				formStore={formStore}
				/>
			)).toThrow(`Attribute "onSubmit" is Required for <BasicForm /> component`);
	});

	test('It should render form and pass correct props to it', () => {
		const formWrapper = shallow(<ReactiveBasicForm.wrappedComponent
			formStore={formStore}
		// tslint:disable-next-line:no-empty
			onSubmit={() => {}}
		/>).children();

		expect(formWrapper.is('BasicForm')).toBeTruthy();

		expect(formWrapper.prop('submit')).toBeDefined();
		expect(formWrapper.prop('reset')).toBeDefined();
		expect(formWrapper.prop('destroy')).toBeDefined();
		expect(formWrapper.prop('submitting')).toBeFalsy();
		expect(formWrapper.prop('submitError')).not.toBeDefined();
		expect(formWrapper.prop('valid')).not.toBeDefined();
		expect(formWrapper.prop('dirty')).toBeFalsy();
	});

	test('It should render form and by pass any custom props to it', () => {
		const formWrapper = shallow(<ReactiveBasicForm.wrappedComponent
			formStore={formStore}
		// tslint:disable-next-line:no-empty
			onSubmit={() => {}}
			myCustomProp={'hello'}
		/>).children();

		expect(formWrapper.prop('myCustomProp')).toBe('hello');
	});
});

/* describe('Testing interaction with FormStore', () => {
	test('Rendering a form should register it in FormStore', () => {

	});

	test('Unmounting a form should remove it in FormStore', () => {

	});
});

describe('Testing interaction with FormStore, with destroyFormStateOnUnmount:false', () => {
	test('Rendering a form should register it in FormStore', () => {

	});

	test('Unmounting a form should not remove it in FormStore', () => {

	});
});

describe('Testing interaction with FormStore for Wizard type forms', () => {
	test('Rendering a form should register it in FormStore', () => {

	});

	test('Registernig Form with same name should extend configurations', () => {

	});
});

describe('Testing configuration of validators', () => {

	test('Setting up the validatoin config should happen without errors', () => {
		configureValidatorjs({ language: 'ru', setAttributeFormatter: attr => (attr) });
	});

	// todo: requires full thesting that validation was correctly set up
}); */
