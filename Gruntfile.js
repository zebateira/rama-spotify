module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'js/specs/*.js']
    },
    jasmine: {
      src: ['js/*.js'],
      options: {
        helpers: ['js/specs/spechelper.js'],
        specs: ['js/specs/*.spec.js']
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'sass',
          cssDir: 'css'
        }
      }
    },
    watch: {
      files: ['Gruntfile.js', 'js/*.js', 'sass/*.scss'],
      tasks: ['jshint', 'compass', 'jasmine']
    },
    cssmin: {
      compress: {
        files: {
          'css/main.min.css': ['css/main.css']
        }
      }
    },
    useminPrepare: {
      options: {
        dest: 'dist'
      },
      html: {
        src: ['index.html', 'views/*.html']
      },
      css: {
        src: 'css/main.min.css'
      }
    },
    usemin: {
      options: {
        dirs: ['dist']
      },
      html: ['dist/{,*/}*.html'],
      css: ['dist/css/{,*/}*.css']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('build', ['useminPrepare', 'usemin', 'compass', 'cssmin', 'concat', 'uglify']);
};