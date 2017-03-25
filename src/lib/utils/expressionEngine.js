
let _val = function(obj,path) {
    let keys = path.split('.');
    let lastKey = keys.pop();
    let res = obj;
    keys.forEach(function(key){
        if (res!==undefined) res = res[key];
    });
    if (res===undefined) return res;
    return res[lastKey];
};
let getVal = function(rootScope,localScope,path){
    let res = _val(rootScope,path);
    if (res==undefined && localScope) res = _val(localScope,path);
    if (res && res.call) return function(){res.apply(rootScope,Array.prototype.slice.call(arguments))};
    else return res;
};
let external = {getVal};

class ExpressionEngine {
    static getExpressionFn(code){
        code = code.split('\n').join('').split("'").join('"');
        let codeProcessed = `
                return ${Lexer.convertExpression(code,"external.getVal(rootScope,localScope,'{expr}')")}
        `;
        try {
            let fn = new Function('rootScope','localScope','external',codeProcessed);
            fn.expression = code;
            fn.fnProcessed = fn.toString();
            //console.log(fn.fnProcessed);
            return fn;
        } catch(e){
            console.error('can not compile function from expression');
            console.error('expression',code);
            console.error('compiled code',codeProcessed);
        }

    }
    static runExpressionFn(fn,component){
        let localScope = component.localModelView;
        try {
            let res = fn.call(component.modelView,component.modelView,localScope,external);
            if (res==undefined && component.parent) res = ExpressionEngine.runExpressionFn(fn,component.parent);
            return res;
        } catch(e){
            console.error('getting value error');
            console.error('can not evaluate expression:' + fn.expression);
            console.error('     at compiled function:' + fn.fnProcessed);
            console.error('rootScope',component.modelView);
            console.error('localScope',localScope);
            throw e;
        }
    }
    /**
     * expression = 'user.name' object[field] = value
     */
    static setValueToContext(context,expression,value){
        let quotes = '';
        if (typeof value == 'string') quotes = '"';
        let code = Lexer.convertExpression(expression,'context.{expr}')+`=${quotes}${value}${quotes}`;
        try {
            let fn = new Function('context',code);
            fn(context);
        } catch(e){
            console.error('setting value error');
            console.error('can not evaluate expression:' + expression);
            console.error('     at compiled function',code);
            console.error('current context',context);
            console.error('desired value to set',value);
            throw e;
        }
    }
    /**
     *  "{a:1}"
     * @param code
     * @returns {*}
     */
    static getObjectFromString(code) {
        try  {
            let fn = new Function('return (' + code + ')');
            return fn();
        } catch(e){
            console.error('can not parse properties: ' + code);
            throw e;
        }
    }
}
