import React from 'react';

export default function BasicForm({ submit }) {
	return (
		<form onSubmit={submit}>
			<button type="submit" id="submit">Submit</button>
		</form>
	);
}
