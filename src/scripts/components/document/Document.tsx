import * as React from 'react';
import { observable } from 'mobx';
import {inject, observer} from 'mobx-react'
import { fromPromise } from 'mobx-utils';
import { doFetchCall } from '../../utils/fetch';
import * as marked from 'marked';
import * as Prism from '../../utils/prism'
import {ViewStore} from "../../store/ViewStore";

interface iDocumentProps {
	document: string
}

const prettify = markdown =>
	markdown.replace(/```(?:javascript|js)([\s\S]+?)```/g,
		(match, code) =>
			`<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(code, Prism.languages.jsx)}</code></pre>`)

@observer
class DocumentOverview extends React.Component<iDocumentProps, any>{

	@observable document: any = {
		state: 'pending',
		value: ''
	};

	constructor(){
		super();
	}

	componentDidMount() {
		this.document = fromPromise(doFetchCall(`https://raw.githubusercontent.com/vict-shevchenko/reactive-mobx-form/master/${this.props.document}.md`))
	}

	componentWillReceiveProps(newProps) {
		this.document = fromPromise(doFetchCall(`https://raw.githubusercontent.com/vict-shevchenko/reactive-mobx-form/master/${newProps.document}.md`))
	}

	render() {
		switch (this.document.state) {
			case "pending":
				return <h1>Loading documents..</h1>;
			case "rejected":
				return <span >{this.document.value}</span>;
			case "fulfilled":
				return (
					<div>
						<div dangerouslySetInnerHTML={{__html:marked(prettify(this.document.value))}} />
					</div>
				)
		}
	}
}


export default DocumentOverview;