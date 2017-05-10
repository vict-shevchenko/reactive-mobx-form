import React, { Component } from 'react';
import {mobxReactiveForm} from 'mobx-reactive-form';
import {Field} from 'mobx-reactive-form';

const RenderField = ({input, meta: {dirty, valid}, label, placeholder, type}) => (
	<div style={{backgroundColor:'lightgreen'}}>
		<label>{label}</label>
		<div>
			<input {...input} placeholder={placeholder} type={type}/>
		</div>
		{dirty ? (valid ? 'valid' : 'invalid') : ''}
	</div>
);

class ContactForm extends Component {
	render() {
		const { handleSubmit } = this.props;
		return (
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="firstName">First Name</label>
					<Field name="firstName" component="input" type="text" />
				</div>
				<div>
					<label htmlFor="lastName">Last Name</label>
					<Field name="lastName" component="input" type="text"/>
				</div>
				<div>
					<label htmlFor="nickName">Nick Name</label>
					<Field name="nickName" component="input" type="text"/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<Field name="email" component={RenderField} type="email" label="Email"/>
				</div>
				<div>
					<label htmlFor="acceptTerms">Accept terms</label>
					<Field name="acceptTerms" component="input" type="checkbox"/>
				</div>
				<div>
					<label htmlFor="Faivorite film">Favourite film</label>
					<Field name="favoriteFilm" component="select">
						<option/>
						<option value="terminator">Terminator</option>
						<option value="dieHard">Die Hard</option>
						<option value="Robocop">Robocop</option>
					</Field>
				</div>
				<div>
					<label>Sex</label>
					<div>
						<label><Field name="sex" component="input" type="radio" value="male"/> Male</label>
						<label><Field name="sex" component="input" type="radio" value="female"/> Female</label>
					</div>
				</div>

				<button type="submit">Submit</button>
			</form>
		);
	}
}

const ContactFormReactive = mobxReactiveForm('contacts',
	{
		'firstName': 'viktor',
		'lastName': ['shevchenko', ''],
		'email': ['', 'required|email'],
		'acceptTerms': [true],
		'favoriteFilm': ['dieHardwerwe'],
		'sex':[''],
	})(ContactForm);

export default ContactFormReactive;