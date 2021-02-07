// tslint:disable:variable-name
// tslint:disable:max-classes-per-file
// tslint:disable:max-line-length only-arrow-functions interface-name no-unused-expression

import * as React from 'react';
import { IBaseControlProps } from '../lib/ui/BaseControl';
import { IControlFormContext, IControlParentNameContext, withForm, withParentName } from '../lib/context';
import { IControlWithFieldContext, withField } from '../lib/ui/WithFieldHoc';
import { FieldSection } from '../lib/FieldSection';
import { Form } from '../lib/Form';
import { Control, reactiveMobxForm } from '../index';
import { FormStore } from '../lib/Store';
import { IReactiveMobxFormProps } from '../lib/createForm';
import { withFormValues } from '../index';

// tslint:disable-next-line:max-line-length
type IMyComp = IBaseControlProps & IControlFormContext & IControlParentNameContext & IControlWithFieldContext<FieldSection> & {
	bla: string;
};

interface IPlace {
	place: string;
}

// tslint:disable-next-line:max-classes-per-file
class MyComp<P> extends React.Component<P & IMyComp, any> {
	constructor(props: P & IMyComp) {
		super(props);
		const a = props;
	}

	render() {
		return (
			<div>
				<div>{this.props.form}</div>
				<div>{this.props.field}</div>
			</div>
		);
	}
}

// tslint:disable-next-line
const OurComp = <MyComp<IPlace>
	bla="test"
	name="test"
	component="sfds"
	form={new Form(v => v, {})}
	parentName="blaa"
	field={new FieldSection('test')}
	place="Kyiv"
/>;

const OurCompWithForm = withForm(MyComp);

const OurCompWithFormJSX = <OurCompWithForm
	bla="test"
	name="test"
	component="sfds"
	parentName="blaa"
	field={new FieldSection('test')}
/>;

const OurCompWithParentName = withParentName(OurCompWithForm);

const OurCompWithParentNameJSX = <OurCompWithParentName
	bla="test"
	name="test"
	component="sfds"
	field={new FieldSection('test')}
/>;

const OurCompWithField = withField(OurCompWithParentName, () => new FieldSection('test'));

const OurCompWithFieldJSX = (<OurCompWithField<IPlace>
	bla="test"
	name="test"
	component="sfds"
	place="Kyiv"
/>);
// tslint:disable-next-line

// tslint:disable-next-line:no-empty-interface
interface MyFormProps {
	myAdditionalProp: string;
}
interface MyFormValues {
	firstName: string;
}

class MyForm extends React.Component<MyFormProps & IReactiveMobxFormProps> {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<label htmlFor="">Name</label>
				<Control<IPlace> name="firstName" type="text" component="input" place="retw" />
			</div>
		);
	}
}

const ReactiveMyForm = reactiveMobxForm<MyFormProps, MyFormValues>('myform')(MyForm);

interface IAdditionalFormProps {
	myAdditionalProp: string;
}

function submitHandler(values) {
	return values;
}

class MyFormApp extends React.Component {
	render() {
		return (
			<div>
				<ReactiveMyForm
					onSubmit={submitHandler}
					schema={{}}
					formStore={new FormStore()}
					keepState={true}
					myAdditionalProp="test"
				/>
			</div>
		);
	}
}

const myFunc = a => {
	return a + 10;
};

const myFunc2 = a => {
	return a + 'hello';
};

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

interface IName {
	name: string;
}

interface IMyFunc3 extends IReactiveMobxFormProps, IName {

}
class MyFunc3 extends React.Component<IMyFunc3> {

	public render() {
		return (
			<div>test {this.props}</div>
		);
	}
}

// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
function someFunc(a: number): <P extends IName>(Func: React.ComponentType<P>) => React.ComponentType<Subtract<P, IName>> {

	const b = a + 10;

	return function <P extends IName>(Func: React.ComponentType<P>) {
		return class Bla extends React.Component<Subtract<P, IName>> {
			public render() {
				return (
					<Func name="dsfssd" />
				);
			}
		};
	};
}

const enhancer = someFunc(20);

const MyAnotherFunction = enhancer(MyFunc3);

class MyOtherFormApp extends React.Component {
	public render() {
		return (
			<div>
				<MyAnotherFunction onSubmit={submitHandler} name={} vlad={} />
				<MyFunc3
					onSubmit={v => v}
					bla="sdfasd"
				/>
			</div>
		);
	}
}

///////////////  withFormValues HOC //////////////
interface IPassedInValues {
	phone: string;
}

class MyFormWithoutValues extends React.Component<IReactiveMobxFormProps & IPassedInValues>  {
	constructor(props) {
		super(props);
	}

	public render() {
		// all props from IReactiveMobxFormProps are here
		// this.props.phone is avaliable here
		return (
			<div>
				<label htmlFor="">Name</label>
				<Control name="phone" type="text" component="input" />
			</div>
		);
	}
}

const FormWithValues = withFormValues<IPassedInValues, {}>('myFormWithoutValues', v => ({ phone: v.phone as string }))(MyFormWithoutValues);

////////////// END /////////////

////////////// TS BUG With HOC Typing ///////////

interface NameInterface {
	name: string;
}

function withName<OriginalProps extends object>(Component: React.ComponentType<OriginalProps & NameInterface>) {
	return function (props: OriginalProps) {
		return (
			<Component
				{...props}
				name={'John'}
			/>
		);
	};
}

const UnNamed_1: React.SFC<NameInterface> = ({ name }) => (<p>My name is {name}</p>);
const Named_1 = withName(UnNamed_1);
<Named_1 /> // Property 'name' is missing in type '{}' but required in type 'NameInterface'.ts(2741)


interface UnNamedPropsInterface extends NameInterface {
	age: number;
}
const UnNamed_2: React.SFC<UnNamedPropsInterface> = ({ name, age }) => (<p>My name is {name} and {age}</p>);
const Named_2 = withName(UnNamed_2);
<Named_2 age={30} /> // Property 'name' is missing in type '{ age: number; }' but required in type 'UnNamedPropsInterface'.ts(2741)


type UnNamedType = NameInterface;
const UnNamed_3: React.SFC<UnNamedType> = ({ name }) => (<p>My name is {name}</p>);
const Named_3 = withName(UnNamed_3);
<Named_3 /> // Property 'name' is missing in type '{}' but required in type 'NameInterface'.ts(2741)


type UnNamedType_2 = NameInterface & { age: number };
const UnNamed_4: React.SFC<UnNamedType_2> = ({ name, age }) => (<p>My name is {name} and {age}</p>);
const Named_4 = withName(UnNamed_4);
<Named_4 age={30} /> // All OK


///////////////////////////////////////////////////
