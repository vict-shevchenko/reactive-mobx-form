import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { fromPromise } from 'mobx-utils';
import { doFetchCall } from '../../utils/fetch';
import * as marked from 'marked';
import * as Prism from '../../utils/prism';


interface iCodeProps {
	path: string
}

@observer
class Code extends React.Component<iCodeProps, any> {
	@observable code: any = {
		state: 'pending',
		value: ''
	};

	static url = 'https://raw.githubusercontent.com/vict-shevchenko/reactive-mobx-form/site/src/scripts/examples';

	constructor(){
		super();
	}

	componentDidMount() {
		this.code = fromPromise(doFetchCall(`${Code.url}/${this.props.path}.jsx`))
	}

	componentWillReceiveProps(newProps) {
		this.code = fromPromise(doFetchCall(`${Code.url}/${newProps.path}.jsx`))
	}

	render() {
		switch (this.code.state) {
			case "pending":
				return <h1>Loading source code..</h1>;
			case "rejected":
				return <span >{this.code.value}</span>;
			case "fulfilled":
				return (
					<div>
						<div dangerouslySetInnerHTML={{ __html: marked(`<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(this.code.value, Prism.languages.jsx)}</code></pre>`)}} />
					</div>
				)
		}
	}
}

export default Code;