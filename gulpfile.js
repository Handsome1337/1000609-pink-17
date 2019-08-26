"use strict";

var gulp = require("gulp");

var posthtml = require("gulp-posthtml");

var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename= require("gulp-rename");

var server = require("browser-sync").create();

var imagemin = require("gulp-imagemin");

var del = require("del");

gulp.task("html", function () {
  return gulp.src("source/*.html")
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

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{jpg,png}")
  .pipe(imagemin([
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 3})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

/* Задача "images" опциональна. Можно было бы оптимизировать изображения в source,
и тогда задачи "build" и "start" работали бы гораздо быстрее, но мне кажется, что
в source логичнее иметь оригиналы изображений. Либо можно создать отдельную папку
в source/img для оригиналов изоображений, например, source/img/orig, в ней оставить
оригиналы, а в source/img оставить оптимизированные изображения */
gulp.task("build", gulp.series("clean", "copy", "html", "css", "images"));
gulp.task("start", gulp.series("build", "server"));
