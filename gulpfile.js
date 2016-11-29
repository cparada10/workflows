// SET REQUIREMENTS ----------------------------------------------------------|
var gulp = require('gulp'),
	gutil = require('gulp-util'), 
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	concat = require('gulp-concat');

// gulp.task('log', function() {
// 	gutil.log('Workflows are awesome');
// });

gulp.task('default', ['coffee', 'js', 'compass', 'watch']);

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
});

// PROCESS JS ----------------------------------------------------------------|

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
]; // will be processed in array order


gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({bare: true})
			.on('error', gutil.log)
		)
		.pipe(gulp.dest('components/scripts'))
});

gulp.task( 'js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'))
});


// PROCESS SASS --------------------------------------------------------------|

var sassSources = ['components/sass/style.scss'];

gulp.task( 'compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded'
		})
		.on('error', gutil.log))
		.pipe(gulp.dest('builds/development/css'))
});

