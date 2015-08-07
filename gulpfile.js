var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });

    gulp.watch([
        'index.html',
        'examples/**/*.html',
        'examples/**/*.js',
        'src/**/*.js',
        'src/**/*.html'
    ], {cwd: './'}, reload);
});

gulp.task('default', function() {

});