import React, { Component, createElement, PropTypes } from 'react';
import { inject } from 'mobx-react';

export function mobxReactiveForm(formName: string, fields:any) {
	var form = {fields: fields}

	return wrappedForm => {
		@inject('formState')
		class MobxReactiveForm extends Component<{formState: any}, any> {
			static childContextTypes = {
				_mobxReactiveForm: PropTypes.object.isRequired
			}

			getChildContext() {
				return {_mobxReactiveForm: form};
			}

			componentWillMount() {
				this.props.formState.registerForm(formName, form)
			}

			render() {
				return createElement(wrappedForm, {})
			}
		}

		return MobxReactiveForm;
	}
}


/*
*
* import React from 'react';
 import {MobxReactiveForm} from "./Form";

 interface registerFormParameters {
 form: string
 }

 interface registerFormFieldsDefinition {
 [propName: string]: [string, string];
 }

 export function registerForm(parameters:registerFormParameters, fields:registerFormFieldsDefinition) {
 //todo: verify 'contextStore'

 if (!contextStore.forms) {
 contextStore.forms = {};
 }

 contextStore.forms[parameters.form] = new MobxReactiveForm(fields)

 return function (userForm) {
 return (
 <div className="meForm">{userForm}</div>
 )
 }
 }

 * */