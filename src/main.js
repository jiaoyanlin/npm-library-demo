import demo from './demo.js';
import { version } from '../package.json';
import answer from 'the-answer';
import _merge from 'lodash/merge';

console.log('version:' + version);

let users = {
	'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
};
let ages = {
	'data': [{ 'age': 36 }, { 'age': 40 }]
};
const a = _merge(users, ages);
console.log('-------lodash:', a);


async function initDemo() {
	console.log('the answer is ' + answer);
	const obj = {}
	const newObj = Object.assign(obj, { age: 30 });
	let data = await demo();
	console.log('initDemo:', data, newObj);
	return data;
}

initDemo();

export default initDemo;
