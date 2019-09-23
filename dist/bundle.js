'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime-corejs2/regenerator'));
var _Object$assign = _interopDefault(require('@babel/runtime-corejs2/core-js/object/assign'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime-corejs2/helpers/asyncToGenerator'));
var _Object$defineProperty = _interopDefault(require('@babel/runtime-corejs2/core-js/object/define-property'));
var _Object$defineProperties = _interopDefault(require('@babel/runtime-corejs2/core-js/object/define-properties'));
var _Object$getOwnPropertyDescriptors = _interopDefault(require('@babel/runtime-corejs2/core-js/object/get-own-property-descriptors'));
var _Object$getOwnPropertyDescriptor = _interopDefault(require('@babel/runtime-corejs2/core-js/object/get-own-property-descriptor'));
var _Object$getOwnPropertySymbols = _interopDefault(require('@babel/runtime-corejs2/core-js/object/get-own-property-symbols'));
var _Object$keys = _interopDefault(require('@babel/runtime-corejs2/core-js/object/keys'));
var _defineProperty = _interopDefault(require('@babel/runtime-corejs2/helpers/defineProperty'));
var _Promise = _interopDefault(require('@babel/runtime-corejs2/core-js/promise'));
var _merge = _interopDefault(require('lodash/merge'));

function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (_Object$getOwnPropertyDescriptors) { _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } } return target; }

function demo() {
  return new _Promise(function (resolve, reject) {
    try {
      setTimeout(function () {
        var obj1 = {
          a: 1
        };
        var obj2 = {
          b: 2
        };

        var result = _objectSpread({}, obj1, {}, obj2);

        resolve(result);
      }, 1000);
    } catch (err) {
      reject(err);
    }
  });
}

var version = "1.0.0";

var index = 42;

console.log('version ' + version);
var users = {
  'data': [{
    'user': 'barney'
  }, {
    'user': 'fred'
  }]
};
var ages = {
  'data': [{
    'age': 36
  }, {
    'age': 40
  }]
};

var a = _merge(users, ages);

console.log('-------lodash:', a);

function initDemo() {
  return _initDemo.apply(this, arguments);
}

function _initDemo() {
  _initDemo = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee() {
    var obj, newObj, data;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('the answer is ' + index);
            obj = {};
            newObj = _Object$assign(obj, {
              age: 30
            });
            _context.next = 5;
            return demo();

          case 5:
            data = _context.sent;
            console.log('initDemo:', data, newObj);
            return _context.abrupt("return", data);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _initDemo.apply(this, arguments);
}

initDemo();

module.exports = initDemo;
