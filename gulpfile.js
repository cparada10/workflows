// SET REQUIREMENTS ----------------------------------------------------------|
var gulp = require('gulp'),
	gutil = require('gulp-util'), 
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHTML = require('gulp-minify-html'),
	concat = require('gulp-concat');


// CORE TASKS ----------------------------------------------------------------|

// Initialize Vars
var env, 
	coffeeSources, 
	jsSources,
	sassSources,
	htmlSources,
	outputDir,
	sassStyle;

// Check environment
env = process.env.NODE_ENV || 'development';

if( env === 'development' ) {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

// Default tasks
gulp.task('default', ['html', 'coffee', 'js', 'compass', 'connect', 'watch']);

// Files to watch
gulp.task('watch', function() {
	gulp.watch( coffeeSources, ['coffee'] );
	gulp.watch( jsSources, ['js'] );
	gulp.watch( 'components/sass/*.scss', ['compass'] );
	gulp.watch( htmlSources, ['html'] );
});

// Live Reload Server
gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

// Watch HTML Files
htmlSources = [
	'builds/development/*.html',
	outputDir + '*.html', 
	outputDir + '*.php',
	outputDir + 'js/*.json'
];
gulp.task('html', function() {
	gulp.src(htmlSources)
		.pipe( gulpif( env ===  'production', minifyHTML() ) )
		.pipe( gulpif( env ===  'production', gulp.dest(outputDir) ) )
		.pipe(connect.reload())
});


// PROCESS JS ----------------------------------------------------------------|

// Set Coffee and JS files
coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
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
		.pipe( gulpif( env === 'production', uglify() ) )
		.pipe( gulp.dest(outputDir + 'js') )
		.pipe( connect.reload() )
});


// PROCESS SASS --------------------------------------------------------------|

// Set SASS Sources
sassSources = ['components/sass/style.scss'];

// SASS Task (+ Compass)
gulp.task( 'compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: outputDir + 'images',
			style: sassStyle
		})
		.on('error', gutil.log))
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe( connect.reload() )
});

