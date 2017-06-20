import * as React from 'react';
import {reactiveMobxForm, Control, ControlArray, ControlSection} from 'reactive-mobx-form';


function Dishes({fields, push}) {
	return (
		<main>
			{
				fields.map(index => (
					<Control name={index} coponent="input" type="text"/>
				))
			}

			<button type="button" onClick={push}>Add person</button>
		</main>
	)
}

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
			<ControlArray name="dishes" component={Dishes}/>
		</main>
	);
}

function Persons({fields, push}) {
	return (
		<main>
			{
				fields.map(index => (
					<ControlSection name={index} coponent={Person}/>
				))
			}

			<button type="button" onClick={push}>Add person</button>
		</main>
	);
}

class ContactForm extends React.Component {
	render() {
		const { submit, reset, submitting, valid } = this.props;

		return (
			<form onSubmit={submit}>
				<h3>Restaurant food delivery</h3>

				<ControlArray name="persons" component={Persons} />

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