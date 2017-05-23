import { Router } from 'director/build/director';
import {ViewStore} from "./store/ViewStore";
import {autorun} from "mobx";

const prefix = '/reactive-mobx-form';

export default function startRouting(viewStore:ViewStore) {

	// update state on url change
	const router = new Router({
		[`${prefix}/readme`]: () => viewStore.showPage('readme', '/'),
		[`${prefix}}/examples/simpleForm`]: () => viewStore.showPage('simpleForm', 'examples/simpleForm')
	}).configure({
		html5history: true
	}).init();

	autorun(() => {
		const path = viewStore.currentPath;
		debugger;

		if (path !== window.location.pathname)
			window.history.pushState(null, null, `${prefix}${path}`)
	})
}