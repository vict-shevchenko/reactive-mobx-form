import * as React from 'react';
import {inject, observer} from 'mobx-react'
import * as marked from 'marked';
import * as Prism from '../../utils/prism'
import {ViewStore} from "../../store/ViewStore";

const prettify = markdown =>
	markdown.replace(/```(?:javascript|js)([\s\S]+?)```/g,
		(match, code) =>
			`<pre class="language-jsx"><code class="language-jsx">${Prism.highlight(code, Prism.languages.jsx)}</code></pre>`)

const  DocumentOverview = observer(({ document }:{document?: any}) => {

	switch (document.state) {
		case "pending":
			return <h1>Loading documents..</h1>;
		case "rejected":
			return <span >{document.value}</span>;
		case "fulfilled":
			return (
				<div>
					<h1>Document overview</h1>
					<div dangerouslySetInnerHTML={{__html:marked(prettify(document.value))}} />
				</div>
			)
	}
});


export default DocumentOverview;