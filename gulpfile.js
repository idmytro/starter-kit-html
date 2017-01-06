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
    browserSync.init({server: "./dist"});
    gulp.watch("src/**/*.+(html|nunjucks)", ['nunjucks']);
    gulp.watch("src/sass/**/*.scss", ['sass']);
    gulp.watch("src/images/**/*", ['image']);
    gulp.watch("src/javascript/*.js", ['javascript']);
    gulp.watch("src/pages/**/*.html").on('change', reload);
});

gulp.task('nunjucks', function () {
    return gulp.src('src/pages/**/*.+(html|nunjucks)')
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream: true}));
});
gulp.task('sass', function () {
    return gulp.src("src/sass/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write("maps"))
        .pipe(gulp.dest("dist/css"))
        .pipe(reload({stream: true}));
});

gulp.task('image', function () {
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
        .pipe(reload({stream: true}));
});

gulp.task('javascript', function () {
    gulp.src('src/javascript/*.js')
        .pipe(concat('app.min.js'))
        .pipe(jsmin())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);