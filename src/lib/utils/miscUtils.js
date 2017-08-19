

class MiscUtils {

    /**
     * @param obj
     * @param _clonedObjects - internal store of cloned object to avoid self-cycled object recursion
     * @returns {*}
     */
    static deepCopy(obj, _clonedObjects = []) {
        if (obj===undefined) return undefined;
        else if (obj===null) return null;
        else if (typeof window !== 'undefined' && obj===window) return undefined;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            let out = [], i = 0, len = obj.length;
            for (; i < len; i++) {
                let clonedObject;
                if (_clonedObjects.indexOf(obj[i])>-1) {
                    clonedObject = obj[i];
                } else {
                    _clonedObjects.push(obj[i]);
                    clonedObject = MiscUtils.deepCopy(obj[i],_clonedObjects);
                }
                out[i] = clonedObject;
            }
            return out;
        }
        if (typeof obj === 'object') {
            let out = {};
            for (let i in obj) {
                let clonedObject;
                if (_clonedObjects.indexOf(obj[i])>-1) {
                    clonedObject = obj[i];
                } else {
                    _clonedObjects.push(obj[i]);
                    clonedObject = MiscUtils.deepCopy(obj[i],_clonedObjects);
                }
                out[i] = clonedObject;
            }
            return out;
        }
        return obj;
    }

    static superficialCopy(a,b){
        if (!(a && b)) return;
        Object.keys(b).forEach(key=>{
            a[key] = b[key];
        })
    }

    /**
     * @param x
     * @param y
     * @param _checkCache - circular structure holder
     * @returns {*}
     *
     */
    static deepEqual(x, y, _checkCache = []) {
        //if (isNaN(x) && isNaN(y)) return true;
        if (x && y && typeof x === 'object' && typeof y === 'object') {
            if (x===y) return true;
            if (_checkCache.indexOf(x)>-1 || _checkCache.indexOf(y)>-1) return true;
            _checkCache.push(x);
            _checkCache.push(y);
            return (Object.keys(x).length === Object.keys(y).length) &&
                Object.keys(x).reduce((isEqual, key)=> {
                    return isEqual && MiscUtils.deepEqual(x[key], y[key], _checkCache);
                },true);
        } else {
            return x===y;
        }

    }

    static camelToSnake(str) {
        return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
    }

    static getUID(){
        return cnt++;
    }

    static objectToArray(obj){
        let res = [];
        Object.keys(obj).forEach(key=>{
            res.push({key,value:obj[key]})
        });
        return res;
    }

    static copyMethods(src,dest){
        Object.keys(dest).forEach(name=>{
            src[name] = dest.name;
        })
    }

}


let cnt = 0;

