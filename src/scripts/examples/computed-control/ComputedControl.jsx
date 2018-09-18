import * as React from 'react';
import { reactiveMobxForm, Control, ComputedControl } from 'reactive-mobx-form';


class ComputedControlForm extends React.Component {
	render() {
		const { submit, reset } = this.props;

		return (
			<form onSubmit={submit}>
				<h3>Simple Delivery Form</h3>
				<div>
					<label>Delivery time</label>
					<div>
						<label><Control name="time" component="input" type="radio" value="standard" />Standard</label>
						<label><Control name="time" component="input" type="radio" value="fast" />Fast</label>
					</div>
				</div>
				<div>
					<label>Total price ($)</label>
					<div>
						<ComputedControl 
							name="total" 
							component="input" 
							type="text"
							disabled="true" 
							compute={(values, props) => values.time === 'fast' ? props.baseprice + 4.99 : props.baseprice }
							baseprice={10}
						/>
					</div>
				</div>

				<section>
					<button type="submit">Submit</button>
					<button type="button" onClick={reset}>Reset</button>
				</section>
			</form>
		);
	}
}

const ComputedControlFormReactive = reactiveMobxForm('ComputedControl', {
	schema: { time: 'standard' } 
})(ComputedControlForm);

export default ComputedControlFormReactive;
