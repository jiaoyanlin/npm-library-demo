const preload = (images, cb) => {
    function imgLoad(i) {
        console.log(`---------img-${i} load`);
        count++;
        if (count === len) {
            cb();
        }
    }
    const len = images.length;
    const imgArr = [];
    let count = 0;
    if (len) {
        images.forEach((url, i) => {
            const img = new Image();
            img.src = url;
            img.onload = () => imgLoad(i);
            img.onerror = imgLoad;
            imgArr.push(img);
        });
    } else {
        cb();
    }
}

export default preload;
