export function omit(obj: any, omitKeys: Array<string>) {
	const result = {};

	Object.keys(obj).forEach(key => {
		if (omitKeys.indexOf(key) === -1) {
			result[key] = obj[key];
		}
	});

	return result;
}