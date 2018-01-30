import * as React from 'react';
import * as PropTypes from 'prop-types';
import { observable, IObservableArray } from 'mobx';
import { observer, Observer } from 'mobx-react';
import { Form } from '../Form';
import ProxyFieldArray from '../ProxyFieldArray';
import { FieldArray } from '../FieldArray';
import { omit } from '../utils';
import BaseControl from './BaseControl';
import { IFieldDefinition } from '../interfaces/Form';
import { IControlArrayProps, IGroupControlContext } from '../interfaces/Control';

@observer
export class ControlArray extends BaseControl<IControlArrayProps, any> {
	public name: string;
	public form: Form;
	public field: FieldArray;

	private proxiedFieldsProp: ProxyFieldArray;
	private fieldsProp = observable<string>([]);

	public static contextTypes = {
		_ReactiveMobxForm: PropTypes.object.isRequired,
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string
	};

	public static childContextTypes = {
		_ReactiveMobxFormFieldNamePrefix: PropTypes.string.isRequired
	};

	private static requiredProps: string[] = ['component', 'name'];
	private static propNamesToOmitWhenByPass: string[] = ['component', 'rules'];

	constructor(props, context) {
		super(props, context, ControlArray.requiredProps);
	}

	public getChildContext(): IGroupControlContext {
		return {
			_ReactiveMobxFormFieldNamePrefix: this.name
		};
	}

	public componentWillMount(): void {
		this.field = new FieldArray(this.name);
		this.form.registerField(this.field);
		this.proxiedFieldsProp = new ProxyFieldArray(this.fieldsProp, this.field.subFields);
	}

	public componentWillUnmount(): void {
		if (!this.field.autoRemove || this.context._destroyControlStateOnUnmount) {
			this.field.setAutoRemove();
			this.form.unregisterField(this.name);
		}
	}

	public componentWillReceiveProps(nextProps: IControlArrayProps, nextContext: IGroupControlContext): void {
		const nextName = BaseControl.constructName(nextContext._ReactiveMobxFormFieldNamePrefix, nextProps.name);

		if (this.name !== nextName) {
			this.field.update(nextName);
			this.name = nextName;
			this.setState({}); // component Rerender -> gerChildContext -> contextUpdate
		}
	}

	public render() {
		const propsToPass = omit(this.props, ControlArray.propNamesToOmitWhenByPass);

		const length =  this.fieldsProp.length; // todo: why we need this to rerender?

		return React.createElement((this.props.component as any),
				Object.assign({}, { fields: this.proxiedFieldsProp }, propsToPass)
			);
	}
}
