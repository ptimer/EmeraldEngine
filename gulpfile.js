var gulp = require('gulp'),

    /** Utils */
    gutil = require('gulp-util'),
    browserSync   = require('browser-sync').create('game'),
    requireDir    = require('require-dir'),
    gulpAutoTask  = require('gulp-auto-task'),

    // Build CSS
    rename      = require('gulp-rename'),
    /** CSS */
    sass          = require('gulp-sass'),
    minifyCss     = require('gulp-minify-css'),
    autoprefixer  = require('gulp-autoprefixer'),


    gutil = require('gulp-util'),
  /** JS Specific */
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    es = require('event-stream'),
    /** Config */
    paths        = require('./package.json').paths;

/** Import Main Tasks */
// Require them so they can be called as functions
var utils = requireDir('gulp-tasks');
// Automagically set up tasks
gulpAutoTask('{*,**/*}.js', {
  base: paths.tasks,
  gulp: gulp
});

/**
 * BrowserSync
 */
// Init server to build directory
gulp.task('browser', function() {
  browserSync.init({
    server: "./" + paths.build,
    port: 4000
  });
});

// Force reload across all devices
gulp.task('browser:reload', function() {
  browserSync.reload();
});

/**
 * Main Builds
 */
gulp.task('serve', ['build', 'browser'], function() {
  // CSS/SCSS
  gulp.watch([
        paths.css.src +'main.scss',
        paths.css.src+'*.scss',
        paths.css.src +'**/*.scss',
  ], ['buildCss', 'browser:reload']);
  // JS
  gulp.watch([
         paths.src +'*.js',
         paths.src +'**/*.js',
         paths.src + '**/**/*.js'
    ], ['browserify', 'browser:reload']);

  gutil.log('Watching for changes.');
});

gulp.task('buildCss', function (cb) {

  gulp.src(paths.css.src + 'main.scss')
    .pipe(sass({
      includePaths: [paths.css.src]
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifyCss())
    .pipe(rename({ extname: '.bundle.css' }))
    .pipe(gulp.dest(paths.css.dest));

  cb(); // I'm done, yo!);
})


gulp.task('browserify', function (cb) {

  console.log('Creating app bundles.');

    var tasks = paths.js.entries.map(function (entry) { // bundle each entry individually
        return browserify({ entries : entry.path })
            .bundle()
            .pipe(source(entry.name)) // Convert bundle into type of stream gulp is expecting
            .pipe(rename({ extname: '.bundle.js' })) // add `.bundle.js` extension
            .pipe(gulp.dest(entry.dest))
            .on('end', function() {
                console.log('Bundled '+ gutil.colors.blue(entry.name));
            });
    });

    return es.merge.apply(null, tasks);
})




gulp.task('default', ['buildCss', 'browserify']);

gulp.task('build', ['default']);