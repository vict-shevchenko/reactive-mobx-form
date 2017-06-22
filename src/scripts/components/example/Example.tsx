import * as React from 'react';
import { Route } from 'react-router-dom';
import {inject, observer} from 'mobx-react'
import { FormStore } from 'reactive-mobx-form';
import * as marked from 'marked';
import * as Prism  from '../../utils/prism'
import * as beautify from 'json-beautify';

import Document from '../document/Document';

import SimpleForm from '../../examples/simple/SimpleForm';
import SyncValidationForm from '../../examples/sync-validation/SyncFieldValidation';
import ControlSectionForm from '../../examples/control-section/ControlSection';
import ControlArrayForm from '../../examples/control-array/ControlArray';
import {renderToStaticMarkup} from "react-dom/server";



const prettify = markdown =>
	markdown.replace(/```(?:javascript|js)([\s\S]+?)```/g,
		(match, code) =>
			`<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(code, Prism.languages.jsx)}</code></pre>`);

const FormView = inject('formStore')(observer(({formStore}:{formStore?: FormStore}) => {
	console.log('render form view');

	debugger;

	const form = formStore.forms.get('contacts');

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
	constructor() {
		super();
	}

	render() {
		const dir = this.props.match.params.dir;
		const formName = this.props.match.params.name;

		return (
			<div>
				<div>
					<Document document={`docs/examples/${dir}/${formName}`} />
				</div>

				<div className="form-example">
					<FormRenderer formName={formName} />
				</div>

				<div>Values</div>
				<div>
					<FormView />
				</div>
				{/*<div>
				 {document.state === 'fulfilled' ? <div dangerouslySetInnerHTML={{__html:marked(`<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(document.value[1], Prism.languages.jsx)}</code></pre>`)}} /> : ''}
				 </div>*/}
			</div>
		)
	}
}


export default ExampleOverview;