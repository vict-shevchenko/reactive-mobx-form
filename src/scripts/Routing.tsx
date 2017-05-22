import { Router } from 'director/build/director';
import {ViewStore} from "./store/ViewStore";
import {autorun} from "mobx";

export default function startRouting(viewStore:ViewStore) {

	// update state on url change
	const router = new Router({
		"/readme": () => viewStore.showPage('readme', '/'),
		'/examples/simpleForm': () => viewStore.showPage('simpleForm', 'examples/simpleForm')
	}).configure({
		html5history: true
	}).init();

	autorun(() => {
		const path = viewStore.currentPath;

		if (path !== window.location.pathname)
			window.history.pushState(null, null, path)
	})
}