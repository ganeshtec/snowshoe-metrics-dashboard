var gulp = require('gulp');
var run = require('gulp-run-command').default;

gulp.task('globals');

// gulp.task('test', run('npm run test'))
gulp.task('test', ['globals'], function (done) {
        process.exit(0);
});
