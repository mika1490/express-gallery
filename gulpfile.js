const gulp = require('gulp');
const sass = require('gulp-sass');

// SASS Compilation task
gulp.task('style', function() {
  gulp.src('./sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['style']);
});

// SASS Watcher
gulp.task('default', ['watch']);