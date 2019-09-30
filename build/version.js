const fs = require('fs');
const path = require('path');
const pathname = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pathname, 'utf-8'));
let version = pkg.version;

console.log('--------version', version)

const exec = require('child_process').exec;
let cmdStr = `git commit -m "v${version}" && git push`;
exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
        console.log('error:' + stderr);
    } else {
        var data = JSON.parse(stdout);
        console.log('other:', data);
    }
});
