'use strict';

let 
    browserSync    = require('browser-sync').create(),
    babelify       = require('babelify'),
    browserify     = require('browserify'),
    buffer         = require('vinyl-buffer'),
    gulp           = require('gulp'),
    gutil          = require('gulp-util'),
    source         = require('vinyl-source-stream'),
    changed        = require('gulp-changed'),
    sourcemaps     = require('gulp-sourcemaps'),
    plumber        = require('gulp-plumber'),
    autoprefixer   = require('gulp-autoprefixer'),
    sass           = require('gulp-sass'),
    moduleImporter = require('sass-module-importer'),
    uglify         = require('gulp-uglify');

const sourceDir = './app/';
const distDir = './dist/'

gulp.task('scripts', function () {
    let result = browserify({
        entries    : sourceDir+'app.js',
        extensions : ['.jsx'],
        plugins: ['babel-plugin-transform-es2015-for-of'],
        debug      : true
    })
    .transform(babelify, {
        stage: 0
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify().on('error', gutil.log))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(distDir));

    result.pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles', function () {
    let result = gulp.src(sourceDir+'styles/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(changed(distDir))
    .pipe(sass({
        importer: moduleImporter(),
        errLogToConsole: true,
        precision: 1
    }))
    .pipe(autoprefixer({
        browsers: ['last 45 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(distDir));

    result.pipe(browserSync.reload({ stream: true }));
});

gulp.task('assets', function () {
    var result = gulp.src(sourceDir+'assets/**/*.*')
        .pipe(changed(distDir))
        .pipe(gulp.dest(distDir));

        result.pipe(browserSync.reload({ stream: true }));
});

gulp.task('server', function () {
    browserSync.init(distDir+'**/*.*', {
        server: {
            baseDir: distDir,
        },
        port: 8080,
        notify: true
    });
});

gulp.task('build', [
    'scripts',
    'styles',
    'assets'
]);

gulp.task('watch', function(){
    gulp.watch([sourceDir+'**/*.js'], ['scripts']);
    gulp.watch([sourceDir+'styles/**/*.scss'], ['styles']);
    gulp.watch([sourceDir+'assets/**/*.*'], ['assets']);
});

gulp.task('default', ['build', 'server', 'watch']);