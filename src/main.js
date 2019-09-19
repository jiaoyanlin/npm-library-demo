import foo from './foo.js';
import { version } from '../package.json';
console.log('version ' + version);
export default function () {
	console.log(foo);
}