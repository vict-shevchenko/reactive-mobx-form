import * as React from 'react';
import { reactiveMobxForm, ReactiveMobxFormComponent, Control, FormStore } from '../index';
import { ToggleControlForm, IToggle } from '../__mocks__/SimpleForm.mock';
import { mount } from 'enzyme';

import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { Form } from '../lib/Form';

Enzyme.configure({ adapter: new Adapter() });

describe('Testing behavior when removing control from a Form', () => {
	let wrapper;

	const formStore = new FormStore(),
		// tslint:disable-next-line:only-arrow-functions
		submitHandler = v => v;

	class Wrapper extends React.Component<{ form: ReactiveMobxFormComponent<IToggle> }> {
		public state = {
			controlVisible: true
		};

		private toggleControlVisibility() {
			this.setState({ controlVisible: false });
		}

		public render() {
			// tslint:disable-next-line:variable-name
			const ReactiveForm = this.props.form;
			return (
				<div>
					<ReactiveForm
						onSubmit={submitHandler}
						controlVisible={this.state.controlVisible}
						formStore={formStore}
					/>
					<button id="changeVis" onClick={this.toggleControlVisibility.bind(this)}>click</button>
				</div>
			);
		}
	}

	afterEach(() => {
		wrapper.unmount();
	});

	// tslint:disable-next-line:max-line-length
	test('Control data should be removed from form values but not from fields', () => {
		// tslint:disable-next-line
		const ReactiveForm = reactiveMobxForm('toggleControlForm2')(ToggleControlForm);

		wrapper = mount(<Wrapper form={ReactiveForm} />);
		const form = formStore.getForm('toggleControlForm2') as Form;

		expect(wrapper.find(Control)).toHaveLength(1);
		expect(wrapper.find('input')).toHaveLength(1);
		expect(form.values).toEqual({ firstName: '' });
		expect(form.fields.get('firstName')).toBeDefined();

		wrapper.find('#changeVis').simulate('click');

		expect(wrapper.find(Control)).toHaveLength(0);
		expect(wrapper.find('input')).toHaveLength(0);
		expect(form.values).toEqual({});
		expect(form.fields.get('firstName')).toBeDefined();
	});
});
