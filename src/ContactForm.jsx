import React, { Component } from 'react';
import {reactiveMobxForm, Field} from 'reactive-mobx-form';

const RenderField = ({input, meta: {dirty, valid}, label, placeholder, type}) => (
	<div style={{backgroundColor: (valid ? 'lightgreen' : 'pink')}}>
		<label>{label}</label>
		<div>
			<input {...input} placeholder={placeholder} type={type}/>
		</div>
		{dirty ? (valid ? 'valid' : 'invalid') : ''}
	</div>
);

class ContactForm extends Component {
	render() {
		const { submit, reset, submitting, isValid } = this.props;
		return (
			<form onSubmit={submit}>
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
					<label htmlFor="age">Age</label>
					<Field name="age" component={RenderField} type="number"/>
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
				<hr />

				Form Valid - - {`${isValid}`} <br/>
				<button type="submit">Submit</button>  is Submitting - {`${submitting}`} <br/>
				<button onClick={reset}>Reset</button>
			</form>
		);
	}
}

const ContactFormReactive = reactiveMobxForm('contacts',
	{
		'firstName': 'viktor',
		'lastName': ['shevchenko', ''],
		'email': ['', 'required|email'],
		'age': [25, 'numeric'],
		'acceptTerms': [true],
		'favoriteFilm': ['dieHardwerwe'],
		'sex':[''],
	})(ContactForm);

export default ContactFormReactive;