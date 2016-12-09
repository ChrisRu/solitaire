var gulp = require('gulp'),
	sass = require('gulp-sass'),
	nano = require('gulp-cssnano'),
	prefix = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync');

gulp.task('default', ['serve'], function () {
	gulp.watch('app/*.html', ['html']).on('change', browserSync.reload);
	gulp.watch("app/scripts/*.js", ['babel']).on('change', browserSync.reload);
	gulp.watch('app/styles/**/*.scss', ['sass']);
});

gulp.task('html', function() {
	return gulp.src('app/index.html')
		.pipe(gulp.dest('dist/'));
});

gulp.task('babel', function() {
	return gulp.src('app/scripts/script.js')
        .pipe(babel({
            presets: ['es2015']
        }))
		.pipe(uglify())
        .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('sass', function () {
	return gulp.src('app/styles/master.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(prefix({
			browsers: ['> 1%', 'IE 8'], 
            cascade: false
		}))
		.pipe(nano())
		.pipe(gulp.dest('dist/styles/'))
		.pipe(browserSync.stream());
});

gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: "dist"
		}
	});
});

gulp.task('dist', ['html', 'babel', 'sass']);