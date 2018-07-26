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

				const code = Prism.highlight(this.code.value, Prism.languages.jsx);
				let html = marked(`<pre class="language-jsx"><code class="language-jsx">${code}</code></pre>`);

				html = html.replace(/ {4}/g, '\t');

				return (
					<div>
						<div dangerouslySetInnerHTML={{ __html: html}} />
					</div>
				)
		}
	}
}

export default Code;
