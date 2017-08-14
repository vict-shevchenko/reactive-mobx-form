import * as React from 'react';
import {reactiveMobxForm, Control, ControlArray, ControlSection} from 'reactive-mobx-form';


function Dishes({ fields }) {
	return (
		<main>
			{
				fields.map((key, index )=> (
					<div key={key}>
						<label>Dish #{`${index + 1}`}</label>
						<div>
							<Control name={index} component="input" type="text" />
						</div>
						<button type="button" onClick={() => fields.remove(index)}>Remove</button>
					</div>
				))
			}

			<button type="button" onClick={fields.add}>Add Dish</button>
		</main>
	)
}

function Person({ name, remove }) {
	return (
		<main>
			<div>
				<label>Person {name + 1}</label>
				<div />
				<button type="button" onClick={remove}>Remove Person</button>
			</div>
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

function Persons({fields}) {
	return (
		<section>
			{
				fields.map((key, index, fields) => (
					<ControlSection key={key} name={index} component={Person} remove={() => fields.remove(index)} />
				))
			}

			<button type="button" onClick={fields.add}>Add person</button>
		</section>
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