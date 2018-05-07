var gulp = require('gulp');
var run = require('gulp-run-command').default;
var gulpSequence = require('gulp-sequence');

gulp.task('globals',run('npm run test'));

// gulp.task('test', run('npm run test'))
gulp.task('test', ['globals'], function (done) {
        process.exit(0);
});

gulp.task('setup',run('npm run setup'));
gulp.task('build',run('cd client && npm run build && cd ..'));
gulp.task('tar',run('tar cvf SnowshoeMetricsDashboard.tar ./bin ./client/build ./server ./server.js ./package.json ./client/package.json'));
gulp.task('buildArtifact')
gulp.task('package', ['setup','build','tar'], function (done) {
    process.exit(0);
});