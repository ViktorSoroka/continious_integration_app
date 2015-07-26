var autoprefixer = require('gulp-autoprefixer');
var bower = require('gulp-bower');
var cached = require('gulp-cached');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var del = require('del');
var filter = require('gulp-filter');
var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var mainBowerFiles = require('main-bower-files');
var remember = require('gulp-remember');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var jasmine = require('gulp-jasmine');
var browserify  = require('gulp-browserify');

var pathConf = {
  src: 'src/js/**/*.js',
  specs: 'tests/**/*.js',
  gulpfile: 'gulpfile.js'
};

var conf = {
  less: 'src/less/*.less',
  js: 'src/js/*.js',
  bootstrap: {
    less: 'bower_components/bootstrap/less/bootstrap.less',
    js: 'bower_components/bootstrap/dist/js/bootstrap.js'
  },
  build: {
    folder: 'build',
    css: 'build/css',
    js: 'build/js'
  }
};
gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('bower_components'));
});
gulp.task('jshint', function () {
  return gulp.src(conf.js)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
  return gulp.src(conf.js)
    .pipe(jscs())
    .on('error', errorHandler);
});

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('style', function () {
  return gulp.src([conf.bootstrap.less, conf.less])
    .pipe(cached())
    .pipe(less())
    .pipe(autoprefixer(['last 2 version']))
    .pipe(remember())
    .on('error', errorHandler)
    .pipe(gulp.dest(conf.build.css));
});

gulp.task('style-build', ['bower'], function () {
  return gulp.src([conf.bootstrap.less, conf.less])
    .pipe(less())
    .pipe(autoprefixer(['last 2 version']))
    .pipe(concat('all.css'))
    .pipe(csso())
    .pipe(gulp.dest(conf.build.css));
});

gulp.task('prepare', ['style']);

gulp.task('build', ['style-build', 'html-build', 'script-build']);

gulp.task('watch', ['prepare'], function () {
  return gulp.watch(conf.less, ['style']);
});

gulp.task('clean', function (cb) {
  del([conf.build.folder, conf.build.folder], cb);
});

gulp.task('html-build', function () {
  return gulp.src('src/*.html')
    .pipe(htmlreplace({
      'css': './css/all.css',
      'js': './js/all.js'
    }))
    .pipe(gulp.dest(conf.build.folder));
});

gulp.task('vendor-script-build', ['bower'], function () {
  return gulp.src(mainBowerFiles())
    .pipe(filter('*.js'))
    .pipe(concat('all.js'))
    .pipe(gulp.dest(conf.build.js));
});

gulp.task('script-build', ['vendor-script-build', 'lint'], function () {
  return gulp.src([conf.build.js + '/*.js', conf.js])
    .pipe(concat('all.js'))
    .pipe(browserify())
    .pipe(uglify())
    .pipe(gulp.dest(conf.build.js));
});

function errorHandler(err) {
  util.log(util.colors.red('Error'), err.message);
  this.end();
}

gulp.task('test', function () {
  return gulp.src(pathConf.specs)
    .pipe(jasmine());
});
