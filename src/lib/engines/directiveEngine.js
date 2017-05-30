
class DirectiveEngine {

    constructor(component,ignoreComponents) {
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
            let processed = onEachElementFn(el,expression);
            if (processed===false) el.setAttribute(dataAttrName,expression);
        });
    };

    runDirective_For(){
        this._eachElementWithAttr('data-for',(el,expression)=>{
            let closestTransclusionEl = el.closest('[data-transclusion]');

            if (closestTransclusionEl && !closestTransclusionEl.getAttribute('data-_processed')) return false;
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
                // todo!
                // if (shouldPreventDefault) {
                //     e = e || window.e;
                //     e.preventDefault && e.preventDefault();
                //     e.stopPropagation && e.stopPropagation();
                //     e.cancelBubble = true;
                // }
                ExpressionEngine.runExpressionFn(fn,this.component);
                Component.digestAll();
                //if (shouldPreventDefault) return false;
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

    _runDirective_Model_OfSelect(selectEl,modelExpression){
        let isMultiple = selectEl.multiple, val = [];
        let selectedEls = DomUtils.
            nodeListToArray(selectEl.querySelectorAll('option')).
        filter(opt=>{return opt.selected});
        selectedEls.forEach(selectedEl=>{
            let dataValueAttr = selectedEl.getAttribute('data-value');
            let component;
            component = Component.getComponentByInternalId(selectedEl.getAttribute('data-component-id'));
            if (component && dataValueAttr) {
                val.push(ExpressionEngine.executeExpression(dataValueAttr,component));
            }
            else {
                val.push(selectedEl.getAttribute('value'));
            }
        });
        ExpressionEngine.setValueToContext(this.component,modelExpression,isMultiple?val:val[0]);
    }

    runDirective_Model(){
        this._eachElementWithAttr('data-model',(el,expression)=>{
            if (el.getAttribute('type')=='radio' && !el.getAttribute('name'))
                el.setAttribute('name',expression);
            let eventNames = DomUtils.getDefaultInputChangeEvents(el);
            eventNames.split(',').forEach(eventName=>{
                if (el.tagName.toLowerCase()=='select') {
                    DomUtils.addEventListener(el,eventName,e=>{
                        this._runDirective_Model_OfSelect(el,expression);
                        Component.digestAll();
                    });
                } else {
                    DomUtils.addEventListener(el,eventName,e=>{
                        ExpressionEngine.setValueToContext(this.component,expression,DomUtils.getInputValue(el));
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
                            let component = Component.getComponentByInternalId(componentId);
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
            let initialClassName = el.className;
            this.component.addWatcher(
                expression,
                classNameOrObj=>{
                    if (typeof classNameOrObj === 'object') {
                        for (let key in classNameOrObj) {
                            if (!classNameOrObj.hasOwnProperty(key)) continue;
                            DomUtils.toggleClass(el,key,!!classNameOrObj[key]);
                        }
                    } else {
                        el.className = initialClassName + ' ' +classNameOrObj;
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
                        try {
                            el.style[key] = styleObject[key]?styleObject[key]:'';
                        }catch (e){
                            //ie8 throws error if style is incorrect
                        }
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
                            this.component.modelView.onMount();
                            this.component.modelView.onShow();
                        }
                    } else {
                        this.component.modelView.onHide();
                        this.component.modelView.onUnmount();
                        el.remove();
                    }
                }
            );
        });
    };

    runDirective_Show(){
        this._eachElementWithAttr('data-show',(el,expression)=>{
            let initialStyle = el.style.display || '';
            this.component.addWatcher(
                expression,
                val=>{
                    if (val) {
                        el.style.display = initialStyle;
                        this.component.modelView.onShow();
                    } else {
                        el.style.display = 'none';
                        this.component.modelView.onHide();
                    }
                }
            );
        });
    };

    runDirective_Hide(){
        this._eachElementWithAttr('data-hide',(el,expression)=>{
            let initialStyle = el.style.display || '';
            this.component.addWatcher(
                expression,
                val=>{
                    if (val) {
                        el.style.display = 'none';
                        this.component.modelView.onHide();
                    } else {
                        el.style.display = initialStyle;
                        this.component.modelView.onShow();
                    }
                }
            );
        });
    };

    runDirective_Html(){
        this._eachElementWithAttr('data-html',(el,expression)=>{
            this.component.addWatcher(
                expression,
                val=>{
                    el.innerHTML = val;
                }
            );
        });
    };

    runDirective_Attributes(){
        this._eachElementWithAttr('data-attributes',(el,expression)=>{
            this.component.addWatcher(
                expression,
                properties=>{
                    Object.keys(properties).forEach(key=>{
                        let val = properties[key];
                        if (typeof val == 'boolean')
                            val?el.setAttribute(key,key):el.removeAttribute(key);
                        else el.setAttribute(key,val);
                    })
                }
            );
        });
    };


    runComponents(){ // todo refactor
        let transclComponents = [];
        ComponentProto.instances.forEach(componentProto=>{
            let domEls =  DomUtils.nodeListToArray(this.component.node.getElementsByTagName(componentProto.name));
            if (this.component.node.tagName.toLowerCase()==componentProto.name.toLowerCase()) {
                console.error(`
                   Can not use "data-for" attribute at component directly. Use "data-for" directive at parent node`);
                console.error('component node:',this.component.node);
                throw "Can not use data-for attribute at component"
            }
            let componentNodes = [];
            domEls.forEach(domEl=>{

                if (domEl.getAttribute('data-_processed')) return;
                domEl.setAttribute('data-_processed','1');

                let dataTransclusion = 'data-transclusion';

                let hasNotTranscluded = false;
                DomUtils.nodeListToArray(domEl.childNodes).forEach(chdrn=>{
                    if (chdrn.hasAttribute && !(chdrn.hasAttribute(dataTransclusion)))
                        hasNotTranscluded = true;
                });
                if (hasNotTranscluded) {
                    console.warn(domEl);
                    console.warn(`children elements of component ${componentProto.name} will be removed`);
                }


                let domId = domEl.getAttribute('id');
                let componentNode = componentProto.node.cloneNode(true);
                DomUtils.nodeListToArray(componentNode.querySelectorAll(`[${dataTransclusion}]`)).forEach(transclNode=>{
                    let name = transclNode.getAttribute(dataTransclusion);
                    if (!name) {
                        console.error(componentProto.node);
                        console.error(transclNode);
                        throw `${dataTransclusion} attribute can not be empty`;
                    }

                    let recipients =
                        DomUtils.
                        nodeListToArray(domEl.querySelectorAll(`[${dataTransclusion}=${name}]`)).
                        filter(el=>{
                            let closestWithSameName = el.parentNode && el.parentNode.closest(`[${dataTransclusion}=${name}]`);
                            if (!!closestWithSameName) {
                                console.error(domEl);
                                console.error(closestWithSameName);
                                throw `transclusion name conflict: dont use same transclusion name at different components. Conflicted name: ${name}`;
                            }
                            return true;
                        });

                    recipients.forEach(rcp=>{
                        transclNode.innerHTML = '';
                        transclComponents.push({transclNode,rcp});
                    });
                });
                domEl.parentNode.insertBefore(componentNode,domEl);

                let dataStateExpression = domEl.getAttribute('data-state');
                let dataState = dataStateExpression?
                    ExpressionEngine.executeExpression(dataStateExpression,this.component):{};
                let component = componentProto.newInstance(componentNode,dataState);
                domId && (component.domId = domId);

                component.parent = this.component;
                component.parent.addChild(component);
                if (dataStateExpression) component.stateExpression = dataStateExpression;
                component.disableParentScopeEvaluation = true; // avoid recursion in Component

                component.run();

                domEl.parentNode.removeChild(domEl);
                componentNodes.push({component,componentNode});
            });
            let hasStateChanged = false;
            componentNodes.forEach((item)=>{
                let children = DomUtils.removeParentButNotChildren(item.componentNode);
                if (children.length == 1) {
                    item.component.modelView.$el = children[0];
                } else {
                    item.component.modelView.$el = children;
                }
                hasStateChanged = item.component.modelView.onMount()!='noChanged' || hasStateChanged;
                hasStateChanged = item.component.modelView.onShow()!='noChanged' || hasStateChanged;
            });
            hasStateChanged && (Component.digestAll());
        });
        transclComponents.forEach(trnscl=>{
            //trnscl.transclNode.innerHTML = trnscl.rcp.innerHTML;
            DomUtils.nodeListToArray(trnscl.rcp.childNodes).forEach(n=>{
                trnscl.transclNode.appendChild(n);
            });
            let transclComponent = new ScopedDomFragment(trnscl.transclNode,new ModelView(this.component.name));
            this.component.addChild(transclComponent);
            transclComponent.parent = this.component;
            trnscl.transclNode.setAttribute('data-_processed','1');
            transclComponent.run();
        });
    }

    runExpressionsInAttrs(){
        DomUtils.nodeListToArray(this.component.node.querySelectorAll('*')).forEach(node=>{
            if (!node.attributes) return;
            Array.prototype.forEach.call(node.attributes,attr=>{
                if (!attr) return;
                let {name,value}= attr;
                if (value.indexOf('{{')==-1 && value.indexOf('}}')==-1) return;
                value = value.split(/[\n\t]|[\s]{2,}/).join(' ').trim();
                let resultExpArr = [], resultExpr = '';
                value.split(DomUtils.EXPRESSION_REGEXP).forEach(token=>{
                    if (!token.length) return;
                    if (token.indexOf('{{')==0) {
                        token = token.split('{{').join('').split('}}').join('');
                        resultExpArr.push(`(${token})`);
                    } else {
                        resultExpArr.push(`"${token}"`);
                    }
                });
                resultExpr = resultExpArr.join('+');
                this.component.addWatcher(
                    resultExpr,
                    expr=>{
                        node.setAttribute(name,expr.trim());
                    }
                );
            });
        });
    }

    run(){
        this.runDirective_For();
        this.runComponents();
        this.runTextNodes();
        this.runDirective_Model(); // todo check event sequence in legacy browsers
        [
            'click','blur','focus',
            'submit','change',
            'keypress','keyup','keydown',
            'input'

        ].forEach(eventName =>{
            this.runDomEvent(eventName);
        });
        this.runDirective_Bind();
        this.runDirective_Class();
        this.runDirective_Style();
        this.runDirective_Show();
        this.runDirective_Hide();
        this.runDirective_Disabled();
        this.runDirective_Html();
        this.runDirective_Attributes();
        this.runExpressionsInAttrs();
        this.runDirective_If();
    }

}