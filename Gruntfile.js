module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      main: {
        cwd: 'src/',
        src: '**',
        dest: 'dist/',
        expand: true
      }
    },

    browserify: {
      dist: {
        files: {
          'dist/hanzi-writer.js': ['src/**/*.coffee']
        },
        options: {
          transform: ['coffeeify']
        }
      }
    },

    clean: {
      pre: ['dist'],
      post: ['dist/**.coffee', 'dist/**.js', '!dist/hanzi-writer.js', '!dist/data.js']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['clean:pre', 'copy:main', 'browserify:dist', 'clean:post']);
};