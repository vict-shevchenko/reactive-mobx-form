import * as React from 'react';
import {inject, observer} from 'mobx-react'
import { FormStore } from 'reactive-mobx-form';
import * as beautify from 'json-beautify';

import Document from '../document/Document';
import Code from '../code/Code';

import SimpleForm from '../../examples/simple/SimpleForm';
import SyncValidationForm from '../../examples/sync-validation/SyncFieldValidation';
import ControlSectionForm from '../../examples/control-section/ControlSection';
import ControlArrayForm from '../../examples/control-array/ControlArray';


const FormView = inject('formStore')(observer(({ formStore, name }:{ formStore?: FormStore, name?: string }) => {
	console.log('render form view');

	const form = formStore.forms.get(name);

	if (!form) {
		return <span />;
	}

	return (
		<pre>{beautify(form.values, null, 2, 100)}</pre>
	);
}));

function FormRenderer({ formName }: {formName: string}) {
	function handleSubmit(form) {
		alert(JSON.stringify(form));
	}

	switch (formName) {
		case 'SimpleForm':
			return <SimpleForm onSubmit={handleSubmit}/>;
		case 'SyncFieldValidation':
			return <SyncValidationForm onSubmit={handleSubmit}/>;
		case 'ControlSection':
			return  <ControlSectionForm onSubmit={handleSubmit}/>;
		case 'ControlArray':
			return <ControlArrayForm onSubmit={handleSubmit}/>;
		default:
			return <span/>
	}
}


class ExampleOverview extends React.Component<any, any>{
	render() {
		const dir = this.props.match.params.dir;
		const formName = this.props.match.params.name;

		return (
			<div className="pageContent">
				<div>
					<Document document={`docs/examples/${dir}/${formName}`} />
				</div>

				<div className="form-example">
					<FormRenderer formName={formName} />
				</div>

				<div>Values</div>
				<div>
					<FormView name={formName}/>
				</div>
				<div>
					<Code path={`${dir}/${formName}`} />
				</div>
			</div>
		)
	}
}


export default ExampleOverview;
