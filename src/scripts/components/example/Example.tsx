import React from 'react';
import {inject, observer} from 'mobx-react'
import { FormStore } from 'reactive-mobx-form';
import * as marked from 'marked';
import * as Prism from '../../utils/prism'
import * as beautify from 'json-beautify';

import SimpleForm from '../../examples/simple/SimpleForm'

import {ViewStore} from "../../store/ViewStore";



const FormView = inject('formStore')(observer(({formStore}:{formStore?: FormStore}) => <pre>{beautify(formStore.forms.contacts.values, null, 2, 100)}</pre>));


const ExampleOverview = inject('formStore')(observer(({ formStore, name }:{formStore?: FormStore, name?:string}) => {

	function handleSubmit(form) {
		alert(JSON.stringify(form));
	}


	return (
		<div>
			<div>Form</div>
			<div className="form-example">
				{name === 'simpleForm' ? <SimpleForm onSubmit={handleSubmit}/> : ''}
			</div>
			<div>Values</div>
			<div>
				<FormView />
			</div>
		</div>
	)
}));


export default ExampleOverview;