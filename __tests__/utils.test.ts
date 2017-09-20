declare var jest, describe, it, expect;
import { omit, objectPath, isNumeric } from '../src/utils';

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
		const pathSimle = 'a.b',
			  pathLong = 'a.b.c.d',
			  pathArray = 'a[1]',
			  pathMixed = 'a.b.0.c',
			  pathMixedArray = 'a.b.0.c[3].z';

		expect(objectPath(pathSimle).length).toBe(2);
		expect(objectPath(pathLong).length).toBe(4);
		expect(objectPath(pathArray).length).toBe(2);
		expect(objectPath(pathMixed).length).toBe(4);
		expect(objectPath(pathMixedArray).length).toBe(6);
	});
});

describe('Testing isNumeric utility', () => {
	test('Should return proper boolean based on string', () => {

		expect(isNumeric('test')).toBe(false);
		expect(isNumeric('1232')).toBe(true);
	});
});
