const { join } = require('path');
const { cwd } = require('process');

module.exports = {
    iconset: {
        src: join(cwd(), 'src', 'icons', '*.svg'),
        dest: join(cwd(), 'src', 'fonts'),
        destCss: join(cwd(), 'src', 'styles'),
        options: {
            font: 'hpe-icons',
            engine: 'node',
            hashes: false,
            stylesheet: 'less',
            htmlDemo: false,
            templateOptions: {
                baseClass: 'hpe-icon',
                classPrefix: 'hpe-',
                mixinPrefix: 'hpe-icon-'
            }
        }
    }
};