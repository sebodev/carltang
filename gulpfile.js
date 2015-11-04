///////////
// Setup //
///////////

// Project Variables
//
var url         = 'carltang.dev',
    lang        = 'languages/',
    source      = 'assets/src/',
    dest        = 'assets/',
    bower       = 'bower_components/'
;

// Gulp Settings & Startup
//
var gulp        = require('gulp'),
    sass        = require('gulp-ruby-sass'),
    gutil       = require('gulp-util'),
    plugins     = require('gulp-load-plugins')({ camelize: true }) // This loads all modules prefixed with "gulp-" to plugin.moduleName,
    del         = require('del'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;
;


////////////
// Styles //
////////////

// Process Stylesheets
//
gulp.task('styles', function() {
  return sass(source + 'scss/forward/style.scss', {
    style: 'expanded',
    loadPath: bower
  })
  .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
  .pipe(plugins.combineMediaQueries())
  .pipe(plugins.minifyCss({ keepSpecialComments: 1, keepBreaks: true, compatibility: 'ie8' }))
  .pipe(plugins.pixrem())
  .pipe(gulp.dest('./'))
  .pipe(browserSync.reload({ stream: true }))
});


/////////////
// Scripts //
/////////////

// Scripts; broken out into different tasks to create specific bundles which are then compressed in place
//
gulp.task('scripts', ['scripts-lint', 'scripts-core', 'scripts-extras'], function(){
  return gulp.src([dest+'js/**/*.js', '!'+dest+'js/**/*.min.js']) // Avoid recursive min.min.min.js
  .pipe(plugins.rename({suffix: '.min'}))
  .pipe(plugins.uglify())
  .pipe(gulp.dest(dest+'js/'));
});

// Lint scripts for errors and sub-optimal formatting
//
gulp.task('scripts-lint', function() {
  return gulp.src(source+'js/**/*.js')
  .pipe(plugins.jshint('.jshintrc'))
  .pipe(plugins.jshint.reporter('default'));
});

// These are the core custom scripts loaded on every page; pass an array to bundle several scripts in order
//
gulp.task('scripts-core', function() {
  return gulp.src([
    source+'js/core.js'
    //, source+'js/navigation.js' // An example of how to add files to a bundle
  ])
  .pipe(plugins.concat('core.js'))
  .pipe(gulp.dest(dest+'js/'));
});

// An example task for extra scripts that aren't loaded on every page
//
gulp.task('scripts-extras', function() {
  return gulp.src([
    // You can also add dependencies from Bower components e.g.: bower+'dependency/dependency.js',
    source+'js/extras.js'
  ])
  .pipe(plugins.concat('extras.js'))
  .pipe(gulp.dest(dest+'js/'));
});


///////////
// Bower //
///////////

// Executed on `bower update` which is in turn triggered by `npm update`; use this to manually copy front-end dependencies into your working source folder
//
gulp.task('bower', ['bower-normalize']);

// Used to get around Sass's inability to properly @import vanilla CSS
//
gulp.task('bower-normalize', function() {
  return gulp.src(bower+'normalize.css/normalize.css')
  .pipe(plugins.rename('_normalize.scss'))
  .pipe(gulp.dest(source+'scss/base'));
});


//////////////////
// Browser Sync //
//////////////////

gulp.task('browser-sync', function() {
    browserSync({
        proxy: url
        // Port setting for MAMP users
        // , port: 8888
    });
});

// Watch Task
//
gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(source+'scss/**/*.scss', ['styles']);
  gulp.watch([source+'js/**/*.js', bower+'**/*.js'], ['scripts']);
  gulp.watch(source+'**/*(*.png|*.jpg|*.jpeg|*.gif)', ['images']);
});

// Default Task (Watch)
//
gulp.task('default', ['watch']);
