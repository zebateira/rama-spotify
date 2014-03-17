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
    useminPrepare: {
      html: 'index.html',
      options: {
        dest: 'dist'
      }
    },
    usemin: {
      html: ['dist/index.html'],
      css: ['dist/css/{,*/}*.css'],
      options: {
        assetDirs: ['dist', 'dist/img']
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.',
          dest: 'dist',
          src: [
            'index.html',
            'css/main.css',
            'img/*',
            'views/*.html',
            'js/*',
            'manifest.json'
          ]
        }]
      },
      js: {
        src: '.tmp/concat/js/vendor.js',
        dest: 'dist/js/vendor.js'
      },
      css: {
        src: '.tmp/concat/css/vendor.css',
        dest: 'dist/css/vendor.css'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*',
          ]
        }]
      },
      server: '.tmp'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concat',
    'copy',
    'usemin'
  ]);
};