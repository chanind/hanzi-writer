var WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

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
              loader: 'babel-loader',
              query: {
                presets: ['env'],
                // plugins:[
                //   ['babel-plugin-transform-helper', {
                //       helperFilename: 'dist/tempHelper.js'
                //     }
                //   ]
                // ]
              }
            },
            {
              test: /\.js$/,
              loader: 'eslint-loader',
              exclude: [/node_modules/, /tempHelper/],
              options: {
                configFile: '.eslintrc'
              }
            }
          ],
        },
        plugins: [
          new WebpackBundleSizeAnalyzerPlugin('./reports/plain-report.txt')
        ]
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
          library: 'hanzi-writer',
          libraryTarget: 'commonjs2'
        }
      }
    },

    uglify: {
      dist: {
        options: {
          // mangle: {
          //   properties: {
          //     regex: /^_/
          //   }
          // }
        },
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
        'dist/data/APL',
      ]
    },

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['copy:main', 'webpack:dist', 'clean:post'],
        options: {
          spawn: false,
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['clean:pre', 'copy:main', 'copy:data', 'webpack:dist', 'webpack:lib', 'uglify:dist', 'clean:post']);
};