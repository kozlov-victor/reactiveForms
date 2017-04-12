
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
                value=>{
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
                let shouldPreventDefault = ['keypress','keydown'].indexOf(eventName)==-1;
                if (shouldPreventDefault) {
                    e = e || window.e;
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.cancelBubble = true;
                }
                ExpressionEngine.runExpressionFn(fn,this.component);
                Component.digestAll();
                if (shouldPreventDefault) return false;
            });
        });
    };

    runDirective_Bind(){
        this._eachElementWithAttr('data-bind',(el,expression)=>{
            let fn = ExpressionEngine.getExpressionFn(expression);
            ExpressionEngine.runExpressionFn(fn,this.component);
            this.component.addWatcher(
                expression,
                value=>{
                    DomUtils.setTextNodeValue(el,value);
                }
            )
        });
    };

    runDirective_Value(){ // todo remove
        // let el = this.component.node;
        // let expression = el.getAttribute('data-value');
        // if (!expression) return;
        // if (el.tagName.toLowerCase()!='option') throw 'data-value attribute supported only by <option>, use data-model instead';
        // let fn = ExpressionEngine.getExpressionFn(expression);
        // ExpressionEngine.runExpressionFn(fn,this.component);
        // this.component.addWatcher(
        //     expression,
        //     function(value){
        //         el.value = value;
        //     }
        // )
    }

    _runDirective_Model_OfSelect(selectEl,modelExpression){
        let isMultiple = selectEl.multiple, val = [];
        let selectedEls = DomUtils.
            nodeListToArray(selectEl.querySelectorAll('option')).
        filter(opt=>{return opt.selected});
        selectedEls.forEach(selectedEl=>{
            let dataValueAttr = selectedEl.getAttribute('data-value');
            let component;
            component = Component.getComponentById(selectedEl.getAttribute('data-component-id'));
            if (component && dataValueAttr) {
                val.push(ExpressionEngine.executeExpression(dataValueAttr,component));
            }
            else {
                val.push(selectedEl.getAttribute('value'));
            }
        });
        ExpressionEngine.setValueToContext(this.component.modelView,modelExpression,isMultiple?val:val[0]);
    }

    runDirective_Model(){
        this._eachElementWithAttr('data-model',(el,expression)=>{
            if (el.getAttribute('type')=='radio' && !el.getAttribute('name'))
                el.setAttribute('name',expression);
            let eventNames = DomUtils.getDefaultInputChangeEvents(el);
            eventNames.split(',').forEach(eventName=>{
                if (el.tagName.toLowerCase()=='select') {
                    DomUtils.addEventListener(el,eventName,()=>{
                        this._runDirective_Model_OfSelect(el,expression);
                        Component.digestAll();
                    });
                } else {
                    DomUtils.addEventListener(el,eventName,()=>{
                        ExpressionEngine.setValueToContext(this.component.modelView,expression,DomUtils.getInputValue(el));
                        Component.digestAll();
                    });
                }

            });
            this.component.addWatcher(
                expression,
                value=>{
                    if (el.tagName.toLowerCase()=='select') {
                        let isMultiple = el.multiple;
                        let isModelSet = false;
                        DomUtils.nodeListToArray(el.querySelectorAll('option')).some(opt=>{
                            let modelItemExpression = opt.getAttribute('data-value');
                            if (!modelItemExpression) return;
                            let componentId = opt.getAttribute('data-component-id');
                            let component = Component.getComponentById(componentId);
                            let modelItem = ExpressionEngine.executeExpression(modelItemExpression,component);
                            if (isMultiple) {
                                if (value.indexOf(modelItem)>-1) {
                                    isModelSet = true;
                                    opt.selected = true;
                                } else {
                                    opt.selected = false;
                                }
                            } else {
                                if (modelItem==value) {
                                    opt.selected = true;
                                    isModelSet = true;
                                    return true;
                                }
                            }
                        });
                        if (!isModelSet) {
                            el.value = value;
                            if (isMultiple) {
                                DomUtils.
                                    nodeListToArray(el.querySelectorAll('option')).
                                    forEach(opt=>{
                                        opt.selected = value.indexOf(opt.getAttribute('value'))>-1;
                                    }
                                );
                            }
                        }
                    } else {
                        if (DomUtils.getInputValue(el)!==value)
                            DomUtils.setInputValue(el,value);
                    }

                }
            )
        });
    };

    runDirective_Class(){
        this._eachElementWithAttr('data-class',(el,expression)=>{
            this.component.addWatcher(
                expression,
                classNameOrObj=>{
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
                styleObject=>{
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
                value=>{
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
                val=>{
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
            if (this.component.node.tagName.toLowerCase()==componentProto.name.toLowerCase()) {
                console.error(`
                   Can not use "data-for" attribute at component directly. Use "data-for" directive at parent node`);
                console.error('component node:',this.component.node);
                throw "Can not use data-for attribute at component"
            }
            let componentNodes = [];
            let toDel = [];
            domEls.forEach(domEl=>{

                if (domEl.getAttribute('data-_processed')) return;
                domEl.setAttribute('data-_processed','1');
                let domId = domEl.getAttribute('id');
                let componentNode = componentProto.node.cloneNode(true);
                DomUtils.nodeListToArray(componentNode.querySelectorAll('[data-transclusion]')).forEach(transcl=>{
                    let name = transcl.getAttribute('data-transclusion');
                    if (!name) {
                        console.error(componentProto.node);
                        console.error(transcl);
                        throw `data-transclusion attribute can not be empty`;
                    }
                    let recipients = DomUtils.nodeListToArray(domEl.querySelectorAll(`[data-transclusion="${name}"]`));
                    if (!recipients.length) {
                        console.error(domEl);
                        throw `data-transclusion attribute with name ${name} defined at template, but not found at component`
                    }
                    recipients.forEach(rcp=>{
                        toDel.push(rcp);
                        transcl.innerHTML = rcp.innerHTML;
                    });
                });
                componentNodes.push(componentNode);
                domEl.parentNode.insertBefore(componentNode,domEl);

                let dataPropertiesAttr = domEl.getAttribute('data-properties');
                let dataProperties = dataPropertiesAttr?
                    ExpressionEngine.executeExpression(dataPropertiesAttr,this.component):{};
                let component = componentProto.newInstance(componentNode,dataProperties);
                domId && (component.domId = domId);

                component.run();
                component.parent = this.component;
                component.parent.addChild(component);
                component.disableParentScopeEvaluation = true; // avoid recursion in Component
                domEl.parentNode.removeChild(domEl);
            });
            componentNodes.forEach((node)=>{
                DomUtils.removeParentButNotChildren(node);
            });
            toDel.forEach((node)=>{
                DomUtils.removeParentButNotChildren(node);
            });
        });
    }

    run(){
        this.runDirective_Value();
        this.runDirective_For();
        this.runComponents();
        this.runTextNodes();
        this.runDirective_Model(); // todo check event sequence in legacy browsers
        [
            'click','blur','focus',
            'submit','change',
            'keypress','keyup','keydown'

        ].forEach(eventName =>{
            this.runDomEvent(eventName);
        });
        this.runDirective_Bind();
        this.runDirective_Value();
        this.runDirective_Class();
        this.runDirective_Style();
        // todo this.runDirective_Show();
        // todo this.runDirective_Hide();
        this.runDirective_Disabled();
        this.runDirective_If();
    }

}