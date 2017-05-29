import React, {Component} from 'react';
import {reactiveMobxForm, Control} from 'reactive-mobx-form';


function ContactFormTextField({ input, meta, type, placeholder, label }) {
	return (
		<div>
			<label>{label}</label>
			<div>
				<input {...input} type={type} placeholder={placeholder}/>
				{meta.touched && !meta.focused && !meta.valid ? <div className="err">{meta.errors[0]}</div> : ''}
			</div>
		</div>
	);
}


class ContactForm extends Component {
	render() {
		const { submit, reset, submitting, isValid } = this.props;

		return (
			<form onSubmit={submit}>
				<h3>Simple Delivery Form with Sync Field Validation</h3>
				<Control name="firstName" component={ContactFormTextField} type="text"  placeholder="Last Name" label="First Name" />
				<Control name="lastName"  component={ContactFormTextField} type="text"  placeholder="Last Name" label="Last Name" />
				<Control name="email"     component={ContactFormTextField} type="email" placeholder="Email"     label="Email" />

				<div>
					<label>Delivery time</label>
					<div>
						<label><Control name="time" component="input" type="radio" value="fast"/>Fast</label>
						<label><Control name="time" component="input" type="radio" value="standard"/>Standard</label>
					</div>
				</div>
				<div>
					<label>Delivery address</label>
					<div>
						<Control name="address" component="select">
							<option/>
							<option value="home">Home</option>
							<option value="office">Office</option>
						</Control>
					</div>
				</div>
				<div>
					<label htmlFor="acceptTerms">Accept terms</label>
					<div>
						<Control name="acceptTerms" component="input" type="checkbox"/>
					</div>
				</div>
				<div>
					<label>Notes</label>
					<div>
						<Control name="notes" component="textarea" rows="4"/>
					</div>
				</div>

				<section>
					<button type="submit" disabled={!isValid}>Submit</button>
					<button type="button" onClick={reset}>Reset</button>
				</section>
			</form>
		);
	}
}

const ContactFormReactive = reactiveMobxForm('contacts', {
	firstName: ['', 'required'],
	lastName : ['', 'required'],
	email    : ['', 'required|email'],
})(ContactForm);

export default ContactFormReactive;