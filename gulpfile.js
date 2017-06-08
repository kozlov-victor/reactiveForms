"use strict";

const browserify = require('browserify');
const stringify = require('stringify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const concat = require('gulp-concat');
const less = require('gulp-less');
const path = require('path');
const babel = require('gulp-babel');
const iife = require("gulp-iife");
const fs = require("./src/_internal/fs");
const Prism = require('node-prismjs');
const uglify = require('gulp-uglify');

const through = require("through2");

const customTask = fn=> {
    return through.obj(function (file, encoding, callback) {
        let contents = String(file.contents);
        let result = contents;
        // custom processing
        result = fn(contents);
        //

        file.contents = Buffer(result);

        if (file.sourceMap) {
            applySourceMap(file, result.sourceMap);
        }
        callback(null, file);
    });
};
gulp.task('engine', ()=> {
    let argv = require('yargs').argv;
    let debug = !argv.prod;
    return (
        gulp.src([
            'src/lib/polyfills/*.js',
            'src/lib/components/*.js',
            'src/lib/utils/*.js',
            'src/lib/engines/*.js',
            'src/lib/core/*.js'
        ])
        // browserify({
        //     entries: [
        //         './js/jqHelpers.js',
        //         './js/index.js'
        //     ],
        //     paths: ['../src/js/']
        // })
        .pipe(babel({
            //presets: ['es2015'],
            presets: [ ["es2015", {"loose": true}] ]
        }))
        .pipe(concat('reactiveForms.js'))
        .pipe(customTask((code)=>{
            let packageJson = JSON.parse(fs.readFileSync('package.json'));
            return code.replace('{{version}}',packageJson.version);
        }))
        .pipe(iife())
        // .pipe(uglify({
        //     output: { // http://lisperator.net/uglifyjs/codegen
        //         beautify: debug,
        //         comments: /^!|\b(copyright|license)\b|@(preserve|license|cc_on)\b/i
        //     },
        //     compress: { // http://lisperator.net/uglifyjs/compress, http://davidwalsh.name/compress-uglify
        //         sequences: !debug,
        //         booleans: !debug,
        //         conditionals: !debug,
        //         hoist_funs: false,
        //         hoist_vars: debug,
        //         warnings: debug
        //     },
        //     mangle: {toplevel: !debug},
        //     outSourceMap: true,
        //     basePath: 'www',
        //     sourceRoot: '/'
        // }))
        .pipe(gulp.dest('build/'))
    );
});

gulp.task('tutor', ()=> {
    let pageNames = fs.getDirListSync('src/tutorial/pages');
    let css = fs.readFileSync(`src/tutorial/tmpl/prism.css`);
    let headers = fs.readFileSync(`src/tutorial/tmpl/headers.html`);
    let packageJson = JSON.parse(fs.readFileSync('package.json'));
    let pages = [];
    pageNames.forEach((page,index)=>{
        let html = fs.readFileSync(`src/tutorial/pages/${page}/index.html`);
        let js = fs.readFileSync(`src/tutorial/pages/${page}/index.js`);
        let css = fs.readFileSync(`src/tutorial/tmpl/common.css`);

        let runCodeTmpl = fs.readFileSync(`src/tutorial/tmpl/runCode.html`);
        runCodeTmpl = parametrize(runCodeTmpl,{
            html,js,css,headers,
            salt:new Date().getTime()
        });
        fs.createFolderSync('build/pages');
        fs.writeFileSync(`build/pages/${page}.html`,runCodeTmpl);

        let meta = JSON.parse(fs.readFileSync(`src/tutorial/pages/${page}/meta.json`));
        pages.push({
            title:meta.title,
            html: highlight(html),
            page,
            id: page,
            pageNum: meta.order,
            js: highlight(js)
        });
    });
    pages.sort((a,b)=>{return a.pageNum-b.pageNum});
    let tmpl = fs.readFileSync('src/tutorial/tmpl/index.html');
    tmpl = parametrize(tmpl,{
        headers,
        version: packageJson.version,
        css:`<style>${css}</style>`,
        pages: JSON.stringify(pages)
    });
    fs.writeFileSync('build/index.html',tmpl);

    function parametrize(tmpl,params){
        Object.keys(params).forEach(key=>{
            tmpl = tmpl.split(`\${${key}}`).join(params[key]);
        });
        return tmpl;
    }

    function highlight(sourceCode, lang) {
        const language = Prism.languages[lang] || Prism.languages.autoit;
        return Prism.highlight(sourceCode, language);
    }

});

gulp.task('default', ['engine']);
gulp.task('all', ['engine','tutor']);