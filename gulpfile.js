var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    browserSync = require('browser-sync').create(),
    imageMin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    del = require('del');

var path = {
  build: {
      html: 'build/',
      js: 'build/js/',
      css: 'build/css/',
      img: 'build/img/',
      fonts: 'build/fonts/',
      libs: 'build/libs/'
  },
  app: {
      html: 'app/**/*.html',
      js: 'app/js/main.js',
      css: 'app/css/',
      sass: 'app/sass/**/*.+(scss|sass)',
      img: 'app/img/**/*',
      fonts: 'app/fonts/**/*.*',
      libs: 'app/libs/**/*'
  },
  watch: {
      html: 'app/**/*.html',
      js: 'app/js/**/*.js',
      sass: 'app/sass/**/*.+(scss|sass)',
      css: 'app/css/**/*.css',
      img: 'app/img/**/*',
      fonts: 'app/fonts/**/*.css'
  },
  clean: './build'
};

gulp.task('server', function() {
  browserSync.init({
    server: {
        baseDir: "./app"
    },
    notify: false,
    ghostMode: false
  });
});

gulp.task('sass', function() {
  return gulp.src(path.app.sass)
    .pipe(sourcemaps.init({largeFile: true}))
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({browsers: ['last 10 versions']}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.app.css))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch(path.watch.sass, ['sass']);
  gulp.watch(path.watch.fonts).on('change', browserSync.reload);
  gulp.watch(path.watch.css).on('change', browserSync.reload);
  gulp.watch(path.watch.html).on('change', browserSync.reload);
});

gulp.task('build:concat', function() {
  return gulp.src(path.app.html)
    .pipe(useref())
    .pipe(gulpif('*.css', csso()))
    .pipe(gulp.dest(path.build.html))
});

gulp.task('build:fonts', function() {
  return gulp.src(path.app.fonts)
  .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build:image', function() {
  return gulp.src(path.app.img)
  .pipe(imageMin())
  .pipe(gulp.dest(path.build.img))
});

gulp.task('build:libs', function() {
  return gulp.src(path.app.libs)
  .pipe(gulp.dest(path.build.libs))
});

gulp.task('build', ['build:concat', 'build:libs', 'build:fonts', 'build:image']);

gulp.task('clean', function() {
  return del([path.clean])
});

gulp.task('default', ['server', 'watch']);