import * as React from 'react';
import { inject, observer } from 'mobx-react'
import { FormStore } from 'reactive-mobx-form';
import * as beautify from 'json-beautify';

import Document from '../document/Document';
import Code from '../code/Code';

import SimpleForm from '../../examples/simple/SimpleForm';
import SyncValidationForm from '../../examples/sync-validation/SyncFieldValidation';
import ControlSectionForm from '../../examples/control-section/ControlSection';
import ControlArrayForm from '../../examples/control-array/ControlArray';
import ComputedControlForm from '../../examples/computed-control/ComputedControl';
import MultiStepForm from '../../examples/multi-step/MultiStep';
import ErrorBoundary from '../error-boundry/ErrorBoundary';

interface ITest {
	bla: string;
}


const FormView = inject('formStore')(observer(({ formStore, name }: { formStore?: FormStore, name?: string }) => {
	console.log('render form view');

	const form = formStore.forms.get(name);

	if (!form) {
		return <span />;
	}

	return (
		<pre>{beautify(form.values, null, 2, 100)}</pre>
	);
}));

function FormRenderer({ formName }: { formName: string }) {
	function handleSubmit(values) {
		alert(JSON.stringify(values));
	}

	switch (formName) {
		case 'SimpleForm':
			return <SimpleForm onSubmit={handleSubmit} />;
		case 'SyncFieldValidation':
			return <SyncValidationForm onSubmit={handleSubmit} />;
		case 'ControlSection':
			return <ControlSectionForm onSubmit={handleSubmit} />;
		case 'ControlArray':
			return <ControlArrayForm onSubmit={handleSubmit} />;
		case 'ComputedControl':
			return <ComputedControlForm onSubmit={handleSubmit} />;
		case 'MultiStep':
			return <MultiStepForm onSubmit={handleSubmit} />;
		default:
			return <span />
	}
}


class ExampleOverview extends React.Component<any, any>{
	render() {
		const dir = this.props.match.params.dir;
		const formName = this.props.match.params.name;

		return (
			<div className="pageContent">
				<div>
					<ErrorBoundary type="documentation">
						<Document document={`docs/examples/${dir}/${formName}`} />
					</ErrorBoundary>
				</div>

				<div className="form-example">
					<FormRenderer formName={formName} />
				</div>

				<div>Values</div>
				<div>
					<FormView name={formName} />
				</div>
				<div>
					<ErrorBoundary type="code sample">
						<Code path={`${dir}/${formName}`} />
					</ErrorBoundary>
				</div>
			</div>
		)
	}
}


export default ExampleOverview;
