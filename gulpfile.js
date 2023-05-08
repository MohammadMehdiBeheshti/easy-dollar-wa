"use strict";

const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));

const sassFilePath = "./styles/style.scss" && "./styles/**/*.scss";

const buildStyles = () => {
	return src(sassFilePath).pipe(sass()).pipe(dest("./styles/"));
};

const watchSass = () => {
	watch(sassFilePath, buildStyles);
};

exports.default = series(buildStyles, watchSass);
