module.exports = function(grunt) {
  grunt.initConfig({
    config: {
      dist: 'rama'
    },
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'test/*.js']
    },
    jasmine: {
      src: ['js/**/*.js'],
      options: {
        vendor: [
          'bower_components/underscore/underscore.js',
          'bower_components/jquery/dist/jquery.js',
          'bower_components/vis/dist/vis.js',
          'bower_components/jasmine-jquery/lib/jasmine-jquery.js'
        ],
        helpers: ['test/spechelper.js'],
        specs: ['test/*.spec.js']
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
      files: ['Gruntfile.js', 'js/**/*.js', 'sass/*.scss', 'test/*.js'],
      tasks: ['compass', 'jshint', 'jasmine']
    },
    useminPrepare: {
      html: 'index.html',
      options: {
        dest: '<%= config.dist %>'
      }
    },
    usemin: {
      html: ['<%= config.dist %>/index.html'],
      css: ['<%= config.dist %>/css/{,*/}*.css'],
      options: {
        assetDirs: ['<%= config.dist %>', '<%= config.dist %>/img']
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.',
          dest: '<%= config.dist %>',
          src: [
            'index.html',
            'css/main.css',
            'img/*',
            'views/*.html',
            'js/**/*',
            'manifest.json'
          ]
        }]
      },
      js: {
        src: '.tmp/concat/js/vendor.js',
        dest: '<%= config.dist %>/js/vendor.js'
      },
      css: {
        src: '.tmp/concat/css/vendor.css',
        dest: '<%= config.dist %>/css/vendor.css'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
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

  grunt.registerTask('test', [
    'jshint',
    'jasmine'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concat',
    'copy',
    'usemin'
  ]);
};