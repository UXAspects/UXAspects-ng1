/**
 * Make a copy of package.json with the scripts section removed.
 */
const fs = require('fs');

fs.readFile('src/package.json', 'utf8', (err, data) => {

    if (err) {
        console.error(err);
        process.exitCode = 1;
        return;
    }

    const manifest = JSON.parse(data);
    delete manifest.scripts;

    fs.writeFile('dist/library/package.json', JSON.stringify(manifest, null, 2), 'utf8', err => {
        if (err) {
            console.error(err);
            process.exitCode = 1;
            return;
        }
    });
});
