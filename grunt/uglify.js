const path = require('path');

module.exports = {

    ng1: {
        options: {
            preserveComments: /(?:^!|@(?:license|preserve|cc_on))/,
            maxLineLen: 0
        },
        src: path.join(process.cwd(), 'dist', 'library', 'ng1', 'ux-aspects-ng1.js'),
        dest: path.join(process.cwd(), 'dist', 'library', 'ng1', 'ux-aspects-ng1.min.js')
    }

};