import React, { Component } from 'react';
import {mobxReactiveForm} from 'mobx-reactive-form';
import {Field} from 'mobx-reactive-form';

class ContactForm extends Component {
	render() {
		const { handleSubmit } = this.props;
		return (
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="firstName">First Name</label>
					<Field name="firstName" component="input" />
				</div>
				<div>
					<label htmlFor="lastName">Last Name</label>
					<input name="lastName" type="text"/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<input name="email" type="email"/>
				</div>
				<button type="submit">Submit</button>
			</form>
		);
	}
}

const ContactFormReactive = mobxReactiveForm('contacts', {'firstName': ['viktor', ''], 'lastName': ['shevchenko', '']})(ContactForm);

export default ContactFormReactive;