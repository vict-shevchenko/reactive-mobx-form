import { observable, action, computed } from 'mobx';
import { fromPromise } from 'mobx-utils';
import {doFetchCall} from "../utils/fetch";

export class ViewStore {
	@observable currentView;

	constructor() {
		this.currentView = {
			name: 'landing',
			document: {
				state: 'fulfilled',
				value: 'some text'
			}
		}
	}

	@computed get currentPath() {
		switch(this.currentView.name) {
			case "landing": return '/';
			case "readme": return "/readme";
			case "SimpleForm": return `/examples/simple/SimpleForm`;
			case "SyncFieldValidation": return '/examples/sync-validation/SyncFieldValidation'
		}
	}

	@action showDocPage(name, path) {
		this.currentView = {
			name: name,
			document: fromPromise(doFetchCall(`https://raw.githubusercontent.com/vict-shevchenko/reactive-mobx-form/master/${path !== '' ? `docs/${path}/${name}` : 'README' }.md`))
		}
	}

	@action showExamplePage(name, path) {
		this.currentView = {
			name: name,
			document: fromPromise(
				Promise.all([
					doFetchCall(`https://raw.githubusercontent.com/vict-shevchenko/reactive-mobx-form/master/docs/${path}/${name}.md`),
					doFetchCall(`https://raw.githubusercontent.com/vict-shevchenko/reactive-mobx-form/site/src/scripts/${path}/${name}.jsx`)
				])
			)
		}
	}
}