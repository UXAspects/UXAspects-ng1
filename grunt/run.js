const { join } = require('path');
const { cwd } = require('process');

const certificateFile = join('configs', 'webpack.docs.dev.pfx');

module.exports = {
    webpack_import_cert: {
        cmd: 'certutil',
        args: ['-f', '-importpfx', certificateFile]
    },
    npm_pack: {
        options: {
            cwd: join(cwd(), 'dist', 'library')
        },
        exec: 'npm pack --quiet'
    },
    schematics_build: {
        exec: 'npm run build:schematics'
    },
    schematics_copy: {
        exec: 'npm run copy:schematics'
    }
};
