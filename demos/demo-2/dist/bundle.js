(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.myLibrary = factory());
}(this, function () { 'use strict';

  var foo = 'hello world!';

  var version = "1.0.0";

  console.log('version ' + version);
  function main () {
  	console.log(foo);
  }

  return main;

}));
