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

    webpack: {
      options: {
        module: {
          loaders: [
            { test: /\.js$/, loader: 'babel-loader' },
            { test: /\.js$/, loader: 'eslint-loader' }
          ],
        },
        eslint: {  
          configFile: '.eslintrc.js'
        },
        resolve: {
          // you can now require('file') instead of require('file.coffee')
          extensions: ['', '.js', '.json', '.coffee'] 
        }
      },
      dist: {
        entry: './src/HanziWriter.js',
        output: {
          filename: 'dist/hanzi-writer.js'       
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
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['clean:pre', 'copy:main', 'webpack:dist', 'uglify:dist', 'clean:post']);
};