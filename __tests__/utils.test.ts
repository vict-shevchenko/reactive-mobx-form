declare var jest, describe, it, expect;
import * as React from 'react';
import { omit, objectPath, isNumeric, objectMissProps, verifyRequiredProps } from '../src/utils';

describe('Testing the omit utility', () => {
	test('omit function should work well', () => {
		const props = {
			name: 'Viktor',
			component: 'input',
			placeholder: 'User Name'
		};
		const propsToOmit = ['name', 'component' ];

		const ommitedProps: any = omit(props, propsToOmit);

		expect(Object.keys(ommitedProps).length).toBe(1);
		expect(ommitedProps.placeholder).toBe('User Name');
	});
});

describe('Testing objectPath utility', () => {
	test('Should convert string to an array of strings', () => {
		const pathSimple = 'a.b',
			  pathLong = 'a.b.c.d',
			  pathArray = 'a[1]',
			  pathMixed = 'a.b.0.c',
				pathMixedArray = 'a.b.0.c[3].z',
				pathMixedArrayWithString = 'a.b.0.c["3"].z',
				pathMixedArrayWithStringEscaping = 'a.b.0.c[\'a\']["0"]';
				// pathNotString = [2, 4];

		expect(objectPath(pathSimple).length).toBe(2);
		expect(objectPath(pathLong).length).toBe(4);
		expect(objectPath(pathArray).length).toBe(2);
		expect(objectPath(pathMixed).length).toBe(4);
		expect(objectPath(pathMixedArray).length).toBe(6);
		expect(objectPath(pathMixedArrayWithString).length).toBe(6);
		expect(objectPath(pathMixedArrayWithStringEscaping).length).toBe(6);
		// expect(() => {objectPath(pathNotString)}).toThrow();
	});
});

describe('Testing isNumeric utility', () => {
	test('Should return proper boolean based on string', () => {

		expect(isNumeric('test')).toBe(false);
		expect(isNumeric('1232')).toBe(true);
	});
});

describe('Testing objectMissProps utility', () => {
	let obj;

	beforeEach(() => {
		obj = {
			a: 10,
			b: 15,
			c: 20
		};
	});

	test('Should return null if no missing props', () => {
		const props = ['a', 'b', 'c'];

		expect(objectMissProps(props, obj)).toBe(null);
	});

	test('Should return array of missing props if there are no props in object', () => {
		const props = ['a', 'b', 'c', 'd', 'e'];

		expect(objectMissProps(props, obj)).toEqual(['d', 'e']);
	});
});

describe('Testing verifyRequiredProps utility', () => {
	let obj, component;

	beforeEach(() => {
		obj = {
			a: 10,
			b: 15,
			c: 20
		};

		class TestComponent extends React.Component {
			public props: any;

			constructor(props) {
				super(props);
				this.props = props;
			}
		}

		component = new TestComponent({name: 'Test'});
	});

	test('Should return undefined if no missing props', () => {
		const props = ['a', 'b', 'c'];

		expect(verifyRequiredProps(props, obj, component)).toBe(undefined);
	});

	test('Should return trow if there are missing props', () => {
		const props = ['a', 'b', 'c', 'd', 'e'];

		// tslint:disable-next-line:max-line-length
		expect(() => verifyRequiredProps(props, obj, component)).toThrowErrorMatchingSnapshot();
	});
});
