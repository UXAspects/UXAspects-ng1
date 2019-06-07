const path = require('path');

module.exports = {
    stylesheets: {
        src: [
            path.join(process.cwd(), 'src', 'styles', '**', '*.less'),
            '!' + path.join(process.cwd(), 'src', 'styles', 'hpe-icons.less'),
            '!' + path.join(process.cwd(), 'src', 'styles', 'fonts.less'),
            '!' + path.join(process.cwd(), 'src', 'styles', 'variables.less'),
        ]
    }
};