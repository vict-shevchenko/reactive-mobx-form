import * as React from 'react';
import {reactiveMobxForm, Control} from 'reactive-mobx-form';


class ContactForm extends React.Component {
	render() {
		const { submit, reset } = this.props;

		return (
			<form onSubmit={submit}>
				<h3>Simple Delivery Form</h3>
				<div>
					<label>First Name</label>
					<div>
						<Control name="firstName" component="input" type="text" placeholder="First Name" />
					</div>
				</div>
				<div>
					<label>Last Name</label>
					<div>
						<Control name="lastName" component="input" type="text"  placeholder="Last Name" />
					</div>
				</div>
				<div>
					<label>E-mail</label>
					<div>
						<Control name="email" component="input" type="email" placeholder="Email"/>
					</div>
				</div>
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
					<button type="submit">Submit</button>
					<button type="button" onClick={reset}>Reset</button>
				</section>
			</form>
		);
	}
}

const ContactFormReactive = reactiveMobxForm('contacts')(ContactForm);

export default ContactFormReactive;