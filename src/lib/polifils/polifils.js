
var ElementPrototype = typeof HTMLElement !== "undefined"
    ? HTMLElement.prototype : Element.prototype;

if (!ElementPrototype.remove) {
    ElementPrototype.remove = function () {
        this.parentNode.removeChild(this);
    };
}

if (!Object.keys) {
    // JScript in IE8 and below mistakenly skips over built-in properties.
    // https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
    var hasDontEnumBug = !({toString: true}).propertyIsEnumerable('toString');

    var getKeys = function(object) {
        var type = typeof object;
        if (type != 'object' && type != 'function' || object === null) {
            throw new TypeError('Object.keys called on non-object');
        }

        var keys = [];
        for (var key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                keys.push(key);
            }
        }
        return keys;
    }

    if (hasDontEnumBug) {
        var dontEnumProperties = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'prototypeIsEnumerable',
            'constructor'
        ];

        Object.keys = function(object) {
            var keys = getKeys(object);
            for (var ii = 0, il = dontEnumProperties.length; ii < il; ii++) {
                var property = dontEnumProperties[ii];
                if (object.hasOwnProperty(property)) {
                    keys.push(property);
                }
            }
            return keys;
        };
    } else {
        Object.keys = getKeys;
    }
}

if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(callback/*, initialValue*/) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this), len = t.length >>> 0, k = 0, value;
        if (arguments.length >= 2) {
            value = arguments[1];
        } else {
            while (k < len && ! (k in t)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}

if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function(callback, thisArg) {
        if (typeof this.length != 'number') return;
        if (typeof callback != 'function') return;

        if (typeof this == 'object') {
            for (var i = 0; i < this.length; i++) {
                if (i in this) {
                    callback.call(thisArg || this, this[i], i, this);
                } else {
                    return;
                }
            }
        }
    };
}

[].filter || (Array.prototype.filter = // Use the native array filter method, if available.
    function(a, //a function to test each value of the array against. Truthy values will be put into the new array and falsy values will be excluded from the new array
             b, // placeholder
             c, // placeholder
             d, // placeholder
             e // placeholder
    ) {
        c = this; // cache the array
        d = []; // array to hold the new values which match the expression
        for (e in c) // for each value in the array,
            ~~e + '' == e && e >= 0 && // coerce the array position and if valid,
            a.call(b, c[e], +e, c) && // pass the current value into the expression and if truthy,
            d.push(c[e]); // add it to the new array

        return d; // give back the new array
    });

if (!Object.create) {
    Object.create = function(o, props) {
        function F() {}
        F.prototype = o;

        if (typeof(props) === "object") {
            for (let prop in props) {
                if (props.hasOwnProperty((prop))) {
                    F[prop] = props[prop];
                }
            }
        }
        return new F();
    };
}

if (!window.Node)
    window.Node = {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3
    };


if("a'b".split(/(')/g).length==2){
    String.prototype.split = function(delimiter/*,limit*/){
        if(typeof(delimiter)=="undefined"){
            return [this];
        }
        var limit = arguments.length>1?arguments[1]:-1;
        var result = [];
        if(delimiter.constructor==RegExp){
            delimiter.global = true;
            var regexpResult,str=this,previousIndex = 0;
            while(regexpResult = delimiter.exec(str)){
                result.push(str.substring(previousIndex,regexpResult.index))
                for (var captureGroup=1,ct=regexpResult.length;captureGroup<ct;captureGroup++){
                    result.push(regexpResult[captureGroup]);
                }
                str=str.substring(delimiter.lastIndex,str.length);
            }
            result.push(str);
        }else{
            var searchIndex=0,foundIndex=0,len=this.length,dlen=delimiter.length;
            while(foundIndex!=-1){
                foundIndex = this.indexOf(delimiter,searchIndex);
                if(foundIndex!=-1){
                    result.push(this.substring(searchIndex,foundIndex))
                    searchIndex = foundIndex+dlen;
                }else{
                    result.push(this.substring(searchIndex,len));
                }
            }
        }
        if(arguments.length>1&&result.length>limit){
            result = result.slice(0,limit);
        }
        return result;
    }
}

