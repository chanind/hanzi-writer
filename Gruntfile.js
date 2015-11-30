module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      main: {
        cwd: 'src/',
        src: '**',
        dest: 'dist/',
        expand: true
      },
      data: {
        cwd: 'data/',
        src: '**',
        dest: 'dist/data/',
        expand: true
      }
    },

    webpack: {
      options: {
        module: {
          loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                cacheDirectory: true,
                presets: ['es2015', 'stage-2']
              }
            },
            {
              test: /\.js$/,
              loader: 'eslint-loader',
            }
          ],
        },
         eslint: {  
          configFile: '.eslintrc'
        }
      },

      dist: {
        entry: './src/HanziWriter.js',
        output: {
          filename: 'dist/hanzi-writer.js'
        }
      },

      lib: {
        entry: './src/HanziWriter.js',
        output: {
          filename: 'dist/hanzi-writer-lib.js',
          library: true,
          libraryTarget: 'commonjs2'
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/hanzi-writer.min.js': ['dist/hanzi-writer.js'],
          'dist/hanzi-writer-lib.min.js': ['dist/hanzi-writer-lib.js']
        }
      }
    },

    clean: {
      pre: ['dist'],
      post: [
        'dist/*',
        '!dist/hanzi-writer.js',
        '!dist/hanzi-writer.min.js',
        '!dist/hanzi-writer-lib.js',
        '!dist/hanzi-writer-lib.min.js',
        '!dist/data',
      ]
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['clean:pre', 'copy:main', 'copy:data', 'webpack:dist', 'webpack:lib', 'uglify:dist', 'clean:post']);
};