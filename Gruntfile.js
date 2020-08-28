const path = require('path');
const configLoader = require('load-grunt-config');

module.exports = function (grunt) {

    require('time-grunt')(grunt);

    configLoader(grunt, {
        configPath: path.join(process.cwd(), 'grunt'),
        jitGrunt: {
            staticMappings: {
                usebanner: 'grunt-banner'
            }
        }
    });

    // Register Tasks
    grunt.registerTask('webpack_import_cert', ['run:webpack_import_cert']);
    grunt.registerTask('lint', ['tslint:documentation', 'jshint:ng1', 'stylelint']);
    grunt.registerTask('library', ['clean:library', 'execute:ngpackagr', 'execute:webpack_library']);
    grunt.registerTask('styles', ['clean:styles', 'execute:less']);
    grunt.registerTask('assets', ['copy:fonts', 'copy:images', 'copy:css', 'copy:ng1', 'copy:md']);
    grunt.registerTask('assets:library', ['copy:fonts', 'copy:images', 'copy:md']);
    grunt.registerTask('iconset', ['execute:iconset', 'webfont:iconset']);
    grunt.registerTask('minify', ['uglify:ng1', 'cssmin:styles']);
    grunt.registerTask('licenses', ['execute:licenses', 'usebanner:ng1']);
    grunt.registerTask('package:library', ['run:npm_pack', 'copy:npm_tgz', 'execute:package_artifactory']);

    // compile: build the library and documentation into `dist`.
    grunt.registerTask('compile', [
        'clean',
        'lint',
        'library',
        'iconset',
        'styles',
        'licenses',
        'build:documentation',
        'minify',
        'assets',
        'schematics',
    ]);

    // package: compress the dist output for all targets into the `target` directory.
    grunt.registerTask('package', ['package:library', 'compress:documentation']);

    // build: build and package for all targets.
    grunt.registerTask('build', ['compile', 'package']);

    // build: build and copy the schematics
    grunt.registerTask('schematics', ['run:schematics_build', 'run:schematics_copy']);

    // build:library: build and package the library.
    grunt.registerTask('build:library', [
        'clean',
        'lint',
        'library',
        'iconset',
        'styles',
        'minify',
        'assets:library',
        'schematics',
        'licenses',
        'package:library'
    ]);

    // build:documentation: build the documentation site.
    grunt.registerTask('build:documentation', ['tslint:documentation', 'clean:documentation', 'execute:webpack_documentation']);

    // default: build and package for all targets.
    grunt.registerTask('default', ['build']);
};
