

const fs = require('fs');
const path = require('path');

class FS {
    copyFileSync(source, target) {
        let pathArr = target.split('/');
        pathArr.pop();
        let targetPath = pathArr.join('/');
        if (!module.exports.existsSync(targetPath)) this.createFolderSync(targetPath);
        fs.createReadStream(source).pipe(fs.createWriteStream(target));
    }

    existsSync(target){
        return fs.existsSync(target);
    }

    deleteFileSync(source) {
        fs.existsSync(source) && fs.unlinkSync(source);
    }

    readFileSync(path,asBin) {
        return fs.readFileSync(path, asBin?undefined:"utf8");
    }

    createFileSync(path,content){
        if (fs.existsSync(path)) return;
        this.writeFileSync(
            path,
            content||''
        );
    }

    writeFileSync(path, content,asBin) {
        let opts = asBin?undefined:{encoding: "utf-8"};
        fs.writeFileSync(path,content,opts);
    }

    copyFolderSync(src, dest) {
        let exists = fs.existsSync(src);
        let stats = exists && fs.statSync(src);
        let isDirectory = exists && stats.isDirectory();
        if (exists && isDirectory) {
            !fs.existsSync(dest) && fs.mkdirSync(dest);
            fs.readdirSync(src).forEach((childItemName)=> {
                this.copyFileSync(path.join(src, childItemName),
                    path.join(dest, childItemName));
            });
        } else {
            fs.linkSync(src, dest);
        }
    }

    _read(path,res,contentType){
        fs.readdirSync(path).forEach((file)=>{
            if (fs.statSync(path+'/'+file).isDirectory()) {
                this._read(path+'/'+file,res);
            } else {
                res.push({name:file,fullName: path+'/'+file, content:fs.readFileSync(path+'/'+file, contentType)});
            }
        });
    }

    readDirSync(path,contentType){
        let res = [];
        this._read(path,res,contentType);
        return res;
    }

    getDirListSync(srcpath){
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }

    deleteFolderSync(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file, index)=> {
                let curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteFolderSync(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }

    createFolderSync(path) {
        try {
            let pathSeq = '';
            path.split('/').forEach((fldr)=>{
                pathSeq+=fldr;
                if (!fs.existsSync(pathSeq)) fs.mkdirSync(pathSeq);
                pathSeq+='/';
            });
            fs.mkdirSync(path);
        } catch (e) {
            if (e.code != 'EEXIST') throw e;
        }
    }

    renameSync(oldName,newName){
        fs.renameSync(oldName,newName);
    }

}


module.exports = new FS();