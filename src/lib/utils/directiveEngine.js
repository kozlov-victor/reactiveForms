
class DirectiveEngine {

    constructor(component) {
        this.component = component;
    }

    _eachElementWithAttr(dataAttrName,onEachElementFn) {
        let elements = [];
        let nodes = this.component.node.querySelectorAll('['+dataAttrName+']');
        for (let i=0;i<nodes.length;i++){
            elements.push(nodes[i]);
        }
        if (this.component.node.hasAttribute(dataAttrName)) elements.push(this.component.node);
        elements.forEach(el=> {
            let expression = el.getAttribute(dataAttrName);
            el.removeAttribute(dataAttrName);
            el.setAttribute('_'+dataAttrName,expression);
            onEachElementFn(el,expression);
        });
    };

    runDirective_For(){
        this._eachElementWithAttr('data-for',(el,expression)=>{
            let tokens = expression.split(' ');
            if (tokens[1]!=='in') throw 'can not parse expression ' + expression;
            let eachItemName = tokens[0];
            let iterableObjectName = tokens[2];
            let scopedLoopContainer = new ScopedLoopContainer(el,this.component.modelView);
            scopedLoopContainer.run(eachItemName,iterableObjectName);
        });
    }

    runTextNodes(){
        DomUtils.processScopedTextNodes(this.component.node).forEach(it=>{
            this.component.addWatcher(
                it.expression,
                function(value){
                    if (typeof value == 'object') value = JSON.stringify(value);
                    DomUtils.setTextNodeValue(it.node,value);
                }
            )
        });
    };

    runDomEvent(eventName) {
        this._eachElementWithAttr('data-'+eventName,(el,expression)=>{
            let fn = ExpressionEngine.getExpressionFn(expression);
            DomUtils.addEventListener(el,eventName,e=>{
                e = e || window.e;
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
                e.cancelBubble = true;
                ExpressionEngine.runExpressionFn(fn,this.component);
                Component.digestAll();
            });
        });
    };

    runDirective_Bind(){
        this._eachElementWithAttr('data-bind',(el,expression)=>{
            let fn = ExpressionEngine.getExpressionFn(expression);
            ExpressionEngine.runExpressionFn(fn,this.component);
            this.component.addWatcher(
                expression,
                function(value){
                    DomUtils.setTextNodeValue(el,value);
                }
            )
        });
    };

    runDirective_Value(){
        let el = this.component.node;
        let expression = el.getAttribute('data-value');
        if (!expression) return;
        if (el.tagName.toLowerCase()!='option') throw 'data-value attribute supported only by <option>, use data-model instead';
        let fn = ExpressionEngine.getExpressionFn(expression);
        ExpressionEngine.runExpressionFn(fn,this.component);
        this.component.addWatcher(
            expression,
            function(value){
                el.value = value;
            }
        )
    }

    runDirective_Model(){
        this._eachElementWithAttr('data-model',(el,expression)=>{
            if (el.getAttribute('type')=='radio' && !el.getAttribute('name'))
                el.setAttribute('name',el.getAttribute('_data-model'));
            let eventNames = DomUtils.getDefaultInputChangeEvents(el);
            eventNames.split(',').forEach(eventName=>{
                DomUtils.addEventListener(el,eventName,()=>{
                    ExpressionEngine.setValueToContext(this.component.modelView,expression,DomUtils.getInputValue(el));
                    Component.digestAll();
                });
            });
            this.component.addWatcher(
                expression,
                function(value){
                    if (DomUtils.getInputValue(el)!==value)
                        DomUtils.setInputValue(el,value);
                }
            )
        });
    };

    runDirective_Class(){
        this._eachElementWithAttr('data-class',(el,expression)=>{
            this.component.addWatcher(
                expression,
                function(classObj){
                    for (let key in classObj) {
                        if (!classObj.hasOwnProperty(key)) continue;
                        DomUtils.toggleClass(el,key,!!classObj[key]);
                    }
                }
            );
        });
    };

    runDirective_Style(){
        this._eachElementWithAttr('data-style',(el,expression)=>{
            this.component.addWatcher(
                expression,
                function(styleObject){
                    for (let key in styleObject) {
                        if (!styleObject.hasOwnProperty(key)) continue;
                        el.style[key] = styleObject[key]?styleObject[key]:'';
                    }
                }
            );
        });
    };

    runDirective_If(){
        this._eachElementWithAttr('data-if',(el,expression)=>{
            let comment = document.createComment('');
            el.parentNode.insertBefore(comment,el);
            let cloned;
            this.component.addWatcher(
                expression,
                function(val){
                    if (val) {
                        if (!el.parentElement) {
                            cloned = el.cloneNode(true);
                            comment.parentNode.insertBefore(cloned,comment.nextSibling);
                        }
                    } else {
                        if (cloned) {
                            cloned.remove();
                        } else {
                            el.remove();
                        }
                    }
                }
            );
        });
    };

    run(){
        this.runDirective_Value();
        this.runDirective_For();
        this.runTextNodes();
        [   'click','blur','focus',
            'submit','change',
            'keypress','keyup','keydown'

        ].forEach(eventName =>{
                this.runDomEvent(eventName);
            });
        this.runDirective_Bind();
        this.runDirective_Model();
        this.runDirective_Value();
        this.runDirective_Class();
        this.runDirective_Style();
        this.runDirective_If();
    }

}
