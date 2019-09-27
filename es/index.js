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

export default preload;
//# sourceMappingURL=index.js.map
