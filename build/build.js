const rollup = require('rollup');
const { configFun, outputs } = require('./node.config.js');

outputs.forEach(async (output) => {
    const inputOptions = configFun({
        isUglify: output.isUglify,
        isExternal: output.isExternal,
    });
    build(inputOptions, output);
})

async function build(inputOptions, outputOptions) {
    console.log(`[INFO] 开始编译 ${inputOptions.input}`);
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    // generate code and a sourcemap
    const res = await bundle.generate(outputOptions);
    console.log(`[INFO] ${res}`);

    // or write the bundle to disk
    await bundle.write(outputOptions);
    console.log(`[SUCCESS] 编译结束 ${outputOptions.file}`);
}
