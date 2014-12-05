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

    uglify: {
      dist: {
        files: {
          'dist/hanzi-writer.min.js': ['dist/hanzi-writer.js']
        }
      }
    },

    clean: {
      pre: ['dist'],
      post: ['dist/**.coffee', 'dist/**.js', '!dist/hanzi-writer.js', '!dist/hanzi-writer.min.js', '!dist/data.js']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['clean:pre', 'copy:main', 'browserify:dist', 'uglify:dist', 'clean:post']);
};