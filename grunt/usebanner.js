const { join } = require('path');
const { cwd } = require('process');

const package = require(join(cwd(), 'package.json'));

module.exports = {

    ng1: {
        options: {
            position: 'top',
            banner: `/* \n* ${ package.name } - v${ package.version } \n* © Copyright ${ new Date().getFullYear() } EntIT Software LLC, a Micro Focus company\n*/`,
            linebreak: true
        },
        files: {
            src: [
                join(cwd(), 'dist', 'library', 'ng1', 'ux-aspects-ng1.js'),
                join(cwd(), 'dist', 'library', 'ng1', 'ux-aspects-ng1.min.js'),
                join(cwd(), 'dist', 'library', 'styles', 'ux-aspects.css'),
                join(cwd(), 'dist', 'library', 'styles', 'ux-aspects.min.css'),
            ]
        }
    }

};