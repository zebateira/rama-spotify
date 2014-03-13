module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'test/*.js']
    },
    jasmine: {
      test: {
        src: 'js/*.js',
        options: {
          vendor: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
          ],
          helpers: ['test/spechelper.js'],
          specs: ['test/*.spec.js']
        }
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
      files: ['Gruntfile.js', 'js/*.js', 'test/*.js', 'sass/*.scss'],
      tasks: ['jshint', 'compass', 'jasmine'],
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('test', ['jasmine']);
};