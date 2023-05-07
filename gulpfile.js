// import { src, dest, watch, series } from "gulp";
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));

function sassCompiler() {
	return gulp.src("./styles/style.scss").pipe(sass().on("error", sass.logError)).pipe(gulp.dest("./styles"));
}

exports.default = gulp.series(sassCompiler);
