(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.npmLibraryDemo = factory());
}(this, function () { 'use strict';

	var preload = function preload(images, cb) {
	  var len = images.length;
	  var count = 0;

	  if (len) {
	    var imgLoad = function imgLoad(i) {
	      console.log("---------img-".concat(i, " load"));
	      count++;

	      if (count === len) {
	        cb();
	      }
	    };

	    images.forEach(function (url, i) {
	      var img = new Image();
	      img.src = url;

	      img.onload = function () {
	        return imgLoad(i);
	      };

	      img.onerror = imgLoad;
	    });
	  } else {
	    cb();
	  }
	};

	return preload;

}));
//# sourceMappingURL=index.js.map
