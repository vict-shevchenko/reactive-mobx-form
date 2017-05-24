import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {ViewStore} from "../../store/ViewStore";



/*function renderNavigationLevel(layout, level:number, path:string, navItems: any) {
	layout.forEach(navItem => {
		navItems.push(<NavigationItem displayName={navItem.displayName} name={navItem.name} path={`${path}/${navItem.path}`} level={level} />);

		if(navItem.pages) {
			renderNavigationLevel(navItem.pages, level+1, `${path}/${navItem.path}`, navItems)
		}
	})
}*/

/*function renderNavigation() {
	let navItems = [];
	renderNavigationLevel(layout, 1, '', navItems);
	return navItems;
}*/


/*const NavigationItem:React.SFC<{name:string, path:string, level:number}> = ({name, path, level}) => (
	<div>{name} -- {path} -- {level}</div>
);*/

const NavItem:any = ({onClick, indent, children}:{onClick:any, indent: number, children:any}) => (
	<a onClick={(e) => {e.preventDefault(); onClick()}} href="#" className={`nav-item nav-item_indent-${indent}`}>
		{children}
	</a>
);

@inject('viewStore')
@observer
export default class Navigation extends React.Component<any, any> {

	constructor() {
		super();

		this.showPage = this.showPage.bind(this);
	}

	showPage(isExample, name, path) {
		const show = isExample ? this.props.viewStore.showExamplePage : this.props.viewStore.showDocPage;

		show.bind(this.props.viewStore)(name, path);
	}

	render() {
		return (
			<div>
				<NavItem onClick={() => this.showPage(false, 'readme', '')} >Read me</NavItem>
				<NavItem onClick={() => this.showPage(true,  'SimpleForm', 'examples/simple')} indent={2} >Simple Form</NavItem>
			</div>
		);
	}
}