import React from 'react';
import { observer, inject } from 'mobx-react';
import {reactiveMobxForm, Control, ControlArray, ControlSection} from 'reactive-mobx-form';


const Location = () => (
	<ControlSection name="address" component={Address} />
);

const Address = inject('appState')(observer(({appState}) =>
	<div>
		<div>
			<label htmlFor="city">City</label>
			<Control name="city" component="input" type="text" />
		</div>
		{appState.showStreet ? (
			<div>
				<label htmlFor="street">Street</label>
				<Control name="street" component="input" type="text" alt="some text"  label="FN"/>
			</div>
		) : ''}
		<button type="button" onClick={() => appState.showStreet = !appState.showStreet}> hide street</button>
	</div>
));

const Person = ({fields, name}) => (
	<div>
		<div>
			<label htmlFor="firstName">First Name</label>
			<Control name="firstName" component="input" type="text" alt="some text"  label="FN" rules="required"/>
		</div>
		<div>
			<label htmlFor="lastName">Last Name</label>
			<Control name="lastName" component="input" type="text" alt="some text"  label="FN"/>
		</div>
		<ControlArray name="hobbies" component={Hobbies} />
		<button type="button" onClick={() => fields.remove(name)}> Remove</button>
	</div>
);


const Persons = ({ fields }) => (
	<div>
		{fields.map((el, index, fields) => (<ControlSection key={el} name={index} component={Person} fields={fields} />))}
		----<br/>
		{fields.map((el, index)  => <span key={el}>{`elem-${el} - idx-${index}`}, </span>)}<br/>

		<button onClick={fields.add} type="button">Add more persons</button>
		<button onClick={() => fields.swap(1,3)} type="button">Reorder</button>
	</div>

);

const Hobbies = ({fields}) => (
	<div>
		<label>Hobbies</label>
		<button onClick={fields.add} type="button">Add Hobbie</button>
		<div>
			{fields.map((el, index) => (<Control key={el} name={index} component="input" type="text"/>))}
		</div>
	</div>
);

@inject('appState')
@observer
class ContactForm extends React.Component {
	myCustomSubmit(event) {
		this.props.submit(event).then(
			(result) => console.log(`Result: ${result}`), 
			(error) => console.log(`Error: ${error}`));
	}

	render() {
		const { reset, submitting, submitError, valid, dirty } = this.props;
		return (
			<form onSubmit={this.myCustomSubmit.bind(this)}>
			<ControlArray name="persons" component={Persons} />
				<hr />
				<ControlSection name="location" component={Location} />
				<div>
					<label htmlFor="nope">Age</label>
					<div>
						<Control name="age" type="number" component="input" />
					</div>
				</div>
				<div>
					<label htmlFor="acceptTerms">Accept terms</label>
					<Control name="acceptTerms" component="input" type="checkbox" className="my-checkbox-class"/>
				</div>
				<hr/>
				Form Dirty --- {`${dirty}`} <br/>
				Form Valid - - {`${valid}`} <br/>
				Submit Error  - - {`${JSON.stringify(submitError)}`} <br/>
				<button type="submit">Submit</button>  is Submitting - {`${submitting}`} <br/>
				<button onClick={reset} type="button">Reset</button>
			</form>
		);
	}
}

const ContactFormReactive = reactiveMobxForm('contacts', {
		schema: {
			'lastName': ['shevchenko', 'same:firstName'],
			'email': ['', 'required|email'],
			'acceptTerms': [true],
			'favoriteFilm': ['dieHardwerwe'],
			'sex':[''],
			'job': [''],
			'location.address.city': ['Kyiv', 'required'],
			'perons': [[], 'array'],
			'age': 1
		},
		validator: {
			errorMessages: {
				'required.location.address.city': 'Yor forgot to specify a :attribute'
			},
			attributeNames: {
				'location.address.city' : 'Your city',
				'persons[0].firstName' : 'Имя первого пользователя'
			}
		}
	}
	)(ContactForm);

export default ContactFormReactive;
