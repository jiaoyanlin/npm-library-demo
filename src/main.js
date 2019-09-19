import foo from './foo.js';
import { version } from '../package.json';
import answer from 'the-answer';
import _ from 'lodash';
// import _merge from 'lodash/merge';

console.log('version ' + version);
console.log('-------lodash:', _.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 }));

// let users = {
// 	'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
// };
// let ages = {
// 	'data': [{ 'age': 36 }, { 'age': 40 }]
// };
// _merge(users, ages);

export default function () {
	console.log(foo);
	console.log('the answer is ' + answer);
}