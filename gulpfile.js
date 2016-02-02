var path = require('path');
var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var webpack = require('gulp-webpack');

var config = {
	port: 8888,
	paths: {
		src: path.resolve(__dirname, 'src'),
		dist: path.resolve(__dirname, 'dist')
	}
};

gulp.task('server', function(){
	connect.server({
		root: config.paths.dist,
		port: config.port,
		livereload: true
	});
});

gulp.task('html', function(){
	gulp.src(config.paths.src + '/**/*.html')
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('imagemin', function(){
	gulp.src(config.paths.src + '/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest(config.paths.dist + '/images'))
		.pipe(connect.reload());
});

gulp.task('sass', function(){
	gulp.src(config.paths.src + '/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('js', function(){
	gulp.src('src/js/app.js')
		.pipe(webpack({
			context: config.paths.src + '/js',
			entry: './app.js',
			output: {
				path: config.paths.dist,
				filename: 'app.bundle.js'
			},
			module: {
				loaders: [
					{	
						test: /\.jsx?$/,
						loader: 'babel-loader',
						exclude: /node_modules/,
						query: {
							presets: ['es2015', 'react', 'stage-1']
						}
					}
				]
			}
		}))
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('watch', function(){
	gulp.watch(config.paths.src + '/**/*.html', ['html']);
	gulp.watch(config.paths.src + '/**/*.js', ['js']);
	gulp.watch(config.paths.src + '/images/*', ['imagemin']);
	gulp.watch(config.paths.src + '/**/*.scss', ['sass']);
});

gulp.task('default', ['server', 'watch']);