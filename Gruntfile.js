module.exports = function(grunt){

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            bundle: {
                files: {
                    'src/email-checker.js': ['src/**/*.js'],
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'dist/email-checker.min.js': ['dist/email-checker.js']
                }
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['uglify:build'],
                options: {
                    spawn: false,
                }
            },
        }

    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

};
