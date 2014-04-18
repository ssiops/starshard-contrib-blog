/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    target: 'public',
    banner: '/**\n' +
              '* <%= pkg.name %> v<%= pkg.version %>\n' +
              '* Web-Essentials development package by <%= pkg.author %>\n' +
              '*/\n',

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/*.js']
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      application: {
        files: [{
          src: 'js/*.js',
          dest: '<%= target %>/js/',
          expand: true,
          flatten: true,
          ext: '.min.js'
        }]
      }
    },

    less: {
      options: {
        compile: true
      },
      style: {
        files: {
          '<%= target %>/css/style.css' : 'less/style.less'
        }
      },
      style_min: {
        options: {
          yuicompress: true
        },
        files: {
          '<%= target %>/css/style.min.css' : 'less/style.less'
        }
      }
    },

    copy: {
      js: {
        expand: true,
        cwd: 'js',
        src: '**',
        dest: '<%= target %>/js'
      },
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'copy:js', 'uglify:application']
      },
      less: {
        files: ['less/*.less', 'lib/less/*.less'],
        tasks: ['less']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['less', 'uglify']);

  grunt.registerTask('default', ['jshint', 'build', 'copy']);

  grunt.registerTask('dev', ['default', 'watch']);

  grunt.registerTask('test', ['default']);
};