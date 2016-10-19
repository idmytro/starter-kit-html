var gulp = require('gulp');

var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var reload = browserSync.reload;

gulp.task('serve', ['sass', 'nunjucks', 'image', 'javascript'], function () {
    browserSync.init({server: "./app"});
    gulp.watch("app/src/**/*.+(html|nunjucks)", ['nunjucks']);
    gulp.watch("app/src/sass/*.scss", ['sass']);
    gulp.watch("app/src/images/**/*", ['image']);
    gulp.watch("app/src/javascript/*.js", ['javascript']);
    gulp.watch("app/*.html").on('change', reload);
});

gulp.task('nunjucks', function () {
    return gulp.src('app/src/pages/**/*.+(html|nunjucks)')
        .pipe(nunjucksRender({
            path: ['app/src/templates']
        }))
        .pipe(gulp.dest('app'))
        .pipe(reload({stream: true}));
});
gulp.task('sass', function () {
    return gulp.src("app/src/sass/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write("maps"))
        .pipe(gulp.dest("app/css"))
        .pipe(reload({stream: true}));
});

gulp.task('image', function () {
    gulp.src('app/src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('app/img'))
        .pipe(reload({stream: true}));
});

gulp.task('javascript', function () {
    gulp.src('app/src/javascript/*.js')
        .pipe(concat('app.min.js'))
        .pipe(jsmin())
        .pipe(gulp.dest('app/js'))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);