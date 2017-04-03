

class MiscUtils {

    /**
     * @param obj
     * @returns {*}
     */
    static deepCopy(obj) {
        if (obj===undefined) return undefined;
        else if (obj===null) return null;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            let out = [], i = 0, len = obj.length;
            for (; i < len; i++) {
                out[i] = MiscUtils.deepCopy(obj[i]);
            }
            return out;
        }
        if (typeof obj === 'object') {
            let out = {};
            for (let i in obj) {
                out[i] = MiscUtils.deepCopy(obj[i]);
            }
            return out;
        }
        return obj;
    }

    /**
     * @param x
     * @param y
     * @returns {*}
     */
    static deepEqual(x, y) {
        //if (isNaN(x) && isNaN(y)) return true;
        return (x && y && typeof x === 'object' && typeof y === 'object') ?
            (Object.keys(x).length === Object.keys(y).length) &&
            Object.keys(x).reduce(function (isEqual, key) {
                return isEqual && MiscUtils.deepEqual(x[key], y[key]);
            }, true) : (x === y);
    }

    static camelToSnake(str) {
        return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
    }

}

