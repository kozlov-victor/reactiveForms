

let _getValByPath = function(component, path) {
    let keys = path.split('.');
    let lastKey = keys.pop();
    let contextForPath = component.modelView;
    let res = component.modelView;
    keys.forEach(function(key){
        if (res!==undefined) {
            res = res[key];
            if (typeof res === 'object') contextForPath = res;
        }
    });
    if (res!==undefined) res = res[lastKey];
    if (!component.disableParentScopeEvaluation && res===undefined && component.parent) {
        return _getValByPath(component.parent,path);
    }
    else {
        if (res && res.call) {
            return function() {
                return res.apply(contextForPath, Array.prototype.slice.call(arguments))
            }
        }
        return res;
    }
};
let getVal = (component,path)=>{
    return _getValByPath(component,path);
};
let RF_API = {getVal};
let RF_API_STR = '__RF__';

class ExpressionEngine {
    static getExpressionFn(code,unconvertedCodeTail = ''){
        code = code.split('\n').join('').split("'").join('"');
        let codeProcessed = `
                return ${Lexer.convertExpression(code,`${RF_API_STR}.getVal(component,'{expr}')`)}
        ` + unconvertedCodeTail;
        try {
            let fn = new Function('component',`${RF_API_STR}`,codeProcessed);
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
        try {
            return fn.call(component.modelView,component,RF_API);
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
    static setValueToContext(component,expression,value){
        let fn = null;
        try {
            let code = Lexer.convertExpression(
                expression,
                `${RF_API_STR}.getVal(component,'{expr}')`
            );
            code = `${RF_API_STR}.setVal(${code},value)`;
            fn = new Function('component',`${RF_API_STR}`,'value',code);
            fn(component,RF_API,value);
            // 'a[d].val[a]'.split(/\.(.[_$a-zA-Z]+)|(\[.?\])/)
        } catch(e){
            console.error('setting value error');
            console.error('current component',component);
            console.error('can not evaluate expression:' + expression);
            console.error(' at compiled fn:',fn);
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
