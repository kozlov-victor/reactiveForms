

let _getValByPath = function(component, path) {
    if (!path) return component.modelView;
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

let getterFnCache = {};
let setterFnCache = {};

class ExpressionEngine {
    static getExpressionFn(code,unconvertedCodeTail = ''){
        let codeRaw = code;
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
            console.error({
                debugContext: {
                    expression: codeRaw,
                    compiled: codeProcessed,
                    exception: e
                }
            });
            throw e;
        }

    }


    static runExpressionFn(fn,component){
        try {
            return fn.call(component.modelView,component,RF_API);
        } catch(e){
            console.error('getting value error');
            console.error({
                debugContext: {
                    expression: fn.expression,
                    compiled: fn.fnProcessed,
                    component: component,
                    exception: e
                }
            });
            throw e;
        }
    }

    static executeExpression(code,component){
        let fn = getterFnCache[code];
        if (!fn) {
            fn = getterFnCache[code] = ExpressionEngine.getExpressionFn(code)
        }
        return ExpressionEngine.runExpressionFn(fn,component);
    }

    /**
     * i.e.
     * object[field] = value
     * object.field = value
     * object['field'] = value
     */
    static setValueToContext(component,expression,value){
        let fn = setterFnCache[expression];
        try {
            if (!fn) {
                let exprTokens = expression.split(/(\..[_$a-zA-Z0-9]+)|(\[.+])/).filter(it=>{return !!it;});
                let lastToken = exprTokens.pop();
                if (lastToken.indexOf('[')==0) {
                    lastToken = lastToken.replace('[','').replace(']','');
                    lastToken = Lexer.convertExpression(lastToken,`${RF_API_STR}.getVal(component,'{expr}')`);
                    lastToken = `[${lastToken}]`;
                } else if (!exprTokens.length) {
                    lastToken = `.${lastToken}`;
                }
                expression = exprTokens.join('');
                expression = Lexer.convertExpression(expression,`${RF_API_STR}.getVal(component,'{expr}')`);
                expression = `${expression}${lastToken}=value`;
                setterFnCache[expression] = fn = new Function('component',`${RF_API_STR}`,'value',expression);
            }
            fn(component,RF_API,value);
        } catch(e){
            console.error('setting value error');
            console.error({
                debugContext: {
                    expression: expression,
                    compiled: fn,
                    value: value,
                    exception: e
                }
            });
            throw e;
        }
    }
    /**
     *  "{a:1}"
     * @param code
     * @returns {*}
     */
    static getObjectFromString(code) {
        code = code.replace(/[\n\t\r\s]+/gi,'');
        try  {
            let fn = new Function('return (' + code + ')');
            return fn();
        } catch(e){
            console.error('can not parse properties: ' + code);
            throw e;
        }
    }
}
