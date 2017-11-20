import * as React from 'react';

import Document from '../document/Document';

class ApiOverview extends React.Component<any, any>{
	constructor() {
		super();
	}

	render() {
		const name = this.props.match.params.name;

		return (
			<div className="pageContent">
				<div>
					<Document document={`docs/api/${name}`} />
				</div>
			</div>
		)
	}
}


export default ApiOverview;