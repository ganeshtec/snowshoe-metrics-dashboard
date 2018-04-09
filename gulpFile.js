var gulp = require('gulp');
var run = require('gulp-run-command').default;

gulp.task('test', run('npm run test'), function (done) {
    console.log("DONE RUNNING TESTS")
})

