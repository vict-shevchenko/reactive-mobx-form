import React, { Component } from 'react';
import {reactiveMobxForm, Control, ControlArray} from 'reactive-mobx-form';

const RenderField = ({input, meta: {dirty, valid, errors}, label, placeholder, type}) => (
	<div style={{backgroundColor: (valid ? 'lightgreen' : 'pink')}}>
		<label>{label}</label>
		<div>
			<input {...input} placeholder={placeholder} type={type}/>
		</div>
		{dirty ? (valid ? 'valid' : errors[0]) : ''}
	</div>
);


const Persons = (props) => (
	<div>
		<div>
			<label htmlFor="firstName">First Name</label>
			<Control name={`${props.name}[0]firstName`} component="input" type="text" alt="some text"  label="FN"/>
		</div>
		<div>
			<label htmlFor="lastName">Last Name</label>
			<Control name={`${props.name}[0]lastName`} component="input" type="text" alt="some text"  label="FN"/>
		</div>
		<ControlArray name={`${props.name}[0]hobbies`} component={Hobbies} />
	</div>

);

const Hobbies = (props) => (
	<div>
		<label>Hobbies</label>
		<div>
			<Control name={`${props.name}[0]`} component="input" type="text"/>
		</div>
	</div>
);

class ContactForm extends Component {
	render() {
		const { submit, reset, submitting, valid, dirty } = this.props;
		return (
			<form onSubmit={submit}>
				{/*<div>
					<label htmlFor="firstName">First Name</label>
					<Control name="firstName" component={RenderField} type="text" alt="some text"  label="FN"/>
				</div>
				<div>
					<label htmlFor="lastName">Last Name</label>
					<Control name="lastName" component={RenderField} type="text" label="LN"/>
				</div>
				<div>
					<label htmlFor="photo">Last Name</label>
					<Control name="photo" component="input" type="file"/>
				</div>
				<div>
					<label htmlFor="nickName">Nick Name</label>
					<Control name="nickName" component="input" type="text"/>
				</div>
				<div>
					<label htmlFor="age">Age</label>
					<Control name="age" component={RenderField} type="number"/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<Control name="email" component={RenderField} type="email" label="Email"/>
				</div>
				<div>
					<label htmlFor="acceptTerms">Accept terms</label>
					<Control name="acceptTerms" component="input" type="checkbox"/>
				</div>
				<div>
					<label htmlFor="Faivorite film">Favourite film</label>
					<Control name="favoriteFilm" component="select">
						<option/>
						<option value="terminator">Terminator</option>
						<option value="dieHard">Die Hard</option>
						<option value="Robocop">Robocop</option>
					</Control>
				</div>
				<div>
					<label>Sex</label>
					<div>
						<label><Control name="sex" component="input" type="radio" value="male"/> Male</label>
						<label><Control name="sex" component="input" type="radio" value="female"/> Female</label>
					</div>
				</div>*/}
				<ControlArray name="persons" component={Persons} />
				<hr />

				Form Dirty --- {`${dirty}`}
				Form Valid - - {`${valid}`} <br/>
				<button type="submit">Submit</button>  is Submitting - {`${submitting}`} <br/>
				<button onClick={reset}>Reset</button>
			</form>
		);
	}
}

const ContactFormReactive = reactiveMobxForm('contacts',
	{
		'lastName': ['shevchenko', 'same:firstName'],
		'email': ['', 'required|email'],
		'age': [25, 'numeric|between:10,30'],
		'acceptTerms': [true],
		'favoriteFilm': ['dieHardwerwe'],
		'sex':[''],
		'job': [''] // todo: handle cases where field is absent but schema property exist
	})(ContactForm);

export default ContactFormReactive;