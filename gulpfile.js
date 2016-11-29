// SET REQUIREMENTS ----------------------------------------------------------|
var gulp = require('gulp'),
	gutil = require('gulp-util'), 
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat');


// CORE TASKS ----------------------------------------------------------------|

// Default tasks
gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);

// Files to watch
gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
});

// Live Reload Server
gulp.task('connect', function() {
	connect.server({
		root: 'builds/development',
		livereload: true
	});
});


// PROCESS JS ----------------------------------------------------------------|

// Set Coffee and JS files
var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
]; // will be processed in array order

// Coffee Task
gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe( coffee({bare: true})
			.on('error', gutil.log) )
		.pipe( gulp.dest('components/scripts') )
});

// JS Task
gulp.task( 'js', function() {
	gulp.src(jsSources)
		.pipe( concat('script.js') )
		.pipe( browserify() )
		.pipe( gulp.dest('builds/development/js') )
		.pipe( connect.reload() )
});


// PROCESS SASS --------------------------------------------------------------|

// Set SASS Sources
var sassSources = ['components/sass/style.scss'];

// SASS Task (+ Compass)
gulp.task( 'compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded'
		})
		.on('error', gutil.log))
		.pipe(gulp.dest('builds/development/css'))
		.pipe( connect.reload() )
});

