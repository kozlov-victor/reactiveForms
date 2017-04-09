
let _getValByPath = function(component, path) {
    let keys = path.split('.');
    let lastKey = keys.pop();
    let res = component.modelView;
    keys.forEach(function(key){
        if (res!==undefined) res = res[key];
    });
    if (res!==undefined) res = res[lastKey];
    if (!component.disableParentScopeEvaluation && res===undefined && component.parent) {
        return _getValByPath(component.parent,path);
    }
    else {
        if (res && res.call) {
            return function() {
                return res.apply(component.modelView, Array.prototype.slice.call(arguments))
            }
        }
        return res;
    }
};
let getVal = function(component,path){
    return _getValByPath(component,path);
};
let external = {getVal};

class ExpressionEngine {
    static getExpressionFn(code){
        code = code.split('\n').join('').split("'").join('"');
        let codeProcessed = `
                return ${Lexer.convertExpression(code,"external.getVal(component,'{expr}')")}
        `;
        try {
            let fn = new Function('component','external',codeProcessed);
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
        try {
            return fn.call(component.modelView,component,external);
        } catch(e){
            console.error('getting value error');
            console.error('can not evaluate expression:' + fn.expression);
            console.error('     at compiled function:' + fn.fnProcessed);
            console.error('component',component);
            throw e;
        }
    }

    static executeExpression(code,component){
        let fn = ExpressionEngine.getExpressionFn(code);
        return ExpressionEngine.runExpressionFn(fn,component);
    }

    /**
     * expression = 'user.name' object[field] = value
     */
    static setValueToContext(context,expression,value){
        let code = Lexer.convertExpression(expression,'context.{expr}')+`=value`;
        try {
            let fn = new Function('context','value',code);
            fn(context,value);
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
