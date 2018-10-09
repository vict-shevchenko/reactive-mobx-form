import * as React from 'react';
import { IBaseControlProps } from '../lib/ui/BaseControl';
import { IControlFormContext, IControlParentNameContext, withForm, withParentName } from '../lib/context';
import { IControlWithFieldContext, withField } from '../lib/ui/WithFieldHoc';
import { FieldSection } from '../lib/FieldSection';
import { Form } from '../lib/Form';

// tslint:disable-next-line:max-line-length
interface IMyComp extends IBaseControlProps, IControlFormContext, IControlParentNameContext, IControlWithFieldContext<FieldSection> {
	bla: string;
}

interface IPlace {
	place: string;
}

// tslint:disable-next-line:variable-name
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
