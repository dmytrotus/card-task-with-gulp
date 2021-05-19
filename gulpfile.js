"use strict";
const gulp = require('gulp');
const autoprefixer = require("gulp-autoprefixer");
const sass = require('gulp-sass');
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const plumber = require("gulp-plumber");
const header = require("gulp-header");
const { series } = require('gulp');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}


// CSS task
function css() {
  return gulp
    .src("scss/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest("./bundle/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./bundle/css"))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("scss/*.scss", css);
}

// Define complex tasks
const build = gulp.series(gulp.parallel(css));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.build = build;
exports.watch = watch;
exports.default = build;


