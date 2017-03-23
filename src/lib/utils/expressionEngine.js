

class ExpressionEngine {
    static getExpressionFn(code){
        code = code.split('\n').join('').split("'").join('"');
        let codeProcessed = `
                var _val = function(obj,path) {
                    var keys = path.split('.');
                    var lastKey = keys.pop();
                    var res = obj;
                    keys.forEach(function(key){
                        res = res[key];
                    });
                    return res[lastKey];
                }
                var getVal = function(path){
                    var res = _val(rootScope,path);
                    if (res==undefined && localScope) res = _val(localScope,path);
                    return res;
                };
                return ${Lexer.convertExpression(code,"getVal('{expr}')")}
        `;
        try {
            let fn = new Function('rootScope','localScope',codeProcessed);
            fn.expression = code;
            fn.fnProcessed = fn.toString();
            return fn;
        } catch(e){
            console.error('can not compile function from expression');
            console.error('expression',code);
            console.error('compiled code',codeProcessed);
        }

    }
    static runExpressionFn(fn,component){
        var localScope = component.localModelView;
        try {
            return fn(component.modelView,localScope);
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
