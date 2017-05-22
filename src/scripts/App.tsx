import * as React from 'react';
import {inject, observer} from "mobx-react";
import Navigation from "./components/navigation/Navigation";
import Document from "./components/document/Document";
import Example from "./components/example/Example";
import {ViewStore} from "./store/ViewStore";



require('../styles/main.scss');



function renderCurrentView(store:ViewStore) {
	const view = store.currentView;

	switch (view.name) {
		case "readme":
			return <Document document={view.document}/>;
		case "simpleForm":
			return <Example name={view.name}/>;
		default:
			return <h1>Welcome to reactive-mobx-form</h1>
	}
}


@inject('viewStore')
@observer
export default class App extends React.Component<any, undefined> {

	render() {
		return (
			<div className="site">
				<div className="site__header">header</div>
				<div className="site__navigation">
					<Navigation />
					{this.props.viewStore.currentView.name}
				</div>
				<div className="site__content">
					{renderCurrentView(this.props.viewStore)}
				</div>
				<div className="site__footer">footer</div>
			</div>
		)
	}
}

