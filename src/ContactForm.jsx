import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {reactiveMobxForm, Control, ControlArray, ControlSection} from 'reactive-mobx-form';

const RenderField = ({input, meta: {dirty, valid, errors}, label, placeholder, type}) => (
	<div style={{backgroundColor: (valid ? 'lightgreen' : 'pink')}}>
		<label>{label}</label>
		<div>
			<input {...input} placeholder={placeholder} type={type}/>
		</div>
		{dirty ? (valid ? 'valid' : errors[0]) : ''}
	</div>
);

const Location = (props) => (
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

class ContactForm extends Component {
	render() {
		const { submit, reset, submitting, submitError, valid, dirty } = this.props;
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

				<ControlSection name="location" component={Location} />

				<div>
					<label>Sex</label>
					<div>
						<label><Control name="sex" component="input" type="radio" value="male"/> Male</label>
						<label><Control name="sex" component="input" type="radio" value="female"/> Female</label>
					</div>
				</div>

				Form Dirty --- {`${dirty}`} <br/>
				Form Valid - - {`${valid}`} <br/>
				Submit Error  - - {`${submitError}`} <br/>
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
			'age': [25, 'numeric|between:10,30'],
			'acceptTerms': [true],
			'favoriteFilm': ['dieHardwerwe'],
			'sex':[''],
			'job': [''],
			'location.address.city': ['Kyiv', 'required'],
			'perons': [[], 'array']
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