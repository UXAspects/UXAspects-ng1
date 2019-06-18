const { join } = require('path');
const { cwd } = require('process');

module.exports = {
    fonts: {
        cwd: join(cwd(), 'src', 'fonts'),
        src: '**',
        dest: join(cwd(), 'dist', 'library', 'fonts'),
        expand: true
    },
    images: {
        cwd: join(cwd(), 'src', 'img'),
        src: '**',
        dest: join(cwd(), 'dist', 'library', 'img'),
        expand: true
    },
    css: {
        cwd: join(cwd(), 'dist', 'library', 'styles'),
        src: '**',
        dest: join(cwd(), 'dist', 'docs', 'assets', 'css'),
        expand: true
    },
    ng1: {
        cwd: join(cwd(), 'dist', 'library', 'ng1'),
        src: '**',
        dest: join(cwd(), 'dist', 'docs', 'assets', 'ng1'),
        expand: true
    },
    manifest: {
        src: join(cwd(), 'src', 'package.json'),
        dest: join(cwd(), 'dist', 'library/')
    },
    md: {
        src: ['README.md', 'LICENSE.md'],
        dest: join(cwd(), 'dist', 'library/')
    },
    npm_tgz: {
        cwd: join(cwd(), 'dist', 'library'),
        src: 'ux-aspects-ux-aspects-ng1-*.*.*.tgz',
        dest: join(cwd(), 'target', 'npm'),
        expand: true
    }
};
