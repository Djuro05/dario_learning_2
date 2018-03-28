var gulp = require ('gulp');
    browserSync = require ('browser-sync').create(),
    concat = require ('gulp-concat'),
    cleanCSS = require ('gulp-clean-css'),
    rename = require ('gulp-rename'),
    uglify = require ('gulp-uglify'),
    notify = require ('gulp-notify'),
    svgmin = require('gulp-svgmin'),
    download = require ('gulp-download-stream')
    nunjucks = require('gulp-nunjucks-render'),
    tinypng = require ('gulp-tinypng'),
    sass = require ('gulp-sass');

//------------------------------Putanje------------------------------------------
var dir = {
    npm: 'node_modules'
  }
//------------------------------------------------------------------------------

//------------------------------BrowserSync-------------------------------------
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });
});
//------------------------------------------------------------------------------

//---Kompajliranje "app.css" datoteke koristeći sve .scss datoteke u projektu---
gulp.task('sass', function () {
  gulp.src('scss/app/app.scss')
  .pipe(sass({
    includePaths: [dir.npm]
  }).on('error', function(err) {return notify().write(err);}))
  .pipe(gulp.dest('build/css'))

});
//------------------------------------------------------------------------------

//-------------Kompajliranje svih .css datoteka u jednu main.css datoteku-------
// gulp.task('concatcss', function () {
//   gulp.src([
//     'css/*.css'])
//   .pipe(concat('main.css'))
//  .pipe(cleanCSS().on('error', function(err) {return notify().write(err);}))
//  .pipe(rename({
//             suffix: '.min'
//         }))
//   .pipe(gulp.dest('css/minifyed'))
//   .pipe(gulp.dest('build/css'))
// });
//------------------------------------------------------------------------------

//--------------Prijenos HTML datoteka u produkcijsku mapu----------------------
gulp.task('html', function () {
  gulp.src('html/*.html')
  .pipe(nunjucks({
    path: ['html/components', 'html/objects']
  }).on('error', function(err) {return notify().write(err);}))
  .pipe(gulp.dest('build'))
});

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

//-----------------Kompajliranje JavaScript datoteka----------------------------
gulp.task('js', function () {
  gulp.src([
    dir.npm + '/jquery/dist/jquery.min.js',
    'scripts/*.js'
  ])
  .pipe(concat('main.js'))
  .pipe(uglify().on('error', function(err) {return notify().write(err);}))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest('build/js'))
});
//------------------------------------------------------------------------------

//------------------Optimizacija slika------------------------------------------

gulp.task('png', function() {
  gulp.src('media/**/*.png')
  .pipe(tinypng('qvtT2BPQtOvhT-97B47ELxqa-Lcq5FUO'))
  .pipe(gulp.dest('build/media'));
});
//------------------------------------------------------------------------------

gulp.task('svg', function () {
  gulp.src('media/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('build/media'));
});


//------------------Gulp Watch funkcije------------------------------------------
gulp.task('watch', function () {

  gulp.watch('scss/**/*.scss', ['sass']).on('change', browserSync.reload);
  gulp.watch('html/**/*.html', ['html']).on('change', browserSync.reload);
  gulp.watch('scripts/*.js', ['js']).on('change', browserSync.reload);
});
//-----------------------------------------------------------------------------

//-------------------Pokretanje Gulp.js funkcija---------------------------------
gulp.task('default', ['sass', 'html', 'js', 'svg', 'browser-sync','png', 'watch']);
//-----------------------------------------------------------------------------
