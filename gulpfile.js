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

gulp.task('engine', ()=> {
    let debug = true;
    return (
        gulp.src([
            'src/lib/polifils/polifils.js',
            'src/lib/components/*.js',
            'src/lib/utils/*.js',
            'src/lib/core/core.js'
        ])
        .pipe(babel({
            //presets: ['es2015'],
            presets: [ ["es2015", {"loose": true}] ]
        }))
        .pipe(concat('reactiveForms.js'))
        .pipe(iife())
        .pipe(uglify({
            output: { // http://lisperator.net/uglifyjs/codegen
                beautify: debug,
                comments: debug ? true : /^!|\b(copyright|license)\b|@(preserve|license|cc_on)\b/i,
            },
            compress: { // http://lisperator.net/uglifyjs/compress, http://davidwalsh.name/compress-uglify
                sequences: !debug,
                booleans: !debug,
                conditionals: !debug,
                hoist_funs: false,
                hoist_vars: debug,
                warnings: debug,
            },
            mangle: !debug,
            outSourceMap: true,
            basePath: 'www',
            sourceRoot: '/'
        }))
        .pipe(gulp.dest('build/'))
    );
});

gulp.task('tutor', ()=> {
    let pageNames = fs.getDirListSync('src/tutorial/pages');
    let res = [];
    let css = fs.readFileSync(`src/tutorial/tmpl/prism.css`);
    pageNames.forEach((page,index)=>{
        let html = fs.readFileSync(`src/tutorial/pages/${page}/index.html`);
        let js = fs.readFileSync(`src/tutorial/pages/${page}/index.js`);

        let runCodeTmpl = fs.readFileSync(`src/tutorial/tmpl/runCode.html`);
        runCodeTmpl = parametrize(runCodeTmpl,{html,js});
        fs.createFolderSync('build/pages');
        fs.writeFileSync(`build/pages/${page}.html`,runCodeTmpl);

        let meta = JSON.parse(fs.readFileSync(`src/tutorial/pages/${page}/meta.json`));
        let itemTmpl = fs.readFileSync(`src/tutorial/tmpl/item.html`);
        let resCode = parametrize(itemTmpl,{
            title:meta.title,
            html: highlight(html),
            page,
            id: page,
            pageNum: meta.order,
            js: highlight(js)
        });
        res.push({meta,resCode});
    });
    res.sort((a,b)=>{return a.meta.order-b.meta.order});
    let tmpl = fs.readFileSync('src/tutorial/tmpl/index.html');
    tmpl = parametrize(tmpl,{
        html: res.map(it=>{return it.resCode}).join(''),
        css:`<style>${css}</style>`
    });
    fs.writeFileSync('build/index.html',tmpl);

    function parametrize(tmpl,params){
        Object.keys(params).forEach(key=>{
            tmpl = tmpl.split(`{{${key}}}`).join(params[key]);
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