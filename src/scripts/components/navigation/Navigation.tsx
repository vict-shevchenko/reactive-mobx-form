import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {ViewStore} from "../../store/ViewStore";

const layout:any = [
	{
		displayName: 'Read Me',
		name: 'readme',
		path: ''
	},
	{
		name: 'Docs',
		path: 'docs'
	},
	{
		name: 'Examples',
		path: 'examples',
		pages: [
			 {
				displayName: 'Simple Form',
				name: 'simpleForm',
				path: 'simple'
			}
		]
	}
];

function renderNavigationLevel(layout, level:number, path:string, navItems: any) {

	layout.forEach(navItem => {

		navItems.push(<NavigationItem displayName={navItem.displayName} name={navItem.name} path={`${path}/${navItem.path}`} level={level} />);

		if(navItem.pages) {
			renderNavigationLevel(navItem.pages, level+1, `${path}/${navItem.path}`, navItems)
		}

	})


}

function renderNavigation() {
	let navItems = [];

	renderNavigationLevel(layout, 1, '', navItems);

	return navItems;
}


/*const NavigationItem:React.SFC<{name:string, path:string, level:number}> = ({name, path, level}) => (
	<div>{name} -- {path} -- {level}</div>
);*/

const NavigationItem:any = inject('viewStore')(observer((({displayName, name, path, level, viewStore}:{displayName: string ,name: string, path: string, level:number ,viewStore:ViewStore}) => (
	<a onClick={(event) => {
		event.preventDefault();
		viewStore.showPage(name, path);
	}} href="#" className="nav-item">
		{level} - {displayName}
	</a>
))));

@inject('viewStore')
@observer
export default class Navigation extends React.Component<any, any> {
	render() {
		return (
			<div>
				{renderNavigation()}
			</div>
		);
	}
}