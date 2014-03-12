module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js']
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
};