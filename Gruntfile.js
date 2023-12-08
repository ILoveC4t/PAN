module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['src/**'],
        tasks: ['dev'],
        options: {
          spawn: false,
        },
      },
    },
    browserify: {
      menu: {
        src: ['src/js/pages/menu/index.js'],
        dest: 'dest/js/menu.js',
      },
      game: {
        src: ['src/js/pages/game/index.js'],
        dest: 'dest/js/game.js',
      },
      test: {
        src: ['src/js/pages/test/index.js'],
        dest: 'dest/js/test.js',
      },
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src/', src: ['**', '!js/**'], dest: 'dest/'}
        ],
      },
    },
    zip: {
      'using-cwd': {
        cwd: 'dest/',
        src: ['dest/**'],
        dest: 'dest/zip/dest.zip'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify:menu', 'browserify:game', 'copy', 'zip']);
  grunt.registerTask('dev', ['browserify:menu', 'browserify:game', 'browserify:test', 'copy']);
};
