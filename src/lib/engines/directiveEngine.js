
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
            let processed = onEachElementFn(el,expression);
            if (processed===false) el.setAttribute(dataAttrName,expression);
        });
    };

    runDirective_For(){
        this._eachElementWithAttr('data-for',(el,expression)=>{
            let closestTransclusionEl = el.closest('[data-transclusion]');

            if (closestTransclusionEl && !closestTransclusionEl.getAttribute('data-_processed')) return false;
            expression = expression.replace(/,\s+/,',').replace(/[\t\n]+/,' ');
            let tokens = expression.split(' ').filter(it=>{return it.length});
            if (['in','of'].indexOf(tokens[1])==-1) throw 'can not parse expression: ' + expression;
            let variables =
                Lexer.tokenize(tokens[0]).
                filter(t=>{return [Token.TYPE.VARIABLE,Token.TYPE.OBJECT_KEY].indexOf(t.tokenType)>-1}).
                map(t=>{return t.tokenValue});

            if (!variables.length) throw  'can not parse expression: ' + expression;
            let eachItemName = variables[0];
            let indexName =  variables[1];
            tokens.shift();
            tokens.shift();
            let iterableObjectExpr = tokens.join(' ');
            let scopedLoopContainer = new ScopedLoopContainer(el,this.component.modelView);
            scopedLoopContainer.parent = this.component;
            scopedLoopContainer.run(eachItemName,indexName,iterableObjectExpr);
        });
    }

    runTextNodes(){
        DomUtils.processScopedTextNodes(this.component.node).forEach(it=>{
            this.component.addWatcher(
                it.expression,
                value=>{
                    if (typeof value == 'object') value = JSON.stringify(value);
                    DomUtils.setTextNodeValue(it.node,value);
                },
                DomUtils._get_If_expressionTopDownList(it.node)
            )
        });
    };

    _runDomEvent(el,expression,eventName){
        let closestForm = el.closest('form');
        let shouldPreventDefault = !!closestForm && !closestForm.__shouldPreventDefault__;
        let fn = ExpressionEngine.getExpressionFn(expression);
        if (shouldPreventDefault && el!==closestForm) {
            DomUtils.addEventListener(closestForm,'submit',e=>{
                DomUtils.preventDefault(e);
                return false;
            });
        }

        DomUtils.addEventListener(el,eventName,e=>{

            this.component.modelView.$event = e;
            ExpressionEngine.runExpressionFn(fn,this.component);
            delete this.component.modelView.$event;
            Component.digestAll();
            if (eventName=='submit') {
                DomUtils.preventDefault(e);
                return false;
            }
        });
        closestForm && (closestForm.__shouldPreventDefault__ = '__shouldPreventDefault__');
    }

    runDomEvent(eventName) {
        this._eachElementWithAttr('data-'+eventName,(el,expression)=>{
            this._runDomEvent(el,expression,eventName);
        });
    };

    runDomEvent_Change(){
        this._eachElementWithAttr('data-'+'change',(el,expression)=>{
            let events = DomUtils.getDefaultInputChangeEvents(el).split(',');
            events.forEach(eventName=>{
                this._runDomEvent(el,expression,eventName);
            });
        });
    }

    _runDirectiveEvents(el,expression){
        expression = expression.trim();
        if (!(expression.startsWith("{") && expression.endsWith("}")))
            throw `Attribute error. can not parse expression ${expression}`;
        expression = expression.substr(1,expression.length-2);
        expression.split(',').forEach(expr=>{
            let p = expr.split(':');
            if (p.length!==2)
                throw `Attribute error. can not parse expression ${expression}`;
            this._runDomEvent(el,p[1],p[0]);
        });
    }

    runDirective_Events(){
        this._eachElementWithAttr('data-'+'events',(el,expression)=>{
            this._runDirectiveEvents(el,expression);
        });
    }

    runDirective_Event(){
        this._eachElementWithAttr('data-'+'event',(el,expression)=>{
            this._runDirectiveEvents(el,`{${expression}}`);
        });
    }

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
                        if (DomUtils.getInputValue(el)==value) return;
                        if (value==undefined) value = '';
                        DomUtils.setInputValue(el,value);
                    }
                },
                DomUtils._get_If_expressionTopDownList(el)
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
                },
                DomUtils._get_If_expressionTopDownList(el)
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
                },
                DomUtils._get_If_expressionTopDownList(el)
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
                },
                DomUtils._get_If_expressionTopDownList(el)
            );
        });
    };


    _getChildComponents(el){
        let componentIds = {};
        let thisId = el.getAttribute('data-component-id');
        let res = [];
        if (!el.children) return [];
        DomUtils.nodeListToArray(el.querySelectorAll('*')).
        map(it=>{
            return it.getAttribute('data-component-id');
        }).
        forEach(componentId=>{
            if (!componentIds[componentId]) {
                componentIds[componentId] = true;
                if (thisId!=componentId) res.push(RF._getComponentByInternalId(componentId));
            }
        });
        return res;
    }

    runDirective_If(){
        this._eachElementWithAttr('data-if',(el,expression)=>{
            let comment = document.createComment('');
            el.parentNode.insertBefore(comment,el);
            let childComponents = this._getChildComponents(el);
            this.component.addWatcher(
                expression,
                val=>{
                    if (val) {
                        if (!el.parentElement) {
                            comment.parentNode.insertBefore(el,comment.nextSibling);
                            childComponents.forEach(cmp=>{
                                cmp.setMounted(true);
                                cmp.setShown(true);
                            });
                        }
                    } else {
                        el.remove();
                        childComponents.forEach(cmp=>{
                            cmp.setMounted(false);
                            cmp.setShown(false);
                        });
                    }
                },
                DomUtils._get_If_expressionTopDownList(el)
            );
        });
    };

    runDirective_Show(){
        this._eachElementWithAttr('data-show',(el,expression)=>{
            let initialStyle = el.style.display || '';
            let childComponents = this._getChildComponents(el);
            this.component.addWatcher(
                expression,
                val=>{
                    if (val) {
                        el.style.display = initialStyle;
                        childComponents.forEach(cmp=>{
                            cmp.setShown(true);
                        });
                    } else {
                        el.style.display = 'none';
                        childComponents.forEach(cmp=>{
                            cmp.setShown(false);
                        });
                    }
                },
                DomUtils._get_If_expressionTopDownList(el)
            );
        });
    };

    runDirective_Hide(){
        this._eachElementWithAttr('data-hide',(el,expression)=>{
            let initialStyle = el.style.display || '';
            let childComponents = this._getChildComponents(el);
            this.component.addWatcher(
                expression,
                val=>{
                    if (val) {
                        el.style.display = 'none';
                        childComponents.forEach(cmp=>{
                            cmp.setShown(false);
                        });
                    } else {
                        el.style.display = initialStyle;
                        childComponents.forEach(cmp=>{
                            cmp.setShown(true);
                        });
                    }
                },
                DomUtils._get_If_expressionTopDownList(el)
            );
        });
    };

    runDirective_Html(){
        this._eachElementWithAttr('data-html',(el,expression)=>{
            this.component.addWatcher(
                expression,
                val=>{
                    el.innerHTML = DomUtils.sanitize(val);
                },
                DomUtils._get_If_expressionTopDownList(el)
            );
        });
    };

    _runAttributes(el,properties){
        Object.keys(properties).forEach(key=>{
            let val = properties[key];
            if (typeof val == 'boolean')
                val?el.setAttribute(key,key):el.removeAttribute(key);
            else el.setAttribute(key,val);
        });
    }

    runDirective_Attributes(){
        this._eachElementWithAttr('data-attributes',(el,expression)=>{
            this.component.addWatcher(
                expression,
                properties=>{
                    this._runAttributes(el,properties);
                },
                DomUtils._get_If_expressionTopDownList(el)
            );
        });
    };

    runDirective_Attribute(){
        this._eachElementWithAttr('data-attribute',(el,expression)=>{
            expression = `{${expression}}`;
            this.component.addWatcher(
                expression,
                properties=>{
                    this._runAttributes(el,properties);
                },
                DomUtils._get_If_expressionTopDownList(el)
            );
        });
    };


    runComponents(){
        ComponentHelper.runComponents(this.component);
    }

    runExpressionsInAttrs(){
        DomUtils.nodeListToArray(this.component.node.querySelectorAll('*')).forEach(el=>{
            if (!el.attributes) return;
            Array.prototype.forEach.call(el.attributes,attr=>{
                if (!attr) return;
                let {name,value}= attr;
                if (value.indexOf('{{')==-1 && value.indexOf('}}')==-1) return;
                value = value.split(/[\n\t]|[\s]{2,}/).join(' ').trim();
                let resultExpArr = [], resultExpr;
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
                        el.setAttribute(name,expr.trim());
                    },
                    DomUtils._get_If_expressionTopDownList(el)
                );
            });
        });
    }

    runDragAndDrop(){
        this._eachElementWithAttr('data-draggable',(el,expression)=>{
            DomUtils.addEventListener(el,'mousedown',function(e){
                var mouseX = e.offsetX,
                    mouseY = e.offsetY;
                el.__coords = {mouseX,mouseY};
            });
            DomUtils.addEventListener(el,'dragstart',(e)=>{
                let id = Math.random()+'_'+Math.random();
                let clientRect = el.getBoundingClientRect();
                let mouseX = e.clientX, mouseY = e.clientY;
                DirectiveEngine.ddObjects[id] = {
                    obj: ExpressionEngine.executeExpression(expression,this.component),
                    coords: el.__coords
                };
                e.dataTransfer.setData('text/plain', id); //cannot be empty string
                e.dataTransfer.effectAllowed='move';
            });
            this.component.addWatcher(
                expression,
                draggableObj=>{
                    el.setAttribute('draggable',`${!!draggableObj}`);
                },
                DomUtils._get_If_expressionTopDownList(el)
            );
        });
        this._eachElementWithAttr('data-droppable',(el,expression)=>{
            let callbackFn = ExpressionEngine.executeExpression(expression,this.component);
            DomUtils.addEventListener(el,'dragover',e=>{
                e.preventDefault();
            });
            DomUtils.addEventListener(el,'drop',e=>{
                e.preventDefault();
                let id = e.dataTransfer.getData('text/plain');
                let {obj,coords} = DirectiveEngine.ddObjects[id];
                callbackFn && callbackFn(obj,e,coords);
                delete DirectiveEngine.ddObjects[id];
            });
        });
    }

    run(){
        this.runDirective_For();
        this.runComponents();
        this.runTextNodes();
        this.runDirective_Model();
        [
            'click','blur','focus',
            'submit',
            'keypress','keyup','keydown',
            'input',
            'mousedown','mouseup',
            'mousemove','mouseleave',
            'mouseenter','mouseover','mousout'

        ].forEach(eventName =>{
            this.runDomEvent(eventName);
        });
        this.runDomEvent_Change();
        this.runDirective_Events();
        this.runDirective_Event();
        this.runDirective_Class();
        this.runDirective_Style();
        this.runDirective_Show();
        this.runDirective_Hide();
        this.runDirective_Disabled();
        this.runDirective_Html();
        this.runDirective_Attribute();
        this.runDirective_Attributes();
        this.runExpressionsInAttrs();
        this.runDragAndDrop();
        this.runDirective_If();
    }

}

DirectiveEngine.ddObjects = {};