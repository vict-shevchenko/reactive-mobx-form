import * as React from 'react';
import { reactiveMobxForm, Control, ControlSection } from 'reactive-mobx-form';

class ContactForm extends React.Component {
	render() {
		const { submit, next, previous, step } = this.props;

		return (
			<form onSubmit={submit}>
				<h3>Multiple Step Form</h3>

				{step === 1 && <NameFormSection />}
				{step === 2 && <EmailFormSection />}
				{step === 3 && <AddressFormSection />}

				<section>
					{step > 1 && <button type="button" onClick={previous}>Back</button>}
					{step < 3 && <button type="button" onClick={next}>Next</button>}
					{step === 3 && <button type="submit">Submit</button>}
				</section>
			</form>
		);
	}
}

const NameFormSection = () => (
	<React.Fragment>
		<div>
			<label>First Name</label>
			<div>
				<Control name="firstName" component="input" type="text" placeholder="First Name" />
			</div>
		</div>
		<div>
			<label>Last Name</label>
			<div>
				<Control name="lastName" component="input" type="text" placeholder="Last Name" />
			</div>
		</div>
	</React.Fragment>
)

const EmailFormSection = () => (
	<div>
		<label>E-mail</label>
		<div>
			<Control name="email" component="input" type="email" placeholder="Email" />
		</div>
	</div>
)

const AddressFormSection = () => (
	<ControlSection name="address" component={Address} />
)

const Address = () => (
	<React.Fragment>
		<div>
			<label>City</label>
			<div>
				<Control name="city" component="input" type="text" placeholder="City" />
			</div>
		</div>
		<div>
			<label>Street</label>
			<div>
				<Control name="street" component="input" type="text" placeholder="Street" />
			</div>
		</div>
	</React.Fragment>
);

const ContactFormReactive = reactiveMobxForm('MultiStep')(ContactForm);

export default ContactFormReactive;
