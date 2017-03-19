
class ExpressionEngine {
    static getExpressionFn(code){
        let codeProcessed = `
                var res;
                with(localScope) {
                    with(this){
                        res=${code};
                    }
                }
                return res;`
            ;
        codeProcessed = codeProcessed.split('\n').join('').split('  ').join(' ');
        window.c = codeProcessed;
        let fn = new Function('localScope',codeProcessed);
        fn.expression = code;
        return fn;
    }
    static runExpressionFn(fn,component){
        try {
            return fn.call(component.modelView,component.localModelView||{});
        } catch(e){
            console.error('can not evaluate expression:' + fn.expression);
            console.error('current context',component.modelView);
            console.error('current local context',component.localModelView);
            throw e;
        }
    }
    /**
     * ?????????? ???????? ??????? ?? ?????????
     * ????????, expression = 'user.name' object[field] = value
     */
    static setValueToContext(context,expression,value){
        let quotes = '';
        if (typeof value == 'string') quotes = '"';
        let code = 'with(this){' + expression + ' = ' +quotes + value + quotes +'}';
        try {
            let fn = new Function(code);
            fn.call(context);
        } catch(e){
            console.error('can not evaluate expression:' + expression);
            console.error('current code',code);
            console.error('current context',context);
            console.error('desired value to set',value);
            throw e;
        }
    }
    /**
     * ???????? js ?????? ?? ?????????? ????????? ???? "{a:1}"
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
