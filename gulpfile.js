var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var supervisor = require('gulp-supervisor');

gulp.task('jsx', function () {
    return browserify(['./src/app.jsx'],
            {
                extensions: ['.jsx'],
                debug: true,
                paths: ['./src/jsx/']
            })
        .transform(babelify)
        .bundle()
        .on('error', handleError)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('html', function(){
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
  gulp.src('./src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'));
});


gulp.task('default', ['browser-sync']);

gulp.task('browser-sync', ['supervisor'], function() {
	console.log('browser-sync');
    browserSync.init({
		proxy: "http://localhost:8080",
        port: 3000
	});

    //gulp.watch("src/*.scss", ['sass']);
    gulp.watch("src/*.html", ['html-watch']);
    gulp.watch("src/**/*.jsx", ['js-watch']);
    gulp.watch("src/*.scss", ['css-watch']);
});

// create a task that ensures the js/html task is complete before reloading
gulp.task('js-watch', ['jsx'], browserSync.reload);
gulp.task('html-watch', ['html'], browserSync.reload);
gulp.task('css-watch', ['css'], browserSync.reload);

gulp.task( "supervisor", ['jsx', 'html', 'css'], function() {
    supervisor( "server.js", {
        watch: [ "server.js" ],
        pollInterval: 1000,
        extensions: [ "js" ],
        exec: "node",
        debug: true
    } );
} );
