import React from 'react';
import {reactiveMobxForm, Field} from 'reactive-mobx-form';


class ContactForm extends React.Component {
	render() {
		const { submit, reset, submitting, isValid } = this.props;
		return (
			<form onSubmit={submit}>
				<div>
					<label htmlFor="firstName">First Name</label>
					<Field name="firstName" component="input" type="text" alt="some text" />
				</div>
				<div>
					<label htmlFor="lastName">Last Name</label>
					<Field name="lastName" component="input" type="text"/>
				</div>
				<div>
					<label htmlFor="photo">Last Name</label>
					<Field name="photo" component="input" type="file"/>
				</div>
				<div>
					<label htmlFor="nickName">Nick Name</label>
					<Field name="nickName" component="input" type="text"/>
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

const ContactFormReactive = reactiveMobxForm('contacts')(ContactForm);

export default ContactFormReactive;