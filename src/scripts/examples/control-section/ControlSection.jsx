import * as React from 'react';
import {reactiveMobxForm, Control, ControlSection} from 'reactive-mobx-form';


function Person() {
	return (
		<main>
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
		</main>
	);
}

class ContactForm extends React.Component {
	render() {
		const { submit, reset, submitting, valid } = this.props;

		return (
			<form onSubmit={submit}>
				<h3>Simple Delivery Form</h3>

				<h2>Seller</h2>
				<ControlSection name="seller" component={Person}/>

				<h2>Buyer</h2>
				<ControlSection name="buyer" component={Person}/>

				<section>
					<button type="submit">Submit</button>
					<button type="button" onClick={reset}>Reset</button>
				</section>
			</form>
		);
	}
}

const ContactFormReactive = reactiveMobxForm('ControlSection')(ContactForm);

export default ContactFormReactive;
