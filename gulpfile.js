const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const plumber = require('gulp-plumber')
const liveReload = require('gulp-server-livereload')
const fs = require('fs')


const paths = {
  src: {
    data: './src/data.js',
    styles: './src/styles/*.scss',
    html: `./src/**/*.pug`,
  },
  public: {
    default: './docs',
  },
  assets: './src/assets/**/*.*',
}

function html(){
  delete require.cache[require.resolve('./src/data.js')]
  const data = require('./src/data.js')

  return src(paths.src.html)
    .pipe(plumber())
    .pipe(pug({
      data,
    }))
    .pipe(dest(paths.public.default))
}

function css() {
  return src(paths.src.styles)
    .pipe(plumber())
    .pipe(sass())
    .pipe(dest(paths.public.default))
}

function assets(){
  return src(paths.assets)
    .pipe(dest(`${paths.public.default}/assets`))
}

function livereload(){
  return src(paths.public.default)
    .pipe(liveReload({
      livereload: true,
      open: true,
    }))
}

function watchForChanges(){
  watch(paths.src.data, html)
  watch(paths.src.styles, css)
  watch(paths.src.html, html)
  watch(paths.assets, assets)
}

exports.buildAndWatch = series(html, css, assets, livereload, watchForChanges)
exports.build = series(html, css, assets);