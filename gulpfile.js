"use strict";

var gulp = require("gulp");

var htmlmin = require("gulp-htmlmin");

var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename= require("gulp-rename");

var server = require("browser-sync").create();

var uglify = require("gulp-uglify");
var concat = require("gulp-concat");

var imagemin = require("gulp-imagemin");

var del = require("del");

gulp.task("html", function () {
  return gulp.src("source/*.html")
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("js", function () {
  return gulp.src(["source/js/*.js", "node_modules/svgxuse/svgxuse.js", "node_modules/picturefill/dist/picturefill.js"])
  .pipe(concat("script.js"))
  .pipe(gulp.dest("build/js"))
  .pipe(rename("script.min.js"))
  .pipe(uglify())
  .pipe(gulp.dest("build/js"));
});

gulp.task("images", function () {
  return gulp.src("source/img/original/*.{jpg,png}")
  .pipe(imagemin([
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 3})
  ]))
  .pipe(gulp.dest("source/img"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/*.*"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series("clean", "html", "copy", "css", "js"));
gulp.task("start", gulp.series("build", "server"));
