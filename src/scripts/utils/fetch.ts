/* * This file exports one function that is a general wrapper over "fetch" functionality.
 *
 * It encapsulates logic over passing standard HTTP request properties and doing response processing
 * (validation of response status, converting response body to string)
 * */

// Default request parameters
export const fetchDefaults = {
	credentials: 'same-origin', // used for preserving cookie
	method     : 'GET',
	headers    : {}
};

/**
 * Function for validating the status of a response
 * @param {Object<Response>} response - Object describing a response from server
 * @returns {Object<Response>} - response from server
 * @throw {Object<Error>} - Error object with description
 */
export function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	else {
		// error message processing
		const error    = new Error(response.statusText);
		//error.response = response;
		throw error;
	}
}

/**
 * Asynchronously get a response text from an object representing server response
 * @param {Object} response - Object describing a response from server
 * @returns {Promise} - Promise, that will be resolved with a response text
 */
export function parseText(response) {
	return response.text();
}

/**
 * Asynchronously get a response json from an object representing server response
 * @param {Object} response - Object describing a response from server
 * @returns {Promise} - Promise, that will be resolved with a response text
 */
export function parseJSON(response) {
	return response.json();
}

/**
 * Wrapper function over "fetch"
 * @param {string} url - An url to which the request should be send
 * @param {Object} parameters - Object with request parameters(See fetch spec for details)
 * @returns {Promise.<TResult>}
 */
export function doFetchCall(url, parameters = {}) {
	const fetchParameters = Object.assign({}, fetchDefaults, parameters);

	// Object.assign(fetchParameters.headers, { Authorization: `Bearer ${localStorage.getItem('access_token')}` });

	return fetch(url/*, fetchParameters*/)
		.then(checkStatus)
		.then(parseText);
}
