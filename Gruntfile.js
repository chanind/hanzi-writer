module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coffee: {
      main: {
        expand: true,
        cwd: "dist",
        src: ["**.coffee"],
        dest: "dist",
        ext: ".js"
      }
    },

    concat: {
      options: {
        separator: "\n"
      },
      main: {
        src: ['src/Drawable.coffee', 'src/Character.coffee', 'src/Stroke.coffee', 'src/HanziWriter.coffee'],
        dest: 'dist/hanzi-writer.coffee'
      }
    },

    copy: {
      main: {
        cwd: 'src/',
        src: '**',
        dest: 'dist/',
        expand: true
      }
    },

    clean: {
      pre: ['dist'],
      post: ['dist/**.coffee', 'dist/**.js', '!dist/hanzi-writer.js', '!dist/data.js']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean:pre', 'copy:main', 'concat:main', 'coffee:main', 'clean:post']);
};