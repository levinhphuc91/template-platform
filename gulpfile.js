var gulp = require('gulp');
var pug = require('gulp-pug')
var sass = require('gulp-sass')
var clean = require('gulp-clean')
var merge = require('merge-stream')
var concat = require('gulp-concat')
var notify = require('gulp-notify')
var runSequence = require('run-sequence')
var sourcemaps = require('gulp-sourcemaps')
var browserSync = require('browser-sync').create()


var distPath = './dist'
var htmlPath = './src/html'
var fontsPath = './src/assets/fonts'
var assetsPath = './src/assets'
var sassPath = './src/sass'
// Static server
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
  gulp.watch(assetsPath + '/**/*.{png,jpeg,jpg,gif,svg}', ['copy-assets'])
  gulp.watch(sassPath + '/**/*.sass', ['sass'])
  gulp.watch(htmlPath + '/**/*.pug', ['pug'])
})

gulp.task('clean', function () {
  return gulp.src(distPath, {read: false})
        .pipe(clean())
})

gulp.task('copy-fonts', function () {
  gulp.src([
    fontsPath + '/**/*.{eot,svg,woff2,woff,oft,ttf}'])
      .pipe(gulp.dest('./dist/assets/fonts'))
      .pipe(browserSync.stream())
})

gulp.task('sass', function () {
  return gulp.src(sassPath + '/index.sass')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', notify.onError(function (error) {
    return 'An error occurred while compiling sass.\nLook in the console for details.\n' + error
  })))
  .pipe(concat('index.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(distPath))
  .pipe(browserSync.stream())
})

gulp.task('copy-assets', function () {
  gulp.src(assetsPath + '/**/*.{png,jpeg,jpg,gif,svg}')
      .pipe(gulp.dest('./dist/assets'))
      .pipe(browserSync.stream())
})

gulp.task('pug', function buildHTML () {
  return gulp.src(htmlPath + '/index.pug')
  .pipe(pug({
    // Your options in here.
  }))
  .on('error', notify.onError(function (error) {
    return 'An error occurred while compiling pug.\nLook in the console for details.\n' + error
  }))
  .pipe(gulp.dest(distPath))
  .pipe(browserSync.stream())
})

gulp.task('vendor', function () {
  var bootstrapCss = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest(distPath + '/vendor'))

  return merge(bootstrapCss)
})

gulp.task('dev', function (done) {
  runSequence('clean', 'copy-assets', 'copy-fonts', 'vendor', 'sass', 'pug', 'browser-sync', done)
})

gulp.task('build', function (done) {
  runSequence('clean', 'copy-assets', 'copy-fonts', 'vendor', 'sass', 'pug', done)
})
