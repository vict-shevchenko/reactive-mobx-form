import * as React from 'react';
import { IBaseControlProps } from '../lib/ui/BaseControl';
import { IControlFormContext, IControlParentNameContext, withForm, withParentName } from '../lib/context';
import { IControlWithFieldContext, withField } from '../lib/ui/WithFieldHoc';
import { FieldSection } from '../lib/FieldSection';
import { Form } from '../lib/Form';
import { Control, reactiveMobxForm } from '../index';
import { FormStore } from '../lib/Store';
import { IFormProps, IInjectedFormProps } from '../lib/createForm';

// tslint:disable-next-line:max-line-length
interface IMyComp extends IBaseControlProps, IControlFormContext, IControlParentNameContext, IControlWithFieldContext<FieldSection> {
	bla: string;
}

interface IPlace {
	place: string;
}

// tslint:disable-next-line:max-classes-per-file
class MyComp<P> extends React.Component<P & IMyComp, any> {
	constructor(props: P & IMyComp) {
		super(props);
		const a = props;
	}

	public render() {
		return (
			<div>{this.props.field}</div>
		);
	}
}

// tslint:disable-next-line
const OurComp = <MyComp<IPlace>
	bla="test"
	name="test"
	component="sfds"
	__formContext={{ form: new Form({}, {}, {}), destroyControlStateOnUnmount: false }}
	__parentNameContext="blaa"
	field={new FieldSection('test')}
	place="Kyiv"
/>;

const OurCompWithForm = withForm(MyComp);

const OurCompWithFormJSX = <OurCompWithForm<IPlace>
	bla="test"
	name="test"
	component="sfds"
	__parentNameContext="blaa"
	field={new FieldSection('test')}
	place="Kyiv"
/>;

const OurCompWithParentName = withParentName(OurCompWithForm);

const OurCompWithParentNameJSX = <OurCompWithParentName<IPlace>
	bla="test"
	name="test"
	component="sfds"
	field={new FieldSection('test')}
	place="Kyiv"
/>;

const OurCompWithField = withField(OurCompWithParentName, () => new FieldSection('test'));

const OurCompWithFieldJSX = (<OurCompWithField<IPlace>
	bla="test"
	name="test"
	component="sfds"
	place="Kyiv"
/>);
// tslint:disable-next-line

class MyForm extends React.Component<IInjectedFormProps & IAdditionalFormProps> {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<label htmlFor="">Name</label>
				<Control name="firstName" type="text" component="input" />
			</div>
		);
	}
};

const ReactiveMyForm = reactiveMobxForm('myform')(MyForm);


interface IAdditionalFormProps {
	myAdditionalProp: string;
}

class MyFormApp extends React.Component {
	render() {
		return (
			<div>
				<ReactiveMyForm
					onSubmit={v => v}
					schema={{}}
					bla="sdfsadfasdf"
				/>
			</div>
		);
	}
}


const myFunc = (a) => {
	return a + 10;
}

const myFunc2= (a) => {
	return a + 'hello';
}

interface IInnerComponent {
	name: string;
}

class MyFunc3 extends React.Component<IFormProps> {

	render() {
		return (
			<div>test</div>
		)
	}
}

function someFunc(a: number) : (Func: React.ComponentType<IInnerComponent>) => React.ComponentType<IPlace> {

	const b = a + 10;

	return function(Func: React.ComponentType<IInnerComponent>) {
		return class Bla extends React.Component<IPlace> {
			render() {
				return (
					<Func name="dsfssd" />
				);
			}
		};
	}
}

const enhancer = someFunc(20);

const MyAnotherFunction = enhancer(MyFunc3);


class MyOtherFormApp extends React.Component {
	render() {
		return (
			<div>
				<MyAnotherFunction place="sdfs"/>
				<MyFunc3
					onSubmit={v => v}
					bla="sdfasd"
				/>
			</div>
		);
	}
}
