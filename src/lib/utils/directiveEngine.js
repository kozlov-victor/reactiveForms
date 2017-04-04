
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
            if (['in','of'].indexOf(tokens[1])==-1) throw 'can not parse expression ' + expression;
            let variables =
                Lexer.tokenize(tokens[0]).
                filter(t=>{return [Token.TYPE.VARIABLE,Token.TYPE.OBJECT_KEY].indexOf(t.tokenType)>-1}).
                map(t=>{return t.tokenValue});

            if (!variables.length) throw  'can not parse expression ' + expression;
            let eachItemName = variables[0];
            let indexName = variables[1];
            let iterableObjectName = tokens[2];
            let scopedLoopContainer = new ScopedLoopContainer(el,this.component.modelView);
            scopedLoopContainer.parent = this.component;
            scopedLoopContainer.run(eachItemName,indexName,iterableObjectName);
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
                if (eventName!='keypress') {
                    e = e || window.e;
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.cancelBubble = true;
                }
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
                function(classNameOrObj){
                    if (typeof classNameOrObj === 'object') {
                        for (let key in classNameOrObj) {
                            if (!classNameOrObj.hasOwnProperty(key)) continue;
                            DomUtils.toggleClass(el,key,!!classNameOrObj[key]);
                        }
                    } else {
                        el.className = classNameOrObj;
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

    runDirective_Disabled(){
        this._eachElementWithAttr('data-disabled',(el,expression)=>{
            this.component.addWatcher(
                expression,
                function(value){
                    if (value) el.setAttribute('disabled','disabled');
                    else el.removeAttribute('disabled');
                }
            );
        });
    };

    runDirective_If(){
        this._eachElementWithAttr('data-if',(el,expression)=>{
            let comment = document.createComment('');
            el.parentNode.insertBefore(comment,el);
            this.component.addWatcher(
                expression,
                function(val){
                    if (val) {
                        if (!el.parentElement) {
                            comment.parentNode.insertBefore(el,comment.nextSibling);
                        }
                    } else {
                        el.remove();
                    }
                }
            );
        });
    };

    runComponents(){
        ComponentProto.instances.forEach(componentProto=>{
            let domEls =  DomUtils.nodeListToArray(this.component.node.getElementsByTagName(componentProto.name));
            // if (this.component.node.tagName.toLowerCase()==componentProto.name.toLocaleLowerCase())
            //     domEls.push(this.component.node);
            let componentNodes = []; // todo need?
            domEls.forEach(it=>{
                if (it.getAttribute('data-_processed')) return;
                it.setAttribute('data-_processed','1');
                let componentNode = componentProto.node.cloneNode(true);
                componentNodes.push(componentNode);
                it.parentNode.insertBefore(componentNode,it);
                let dataPropertiesAttr = it.getAttribute('data-properties');
                let dataProperties = dataPropertiesAttr?
                    ExpressionEngine.executeExpression(dataPropertiesAttr,this.component):{};
                let component = componentProto.runNewInstance(componentNode,dataProperties);
                component.parent = this.component;
                component.parent.addChild(component);
                //it.parentNode.removeChild(it);
            });
            domEls.forEach(it=>{
                //it.remove();
            });
            //componentNodes.forEach((node)=>{
            //    DomUtils.removeParentButNotChildren(node);
            //});
        });
    }

    run(){
        this.runDirective_Value();
        this.runDirective_For();
        this.runComponents();
        this.runTextNodes();
        this.runDirective_Model(); // todo check event sequence in legacy browsers
        [   'click','blur','focus',
            'submit','change',
            'keypress','keyup','keydown'

        ].forEach(eventName =>{
            this.runDomEvent(eventName);
        });
        this.runDirective_Bind();
        this.runDirective_Value();
        this.runDirective_Class();
        this.runDirective_Style();
        this.runDirective_Disabled();
        this.runDirective_If();
    }

}