import foo from './foo.js';
import { version } from '../package.json';
import answer from 'the-answer';
console.log('version ' + version);
export default function () {
	console.log(foo);
	console.log('the answer is ' + answer);
}