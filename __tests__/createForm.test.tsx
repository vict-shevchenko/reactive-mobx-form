import * as React from 'react';
import {
	isConfigParamValid,
	validateConfigParams
} from '../src/createForm';
import BasicForm from '../__mocks__/BasicForm.mock';
// tslint:disable-next-line:max-line-length
import { SubmitForm, CustomSubmitFormWithEvent, CustomSubmitFormWithoutEvent, WizardForm1, WizardForm2 } from '../__mocks__/SimpleForm.mock';
import { shallow, mount } from 'enzyme';
import { FormStore } from '../lib/Store';
import { reactiveMobxForm, ReactiveMobxFormComponent } from '../index';

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
		const formCreationFunction = reactiveMobxForm('myForm');

		expect(formCreationFunction).toBeDefined();
	});

	test('Calling of creation function should return React.Component', () => {
		const formCreationFunction = reactiveMobxForm('myForm');
		const ReactiveBasicForm = formCreationFunction(BasicForm); // tslint:disable-line

		expect(ReactiveBasicForm).toBeDefined();
	});
});

describe('Testing different props combinations with Form Component, and passing down correct props', () => {
	// tslint:disable-next-line:variable-name
	let ReactiveBasicForm, formStore: FormStore;

	beforeEach(() => {
		ReactiveBasicForm = reactiveMobxForm('myForm')(BasicForm); // tslint:disable-line
		formStore = new FormStore();
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

describe('Form onSubmit should be called correctly and with correct attributes', () => {
	let formStore, wrapper;

	beforeEach(() => {
		formStore = new FormStore();
	});

	afterAll(() => {
		wrapper.unmount();
	});

	test('Testing onSubmit for submitting form via <form submit={sumbit}>', () => {
		const handleSubmit = jest.fn(formValues => formValues);
		// tslint:disable-next-line:variable-name
		const ReactiveSubmitForm: ReactiveMobxFormComponent = reactiveMobxForm('submitForm')(SubmitForm);

		wrapper = mount(<ReactiveSubmitForm onSubmit={handleSubmit} formStore={formStore} />);

		wrapper.find('input').simulate('change', { target: { value: 'Hello' }});
		wrapper.find('form').simulate('submit');

		expect(handleSubmit.mock.calls.length).toBe(1);
		expect(handleSubmit.mock.calls[0][0]).toEqual({firstName: 'Hello'});
	});

	test('Testing onSubmit for submitting form via <form submit={myCustomSubmit}> with passing event', () => {
		const handleSubmit = jest.fn(formValues => formValues);
		// tslint:disable-next-line
		const ReactiveCustomSubmitForm: ReactiveMobxFormComponent = reactiveMobxForm('customSubmitForm1')(CustomSubmitFormWithEvent);

		wrapper = mount(<ReactiveCustomSubmitForm onSubmit={handleSubmit} formStore={formStore} />);

		wrapper.find('input').simulate('change', { target: { value: 'Hello' }});
		wrapper.find('form').simulate('submit');

		expect(handleSubmit.mock.calls.length).toBe(1);
		expect(handleSubmit.mock.calls[0][0]).toEqual({firstName: 'Hello'});
		expect(handleSubmit.mock.calls[0][1]).toEqual('test');
	});

	test('Testing onSubmit for submitting form via <form submit={myCustomSubmit}> without passing event', () => {
		const handleSubmit = jest.fn(formValues => formValues);
		// tslint:disable-next-line
		const ReactiveCustomSubmitForm: ReactiveMobxFormComponent = reactiveMobxForm('customSubmitForm2')(CustomSubmitFormWithoutEvent);

		wrapper = mount(<ReactiveCustomSubmitForm onSubmit={handleSubmit} formStore={formStore} />);

		wrapper.find('input').simulate('change', { target: { value: 'Hello' }});
		wrapper.find('form').simulate('submit');

		expect(handleSubmit.mock.calls.length).toBe(1);
		expect(handleSubmit.mock.calls[0][0]).toEqual({firstName: 'Hello'});
		expect(handleSubmit.mock.calls[0][1]).toEqual('test');
	});

	test('Testing ASYNC onSubmit for submitting form via <form submit={sumbit}>', () => {
		// tslint:disable-next-line:no-empty
		let resolve;
		const submissionPromise = new Promise(res => {
			resolve = res;
		});

		const handleSubmit = jest.fn(()  => setTimeout(() => resolve('done'), 100));
		// tslint:disable-next-line:variable-name
		const ReactiveSubmitForm: ReactiveMobxFormComponent = reactiveMobxForm('asyncSubmitForm')(SubmitForm);

		wrapper = mount(<ReactiveSubmitForm onSubmit={handleSubmit} formStore={formStore} />);

		wrapper.find('input').simulate('change', { target: { value: 'Hello' }});
		wrapper.find('form').simulate('submit');

		return expect(submissionPromise).resolves.toEqual('done');
	});

	test('Testing onSubmit for submitting form via wizard type forms', () => {
		const handleSubmit1 = jest.fn(formValues => formValues);
		const handleSubmit2 = jest.fn(formValues => formValues);
		// tslint:disable-next-line:variable-name max-line-length
		const ReactiveWizard1Form: ReactiveMobxFormComponent = reactiveMobxForm('wizardForm', {config: {destroyFormStateOnUnmount: false }})(WizardForm1);
		// tslint:disable-next-line:variable-name
		const ReactiveWizard2Form: ReactiveMobxFormComponent = reactiveMobxForm('wizardForm')(WizardForm2);

		wrapper = mount(<ReactiveWizard1Form onSubmit={handleSubmit1} formStore={formStore} />);

		wrapper.find('input').simulate('change', { target: { value: 'Hello ' }});
		wrapper.find('form').simulate('submit');

		expect(handleSubmit1.mock.calls.length).toBe(1);
		expect(handleSubmit1.mock.calls[0][0]).toEqual({firstName: 'Hello '});

		wrapper.unmount();

		wrapper = mount(<ReactiveWizard2Form onSubmit={handleSubmit2} formStore={formStore} />);
		wrapper.find('input').simulate('change', { target: { value: 'World' }});
		wrapper.find('form').simulate('submit');

		expect(handleSubmit2.mock.calls.length).toBe(1);
		expect(handleSubmit2.mock.calls[0][0]).toEqual({firstName: 'Hello ', lastName: 'World'});
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
