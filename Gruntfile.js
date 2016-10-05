module.exports = function(grunt){

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /*browserify: {
            bundle: {
                src: 'src/email-checker.js',
                dest: 'dist/email-checker.js'
            }
        },*/

        uglify: {
            build: {
                files: {
                    'dist/email-checker.min.js': ['src/email-checker.js']
                }
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: [/*'browserify:bundle',*/'uglify:build'],
                options: {
                    spawn: false,
                }
            },
        }

    });

    //grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

};
