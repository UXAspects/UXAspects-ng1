const { join } = require('path');
const { cwd } = require('process');

const scripts = join(cwd(), 'scripts');
const uxaScripts = join(cwd(), 'node_modules', '@ux-aspects', 'ux-aspects-scripts', 'bin');
const ngPackagr = join(cwd(), 'node_modules', 'ng-packagr', 'cli', 'main.js');
const webpack = join(cwd(), 'node_modules', 'webpack', 'bin', 'webpack.js');

module.exports = {
    iconset: {
        src: [join(scripts, 'iconset.js')]
    },
    licenses: {
        src: [join(scripts, 'licenses.js')]
    },
    less: {
        src: [join(scripts, 'inline-less.js')]
    },
    ngpackagr: {
        src: [ngPackagr],
        options: {
            args: ['-p', 'src/ng-package.json']
        }
    },
    webpack_library: {
        src: [webpack],
        options: {
            args: ['--config', 'configs/webpack.lib.config.js']
        }
    },
    webpack_documentation: {
        src: [webpack],
        options: {
            nodeargs: ['--max-old-space-size=4096'],
            args: ['--config', 'configs/webpack.docs.prod.config.js']
        }
    },
    package_artifactory: {
        src: [join(uxaScripts, 'package-artifactory.js')],
        options: {
            args: ['ux-aspects-ng1', 'ux-aspects', 'dist/library']
        }
    }
};