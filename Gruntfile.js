module.exports = function(grunt){

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            bundle: {
                options: {
                    banner: '/*! <%= pkg.name %> v<%= pkg.version %>\n @author <%= pkg.author %>\n <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    'dist/email-checker.js': ['src/*.js']
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
                tasks: ['browserify:bundle','uglify:build'],
                options: {
                    spawn: false
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

};
