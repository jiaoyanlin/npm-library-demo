import _ from 'lodash';

var foo = 'hello world!';

var version = "1.0.0";

var index = 42;

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

function main () {
	console.log(foo);
	console.log('the answer is ' + index);
}

export default main;
