import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {reactiveMobxForm, Control, ControlArray, ControlSection, ComputedControl} from 'reactive-mobx-form';

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

/* class Tags extends React.Component {
	constructor(props) {
		super(props);

		console.log('Tags.constructor');
	}

	componentWillUnmount() {
		console.log('Tags.componentWillUnmount')
	}

	render() {
		console.log('Tags.render')
		return (
			<div>
				<h1>Tags</h1>
				<Control name={0} component="input" type="text" />
			</div>
		)
	}
} */

const RenderTags = (p) => <Tags {...p} />

@inject('appState')
@observer
class ContactForm extends React.Component {
	myCustomSubmit(event) {
		this.props.submit(event).then(
			(result) => console.log(`Result: ${result}`), 
			(error) => console.log(`Error: ${error}`));
	}

	render() {
		const { submit, reset, submitting, submitError, valid, dirty, paramToForm } = this.props;
		return (
			<form onSubmit={this.myCustomSubmit.bind(this)}>
			{/* 	<div>
					<label htmlFor="firstName">First Name</label>
					<Control name="firstName" component={RenderField} type="text" alt="some text"  label="FN"/>
				</div>
				<div>
					<label htmlFor="lastName">Last Name</label>
					<Control name="lastName" component={RenderField} type="text" label="LN"/>
				</div>
			 <div>
					<label htmlFor="photo">Photo</label>
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
				</div> */}
			{/* 	<div>
					<label>Sex</label>
					<div>
						<label><Control name="sex" component="input" type="radio" value="male"/> Male</label>
						<label><Control name="sex" component="input" type="radio" value="female"/> Female</label>
					</div>
				</div> */}
			<ControlArray name="persons" component={Persons} />
		{/* 	<div>
				<h1>Paramter to Form</h1>
				{paramToForm}
			</div> */}
				<hr />

				<ControlSection name="location" component={Location} />

				{/* <div>
					<label>Person Age</label>
					<div>
						<Control name="age" component="input" type="text" rules={this.props.appState.simpleRules ? 'required' : 'required|numeric|between:10,30'}/>

						<button type="button" onClick={() => this.props.appState.simpleRules = !this.props.appState.simpleRules}> Change rules</button>
					</div>
				</div> */}

				{/* <div>
					<label>Sex</label>
					<div>
						<label><Control name="sex" component="input" type="radio" value="male"/> Male</label>
						<label><Control name="sex" component="input" type="radio" value="female"/> Female</label>
					</div>
				</div> */}

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

		{/* 		<div>
					<label htmlFor="acceptTerms">Conclusion</label>
					<ComputedControl name="conclusion" type="text" component="input" compute={(values) => values.age > 30 ? 'too Old' : 'to Young'}/>
				</div> */}

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
