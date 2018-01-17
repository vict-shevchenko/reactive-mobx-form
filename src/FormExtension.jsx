import React, { Component } from "react";
import { reactiveMobxForm, Control } from "reactive-mobx-form";

function FormExtension() {
	return (
		<div>
			<Control type="text" component="input" name="river"/>
		</div>
	)
}

const ReactiveFormExtension = reactiveMobxForm('contacts', {
	destroyFormStateOnUnmount: false,
	destroyControlStateOnUnmount: false,

})(FormExtension);

export default ReactiveFormExtension;
