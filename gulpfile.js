var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
    source: ["src/*.module.js", "src/**/*.js"],
    dest: {
        min: "progressBarModule.min.js",
        normal: "progressBarModule.js",
        dir: "dist"
    },
    karma: {
        config: "karma.conf.js"
    }
};

// watch files for changes and reload
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: './examples/',
            index: 'index.html',
            routes: {
                "/bower_components": "bower_components",
                "/examples": "examples",
                "/src": "src"
            }
        }
    });

    gulp.watch([
        'examples/**/*.html',
        'examples/**/*.js',
        'examples/**/*.css',
        'src/**/*.js',
        'src/**/*.html'
    ], {cwd: './'}, reload);
});


gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(plugins.clean());
});

gulp.task('minify', function () {
    return gulp.src(config.source)
        // combine all source into one file
        .pipe(plugins.concat(config.dest.normal))
        // write max version
        .pipe(gulp.dest(config.dest.dir))
        // build and write min version
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        // rename the file
        .pipe(plugins.rename(config.dest.min))
        // before writing the map (this splits the stream)
        .pipe(plugins.sourcemaps.write("./"))
        .pipe(gulp.dest(config.dest.dir))
});


gulp.task('build', function (done) {
    plugins.runSequence('clean', ['minify'], done);
});


gulp.task('default', function() {

});