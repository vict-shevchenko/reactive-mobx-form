import React from 'react';
import {reactiveMobxForm, Control} from 'reactive-mobx-form';


class ContactForm extends React.Component {
	render() {
		const { submit, reset, submitting, isValid } = this.props;
		return (
			<form onSubmit={submit}>
				<div>
					<label htmlFor="firstName">First Name</label>
					<Control name="firstName" component="input" type="text" alt="some text" />
				</div>
				<div>
					<label htmlFor="lastName">Last Name</label>
					<Control name="lastName" component="input" type="text"/>
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