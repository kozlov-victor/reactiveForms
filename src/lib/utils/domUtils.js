
class DomUtils {
    /**
     * обработка текстовых узлов с выражением типа {{expression}}
     * @param root
     * @returns {Array}
     */
    static processScopedTextNodes(root){
        let textNodes = getTextNodes(root);
        let result = [];
        textNodes.forEach(textNode=>{
            let scopedNode = document.createDocumentFragment();
            let hasExpressions = false;
            (textNode.textContent || textNode.innerText || textNode.data).
                split(DomUtils.EXPRESSION_REGEXP).
                forEach(item=>{
                    let newNode;
                    let trimmed = item.trim();
                    if (trimmed.indexOf('{{')==0) {
                        newNode = document.createTextNode('');
                        let exp = trimmed.split('{{').join('').split('}}').join('');
                        if (!exp) return;
                        hasExpressions = true;
                        result.push({
                            node:newNode,
                            expression: exp
                        });
                    } else {
                        newNode = document.createTextNode(item);
                    }
                    scopedNode.appendChild(newNode);
                });
            hasExpressions && textNode.parentNode.replaceChild(scopedNode,textNode);
        });
        return result;

        function getTextNodes(root){
            let textNodes = [];
            addTextNodes(root);
            Array.prototype.forEach.call(root.querySelectorAll('*'),addTextNodes);
            return textNodes;

            function addTextNodes(el){
                textNodes = textNodes.concat(
                    Array.prototype.filter.call(el.childNodes,function(k){
                        return k.nodeType==Node.TEXT_NODE;
                    })
                );
            }
        }
    }
    static setInputValue(el,value){
        let tagName = el.tagName.toLowerCase();
        switch (tagName) {
            case 'input':
                let type = el.getAttribute('type');
                switch (type) {
                    case 'checkbox':
                        el.checked = !!value;
                        break;
                    case 'radio':
                        el.checked = value==el.value;
                        break;
                    default:
                        el.value = value;
                        break;
                }
                break;
            case 'select':
                el.value = value;
                break;
            case 'textarea':
                el.value = value;
                break;
        }
    }
    static getInputValue(el){
        let tagName = el.tagName.toLowerCase();
        switch (tagName) {
            case 'input':
                let type = el.getAttribute('type');
                switch (type) {
                    case 'checkbox':
                        return el.checked;
                        break;
                    case 'radio':
                        let checkedEls = document.querySelectorAll('[type=radio][_data-model="' + el.getAttribute('_data-model') + '"]');
                        let checkedEl = null;
                        for (let i=0;i<checkedEls.length;i++){
                            if(checkedEls[i].checked) {
                                checkedEl = checkedEls[i];
                                break;
                            }
                        }
                        if (checkedEl) return checkedEl.value;
                        return '';
                        break;
                    default:
                        return el.value;
                        break;
                }
                break;
                break;
            case 'select':
                return el.value;
                break;
            case 'textarea':
                return el.value;
                break;
        }
    }
    static getDefaultInputChangeEvents(el){
        let tagName = el.tagName.toLowerCase();
        switch (tagName) {
            case 'input':
                let type = el.getAttribute('type');
                switch (type) {
                    case 'checkbox':
                        return 'click'; // ie8 not fire change for checkbox
                        break;
                    case 'radio':
                        return 'click'; // ie8 change returns previous value
                        break;
                    case 'range':
                    case 'number':
                        return 'input,change';
                        break;
                    default:
                        return 'keyup,input,change';
                        break;
                }
                break;
            case 'select':
                return 'change'; // todo DOMNodeRemoved
                break;
            case 'textarea':
                return 'keyup';
                break;
            default:
                return 'change';
                break;
        }
    }

    static addEventListener(el,type,fn){
        if (el.addEventListener) el.addEventListener(type,fn);
        else el.attachEvent('on'+type,fn);
    }

    static setTextNodeValue(el,value){
        if ('textContent' in el) {
            el.textContent = value;
        } else {
            el.nodeValue = value;
        }
    }

    // todo ie8 in emulation mode has classList, but it is uncorrect
    static toggleClass(el,className,isAdd) {
        if (el.classList) {
            el.classList.toggle(className,isAdd);
            return;
        }
        if (isAdd) {
            if (el.className.indexOf(className)==-1) el.className+=` ${className}`;
        } else {
            let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className=el.className.replace(reg, ' ');
        }
    }

    static nodeListToArray(nodeList){
        let arr = [];
        for (let i=0;i<nodeList.length;i++) {
            arr.push(nodeList[i]);
        }
        return arr;
    }

    static removeParentButNotChildren(nodeToBeRemoved){
        let children = DomUtils.nodeListToArray(nodeToBeRemoved.children);
        while (nodeToBeRemoved.firstChild) {
            nodeToBeRemoved.parentNode.insertBefore(nodeToBeRemoved.firstChild,
                nodeToBeRemoved);
        }
        nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
        return children;
    }

    static preventDefault(e){
        e = e || window.e;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
    }

    static getClosestElWithDataAttr(node,dataAttr){
        while (node) {
            if (node===document) return;
            if (node.hasAttribute(dataAttr)) return node;
            node = node.parentNode;
        }
    }

    static __getAttribute(el,attr){
        return(
            el.getAttribute
            &&
            (el.getAttribute(`data-${attr}`))
        );
    }

    static _get_If_expressionTopDownList(el){
        let res = [];
        do {
            let dataIfExp  = DomUtils.__getAttribute(el,'if');
            if (dataIfExp) {
                res.unshift(dataIfExp);
            }
        } while (el=el.parentNode);
        return res;
    }

}

DomUtils.EXPRESSION_REGEXP = /(\{\{[^\t]*?}})/;
