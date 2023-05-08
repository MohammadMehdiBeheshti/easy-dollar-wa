"use strict";

const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");

const scssFilesPath = "./scss/**/*.scss";

const buildStyles = () => {
	return src(scssFilesPath).pipe(sass().on("error", sass.logError)).pipe(rename("style.css")).pipe(dest("./styles/"));
};

const watchSass = () => {
	watch(scssFilesPath, buildStyles);
};

exports.default = series(buildStyles, watchSass);
