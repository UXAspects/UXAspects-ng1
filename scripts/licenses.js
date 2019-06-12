// import dependencies
const path = require('path');
const fs = require('fs');
const glob = require("glob");

const startToken = 'LICENSE-START';
const endToken = 'LICENSE-END';

const pluginPath = path.join(process.cwd(), 'src', 'ng1', 'plugins');
const externalPath = path.join(process.cwd(), 'src', 'ng1', 'external');
const fontPath = path.join(process.cwd(), 'src', 'fonts');

// Add an extension so we can specify a webpack loader
const assetsLicensePath = path.join(process.cwd(), 'docs', 'app', 'assets', 'licenses.txt');
const dataLicensePath = path.join(process.cwd(), 'docs', 'app', 'data', 'licenses.json');

const outputPath = path.join(process.cwd(), 'dist', 'library', '3rd-party-licenses.txt');

// wait for all licenses to be retrieved
let pluginPromise = extractLicenses(pluginPath, '.js');
let externalPromise = extractLicenses(externalPath, '.js');
let fontsPromise = extractLicenses(fontPath, '.txt');

Promise.all([pluginPromise, externalPromise, fontsPromise]).then(values => {

    let licenses = [];

    // merge all license files
    values.forEach(licenseSet => licenses = licenses.concat(licenseSet));

    // create license files
    createLicenseFile(licenses.sort(licenseComparator));
});

function extractLicenses(directory, extension) {

    let promise = new Promise((resolve) => {

        glob(`**/*${extension}`, { cwd: directory }, (err, files) => {

            // determine when all files have been processed
            let counter = files.length;

            // if there are no items then resolve promise
            if (counter === 0) {
                resolve([]);
            }

            // store all license headers
            let licenses = [];

            // iterate each file
            files.forEach(file => {

                let filePath = path.join(directory, file);

                fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {

                    var start = data.indexOf('LICENSE-START');
                    var end = data.indexOf('LICENSE-END');

                    var header = data.substr(start, (end - start)).replace(startToken, '').replace(endToken, '');

                    // if there is no license dont push anything
                    if (header.length !== 0) {
                        licenses.push({
                            path: path.relative(process.cwd(), filePath),
                            fileName: path.basename(filePath),
                            content: header
                        });
                    }

                    // check if this is the last file
                    if (--counter <= 0) {
                        resolve(licenses);
                    }
                });
            });
        });
    });

    return promise;
}

function createLicenseFile(licenses) {
    var separator = '\n\n-----------------------------------------------------------------------------------\n\n';
    var output = 'UX ASPECTS (ANGULARJS) OPEN SOURCE LICENSES' + separator + licenses.map(format).join(separator) + '\n';
    fs.writeFileSync(outputPath, output);
    fs.writeFileSync(assetsLicensePath, output);
    fs.writeFileSync(dataLicensePath, JSON.stringify(licenses, null, 4), 'utf8');
}

function licenseComparator(a, b) {
    return a.path.localeCompare(b.path);
}

function format(license) {
    return `${license.fileName}:\n\n${license.content}`;
}
