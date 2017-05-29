import { Router } from 'director/build/director';
import {ViewStore} from "./store/ViewStore";
import {autorun} from "mobx";

const prefix = '/reactive-mobx-form';

export default function startRouting(viewStore:ViewStore) {

	// update state on url change
	const router = new Router({
		[`${prefix}/readme`]: () => viewStore.showDocPage('readme', '/'),
		[`${prefix}/examples/simple/SimpleForm`]: () => viewStore.showExamplePage('SimpleForm', 'examples/simple'),
		[`${prefix}/examples/sync-validation/SyncFieldValidation`]: () => viewStore.showExamplePage('SyncFieldValidation', 'examples/sync-validation')
}).configure({
		html5history: true
	}).init();

	autorun(() => {
		const path = viewStore.currentPath;
		// debugger;

		if (path !== window.location.pathname)
			window.history.pushState(null, null, `${prefix}${path}`)
	})
}