import * as React from 'react';
import {inject, observer} from 'mobx-react'
import { FormStore } from 'reactive-mobx-form';
import * as marked from 'marked';
import * as Prism  from '../../utils/prism'
import * as beautify from 'json-beautify';

import SimpleForm from '../../examples/simple/SimpleForm';
import SyncValidationForm from '../../examples/sync-validation/SyncFieldValidation';
import ControlSectionForm from '../../examples/control-section/ControlSection';



const prettify = markdown =>
	markdown.replace(/```(?:javascript|js)([\s\S]+?)```/g,
		(match, code) =>
			`<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(code, Prism.languages.jsx)}</code></pre>`);

const FormView = inject('formStore')(observer(({formStore}:{formStore?: FormStore}) => <pre>{beautify(formStore.forms.contacts.values, null, 2, 100)}</pre>));


const ExampleOverview = observer(({name, document }:{name?:string, document?:any}) => {

	function handleSubmit(form) {
		alert(JSON.stringify(form));
	}

	return (
		<div>
			<div>
				{document.state === 'fulfilled' ? <div dangerouslySetInnerHTML={{__html:marked(prettify(document.value[0]))}} /> : ''}
			</div>
			<div className="form-example">
				{name === 'SimpleForm' ? <SimpleForm onSubmit={handleSubmit}/> : ''}
				{name === 'SyncFieldValidation' ? <SyncValidationForm onSubmit={handleSubmit}/> : ''}
				{name === 'ControlSection' ? <ControlSectionForm onSubmit={handleSubmit}/> : ''}
			</div>
			<div>Values</div>
			<div>
				<FormView />
			</div>
			<div>
				{document.state === 'fulfilled' ? <div dangerouslySetInnerHTML={{__html:marked(`<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(document.value[1], Prism.languages.jsx)}</code></pre>`)}} /> : ''}
			</div>
		</div>
	)
});


export default ExampleOverview;