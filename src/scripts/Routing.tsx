import { Router } from 'director/build/director';
import {ViewStore} from "./store/ViewStore";
import {autorun} from "mobx";

export default function startRouting(viewStore:ViewStore) {
	const author = function () { viewStore.showAuthor() };
	const books = function () { viewStore.showBooks() };


	// update state on url change
	const router = new Router({
		"/author/": author,
		"/books/": books
	}).configure({
		html5history: true
	}).init();

	autorun(() => {
		const path = viewStore.currentPath;

		if (path !== window.location.pathname)
			window.history.pushState(null, null, path)
	})
}