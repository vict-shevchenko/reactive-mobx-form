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
			case "readme": return "/README.md/";
			case "simpleForm": return `/examples/simpleForm`;
		}
	}

	@action showPage(name, path) {
		this.currentView = {
			name: name,
			document: fromPromise(doFetchCall(`https://raw.githubusercontent.com/vict-shevchenko/reactive-mobx-form/master/${path !== '/' ? `docs/${path}/${name}` : 'README' }.md`))
		}
	}

	@action showBooks() {
		this.currentView = {
			name: "books",
			document: 'books page'
		}
	}

	@action showAuthor() {
		this.currentView = {
			name: "author",
			document: 'authors page'
		}
	}
}