;(function() {
"use strict";

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ElementPrototype = typeof HTMLElement !== "undefined" ? HTMLElement.prototype : Element.prototype;

if (!ElementPrototype.remove) {
    ElementPrototype.remove = function () {
        this.parentNode.removeChild(this);
    };
}

if (!Object.keys) {
    // JScript in IE8 and below mistakenly skips over built-in properties.
    // https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
    var hasDontEnumBug = !{ toString: true }.propertyIsEnumerable('toString');

    var getKeys = function getKeys(object) {
        var type = typeof object === 'undefined' ? 'undefined' : _typeof(object);
        if (type != 'object' && type != 'function' || object === null) {
            throw new TypeError('Object.keys called on non-object');
        }

        var keys = [];
        for (var key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                keys.push(key);
            }
        }
        return keys;
    };

    if (hasDontEnumBug) {
        var dontEnumProperties = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'prototypeIsEnumerable', 'constructor'];

        Object.keys = function (object) {
            var keys = getKeys(object);
            for (var ii = 0, il = dontEnumProperties.length; ii < il; ii++) {
                var property = dontEnumProperties[ii];
                if (object.hasOwnProperty(property)) {
                    keys.push(property);
                }
            }
            return keys;
        };
    } else {
        Object.keys = getKeys;
    }
}

if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (callback /*, initialValue*/) {
        'use strict';

        if (this == null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        var t = Object(this),
            len = t.length >>> 0,
            k = 0,
            value;
        if (arguments.length >= 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in t)) {
                k++;
            }
            if (k >= len) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
        }
        for (; k < len; k++) {
            if (k in t) {
                value = callback(value, t[k], k, t);
            }
        }
        return value;
    };
}

if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function (callback, thisArg) {
        if (typeof this.length != 'number') return;
        if (typeof callback != 'function') return;

        if (_typeof(this) == 'object') {
            for (var i = 0; i < this.length; i++) {
                if (i in this) {
                    callback.call(thisArg || this, this[i], i, this);
                } else {
                    return;
                }
            }
        }
    };
}

[].filter || (Array.prototype.filter = // Use the native array filter method, if available.
function (a, //a function to test each value of the array against. Truthy values will be put into the new array and falsy values will be excluded from the new array
b, // placeholder
c, // placeholder
d, // placeholder
e // placeholder
) {
    c = this; // cache the array
    d = []; // array to hold the new values which match the expression
    for (e in c) {
        // for each value in the array,
        ~~e + '' == e && e >= 0 && // coerce the array position and if valid,
        a.call(b, c[e], +e, c) && // pass the current value into the expression and if truthy,
        d.push(c[e]);
    } // add it to the new array

    return d; // give back the new array
});

if (!Object.create) {
    Object.create = function (o, props) {
        function F() {}
        F.prototype = o;

        if ((typeof props === 'undefined' ? 'undefined' : _typeof(props)) === "object") {
            for (var prop in props) {
                if (props.hasOwnProperty(prop)) {
                    F[prop] = props[prop];
                }
            }
        }
        return new F();
    };
}

if (!window.Node) window.Node = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3
};

if ("a'b".split(/(')/g).length == 2) {
    String.prototype.split = function (delimiter /*,limit*/) {
        if (typeof delimiter == "undefined") {
            return [this];
        }
        var limit = arguments.length > 1 ? arguments[1] : -1;
        var result = [];
        if (delimiter.constructor == RegExp) {
            delimiter.global = true;
            var regexpResult,
                str = this,
                previousIndex = 0;
            while (regexpResult = delimiter.exec(str)) {
                result.push(str.substring(previousIndex, regexpResult.index));
                for (var captureGroup = 1, ct = regexpResult.length; captureGroup < ct; captureGroup++) {
                    result.push(regexpResult[captureGroup]);
                }
                str = str.substring(delimiter.lastIndex, str.length);
            }
            result.push(str);
        } else {
            var searchIndex = 0,
                foundIndex = 0,
                len = this.length,
                dlen = delimiter.length;
            while (foundIndex != -1) {
                foundIndex = this.indexOf(delimiter, searchIndex);
                if (foundIndex != -1) {
                    result.push(this.substring(searchIndex, foundIndex));
                    searchIndex = foundIndex + dlen;
                } else {
                    result.push(this.substring(searchIndex, len));
                }
            }
        }
        if (arguments.length > 1 && result.length > limit) {
            result = result.slice(0, limit);
        }
        return result;
    };
}
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
    function Component(name, node, modelView, localModelView) {
        _classCallCheck(this, Component);

        this.name = name;
        this.node = node;
        this.modelView = modelView;
        this.localModelView = localModelView;
        this.watchers = [];
        Component.instances.push(this);
    }

    Component.prototype.addWatcher = function addWatcher(expression, listenerFn) {
        var watcherFn = ExpressionEngine.getExpressionFn(expression);
        this.watchers.push({
            expression: expression,
            watcherFn: watcherFn,
            listenerFn: listenerFn
        });
        listenerFn(ExpressionEngine.runExpressionFn(watcherFn, this));
    };

    Component.prototype.digest = function digest() {
        var _this = this;

        this.watchers.forEach(function (watcher) {
            var newValue = ExpressionEngine.runExpressionFn(watcher.watcherFn, _this);
            if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) == 'object') {
                newValue = MiscUtils.deepCopy(newValue);
            }
            var oldValue = watcher.last;
            if (!MiscUtils.deepEqual(newValue, oldValue)) {
                watcher.listenerFn(newValue, oldValue);
            }
            watcher.last = newValue;
        });
    };

    Component.prototype.run = function run() {
        new DirectiveEngine(this).run();
    };

    Component.digestAll = function digestAll() {
        Component.instances.forEach(function (cmp) {
            cmp.digest();
        });
    };

    return Component;
}();

Component.instances = [];
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentProto = function () {
    function ComponentProto(name, node, modelView) {
        _classCallCheck(this, ComponentProto);

        this.name = name;
        this.node = node;
        this.modelView = modelView;
    }

    ComponentProto.prototype.applyProperties = function applyProperties(target) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var strict = opts.strict;
        Object.keys(properties).forEach(function (key) {
            if (strict && !target.hasOwnProperty(key)) throw "can not apply non declared property " + key + " to component " + target.name;
            target[key] = properties[key];
        });
    };

    ComponentProto.prototype.runNewInstance = function runNewInstance(node, properties) {
        var externalProperties = this.modelView.external;
        var modelView = MiscUtils.deepCopy(this.modelView);
        delete modelView.external;
        this.applyProperties(modelView, properties, { strict: true });
        externalProperties && this.applyProperties(modelView, externalProperties);
        var instance = new Component(this.name, node, modelView);
        instance.run();
    };

    return ComponentProto;
}();

ComponentProto.instances = [];
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * безымянный компонент, образованый методом applyBindings
 * либо при итерации
 */
var ScopedDomFragment = function (_Component) {
    _inherits(ScopedDomFragment, _Component);

    function ScopedDomFragment(node, modelView, localModelView) {
        _classCallCheck(this, ScopedDomFragment);

        return _possibleConstructorReturn(this, _Component.call(this, null, node, modelView, localModelView));
    }

    return ScopedDomFragment;
}(Component);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScopedLoopContainer = function (_Component) {
    _inherits(ScopedLoopContainer, _Component);

    function ScopedLoopContainer(node, modelView) {
        _classCallCheck(this, ScopedLoopContainer);

        var _this = _possibleConstructorReturn(this, _Component.call(this, null, node, modelView));

        _this.scopedDomFragments = [];
        _this.lastFrafmentsLength = 0;
        _this.node = node;
        return _this;
    }

    ScopedLoopContainer.prototype._destroyFragment = function _destroyFragment(index) {
        var currFragment = this.scopedDomFragments[index];
        currFragment.node.remove();
        this.scopedDomFragments.splice(index, 1);
        this.lastFrafmentsLength--;
    };

    ScopedLoopContainer.prototype.run = function run(eachItemName, iterableObjectName) {
        var _this2 = this;

        this.eachItemName = eachItemName;

        this.anchor = document.createComment('loop: ' + eachItemName + ' in ' + iterableObjectName);
        this.node.parentNode.insertBefore(this.anchor, this.node.nextSibling);
        this.node.remove();
        this.node = this.node.cloneNode(true);

        this.addWatcher(iterableObjectName, function (newArr, oldArr) {
            _this2._processIterations(newArr, oldArr);
        });
    };

    ScopedLoopContainer.prototype._processIterations = function _processIterations(newArr, oldArr) {
        var _this3 = this;

        var currNodeInIteration = this.anchor;
        newArr.forEach(function (iterableItem, i) {

            var localModelView = {};
            localModelView[_this3.eachItemName] = iterableItem;
            localModelView['index'] = i;

            if (!_this3.scopedDomFragments[i]) {
                var node = _this3.node.cloneNode(true);
                currNodeInIteration.parentNode.insertBefore(node, currNodeInIteration.nextSibling);
                var scopedDomFragment = new ScopedDomFragment(node, _this3.modelView, localModelView);
                new DirectiveEngine(scopedDomFragment).run();
                currNodeInIteration = node;
                _this3.scopedDomFragments.push(scopedDomFragment);
                _this3.lastFrafmentsLength++;
            } else {
                currNodeInIteration = _this3.scopedDomFragments[i].node;
                _this3.scopedDomFragments[i].localModelView = localModelView;
                _this3.scopedDomFragments[i].digest();
            }
        });

        if (this.lastFrafmentsLength > newArr.length) {
            var l = this.scopedDomFragments.length;
            for (var i = 0, max = this.lastFrafmentsLength - newArr.length; i < max; i++) {
                this._destroyFragment(l - i - 1);
            }
        }
    };

    return ScopedLoopContainer;
}(Component);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DirectiveEngine = function () {
    function DirectiveEngine(component) {
        _classCallCheck(this, DirectiveEngine);

        this.component = component;
    }

    DirectiveEngine.prototype._eachElementWithAttr = function _eachElementWithAttr(dataAttrName, onEachElementFn) {
        var elements = [];
        var nodes = this.component.node.querySelectorAll('[' + dataAttrName + ']');
        for (var i = 0; i < nodes.length; i++) {
            elements.push(nodes[i]);
        }
        if (this.component.node.hasAttribute(dataAttrName)) elements.push(this.component.node);
        elements.forEach(function (el) {
            var expression = el.getAttribute(dataAttrName);
            el.removeAttribute(dataAttrName);
            el.setAttribute('_' + dataAttrName, expression);
            onEachElementFn(el, expression);
        });
    };

    DirectiveEngine.prototype.runDirective_For = function runDirective_For() {
        var _this = this;

        this._eachElementWithAttr('data-for', function (el, expression) {
            var tokens = expression.split(' ');
            if (tokens[1] !== 'in') throw 'can not parse expression ' + expression;
            var eachItemName = tokens[0];
            var iterableObjectName = tokens[2];
            var scopedLoopContainer = new ScopedLoopContainer(el, _this.component.modelView);
            scopedLoopContainer.run(eachItemName, iterableObjectName);
        });
    };

    DirectiveEngine.prototype.runTextNodes = function runTextNodes() {
        var _this2 = this;

        DomUtils.processScopedTextNodes(this.component.node).forEach(function (it) {
            _this2.component.addWatcher(it.expression, function (value) {
                if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') value = JSON.stringify(value);
                DomUtils.setTextNodeValue(it.node, value);
            });
        });
    };

    DirectiveEngine.prototype.runDomEvent = function runDomEvent(eventName) {
        var _this3 = this;

        this._eachElementWithAttr('data-' + eventName, function (el, expression) {
            var fn = ExpressionEngine.getExpressionFn(expression);
            DomUtils.addEventListener(el, eventName, function (e) {
                e = e || window.e;
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
                e.cancelBubble = true;
                ExpressionEngine.runExpressionFn(fn, _this3.component);
                Component.digestAll();
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Bind = function runDirective_Bind() {
        var _this4 = this;

        this._eachElementWithAttr('data-bind', function (el, expression) {
            var fn = ExpressionEngine.getExpressionFn(expression);
            ExpressionEngine.runExpressionFn(fn, _this4.component);
            _this4.component.addWatcher(expression, function (value) {
                DomUtils.setTextNodeValue(el, value);
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Value = function runDirective_Value() {
        var el = this.component.node;
        var expression = el.getAttribute('data-value');
        if (!expression) return;
        if (el.tagName.toLowerCase() != 'option') throw 'data-value attribute supported only by <option>, use data-model instead';
        var fn = ExpressionEngine.getExpressionFn(expression);
        ExpressionEngine.runExpressionFn(fn, this.component);
        this.component.addWatcher(expression, function (value) {
            el.value = value;
        });
    };

    DirectiveEngine.prototype.runDirective_Model = function runDirective_Model() {
        var _this5 = this;

        this._eachElementWithAttr('data-model', function (el, expression) {
            if (el.getAttribute('type') == 'radio' && !el.getAttribute('name')) el.setAttribute('name', el.getAttribute('_data-model'));
            var eventNames = DomUtils.getDefaultInputChangeEvents(el);
            eventNames.split(',').forEach(function (eventName) {
                DomUtils.addEventListener(el, eventName, function () {
                    ExpressionEngine.setValueToContext(_this5.component.modelView, expression, DomUtils.getInputValue(el));
                    Component.digestAll();
                });
            });
            _this5.component.addWatcher(expression, function (value) {
                if (DomUtils.getInputValue(el) !== value) DomUtils.setInputValue(el, value);
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Class = function runDirective_Class() {
        var _this6 = this;

        this._eachElementWithAttr('data-class', function (el, expression) {
            _this6.component.addWatcher(expression, function (classObj) {
                for (var key in classObj) {
                    if (!classObj.hasOwnProperty(key)) continue;
                    DomUtils.toggleClass(el, key, !!classObj[key]);
                }
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Style = function runDirective_Style() {
        var _this7 = this;

        this._eachElementWithAttr('data-style', function (el, expression) {
            _this7.component.addWatcher(expression, function (styleObject) {
                for (var key in styleObject) {
                    if (!styleObject.hasOwnProperty(key)) continue;
                    el.style[key] = styleObject[key] ? styleObject[key] : '';
                }
            });
        });
    };

    DirectiveEngine.prototype.runDirective_If = function runDirective_If() {
        var _this8 = this;

        this._eachElementWithAttr('data-if', function (el, expression) {
            var comment = document.createComment('');
            el.parentNode.insertBefore(comment, el);
            var cloned = void 0;
            _this8.component.addWatcher(expression, function (val) {
                if (val) {
                    if (!el.parentElement) {
                        cloned = el.cloneNode(true);
                        comment.parentNode.insertBefore(cloned, comment.nextSibling);
                    }
                } else {
                    if (cloned) {
                        cloned.remove();
                    } else {
                        el.remove();
                    }
                }
            });
        });
    };

    DirectiveEngine.prototype.run = function run() {
        var _this9 = this;

        this.runDirective_Value();
        this.runDirective_For();
        this.runTextNodes();
        ['click', 'blur', 'focus', 'submit', 'change', 'keypress', 'keyup', 'keydown'].forEach(function (eventName) {
            _this9.runDomEvent(eventName);
        });
        this.runDirective_Bind();
        this.runDirective_Model();
        this.runDirective_Value();
        this.runDirective_Class();
        this.runDirective_Style();
        this.runDirective_If();
    };

    return DirectiveEngine;
}();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomUtils = function () {
    function DomUtils() {
        _classCallCheck(this, DomUtils);
    }

    /**
     * обработка текстовых узлов с выражением типа {{expression}}
     * @param root
     * @returns {Array}
     */
    DomUtils.processScopedTextNodes = function processScopedTextNodes(root) {
        var textNodes = getTextNodes(root);
        var result = [];
        textNodes.forEach(function (textNode) {
            var scopedNode = document.createDocumentFragment();
            var hasExpressions = false;
            (textNode.textContent || textNode.innerText || textNode.data).split(/(\{\{.*?}})/).forEach(function (item) {
                var newNode = void 0;
                if (item.indexOf('{{') == 0) {
                    newNode = document.createTextNode('');
                    var exp = item.split('{{').join('').split('}}').join('');
                    if (!exp) return;
                    hasExpressions = true;
                    result.push({
                        node: newNode,
                        expression: exp
                    });
                } else {
                    newNode = document.createTextNode(item);
                }
                scopedNode.appendChild(newNode);
            });
            hasExpressions && textNode.parentNode.replaceChild(scopedNode, textNode);
        });
        return result;

        function getTextNodes(root) {
            var textNodes = [];
            addTextNodes(root);
            Array.prototype.forEach.call(root.querySelectorAll('*'), addTextNodes);
            return textNodes;

            function addTextNodes(el) {
                textNodes = textNodes.concat(Array.prototype.filter.call(el.childNodes, function (k) {
                    return k.nodeType == Node.TEXT_NODE;
                }));
            }
        }
    };

    DomUtils.setInputValue = function setInputValue(el, value) {
        var tagName = el.tagName.toLowerCase();
        switch (tagName) {
            case 'input':
                var type = el.getAttribute('type');
                switch (type) {
                    case 'checkbox':
                        el.checked = !!value;
                        break;
                    case 'radio':
                        el.checked = value == el.value;
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
    };

    DomUtils.getInputValue = function getInputValue(el) {
        var tagName = el.tagName.toLowerCase();
        switch (tagName) {
            case 'input':
                var type = el.getAttribute('type');
                switch (type) {
                    case 'checkbox':
                        return el.checked;
                        break;
                    case 'radio':
                        var checkedEls = document.querySelectorAll('[type=radio][_data-model="' + el.getAttribute('_data-model') + '"]');
                        var checkedEl = null;
                        for (var i = 0; i < checkedEls.length; i++) {
                            if (checkedEls[i].checked) {
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
    };

    DomUtils.getDefaultInputChangeEvents = function getDefaultInputChangeEvents(el) {
        var tagName = el.tagName.toLowerCase();
        switch (tagName) {
            case 'input':
                var type = el.getAttribute('type');
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
                        return 'keyup,change';
                        break;
                }
                break;
            case 'select':
                return 'change';
                break;
            case 'textarea':
                return 'keyup';
                break;
            default:
                return 'change';
                break;
        }
    };

    DomUtils.addEventListener = function addEventListener(el, type, fn) {
        if (el.addEventListener) el.addEventListener(type, fn);else el.attachEvent('on' + type, fn);
    };

    DomUtils.setTextNodeValue = function setTextNodeValue(el, value) {
        if ('textContent' in el) {
            el.textContent = value;
        } else {
            el.nodeValue = value;
        }
    };

    DomUtils.toggleClass = function toggleClass(el, className, isAdd) {
        if (el.classList) {
            el.classList.toggle(className, isAdd);
            return;
        }
        if (isAdd) {
            if (el.className.indexOf(className) == -1) el.className += ' ' + className;
        } else {
            el.className = el.className.split(className).join(' ');
        }
    };

    DomUtils.nodeListToArray = function nodeListToArray(nodeList) {
        var arr = [];
        for (var i = 0; i < nodeList.length; i++) {
            arr.push(nodeList[i]);
        }
        return arr;
    };

    DomUtils.removeParentBunNotChildren = function removeParentBunNotChildren(nodeToBeRemoved) {
        while (nodeToBeRemoved.firstChild) {
            nodeToBeRemoved.parentNode.insertBefore(nodeToBeRemoved.firstChild, nodeToBeRemoved);
        }
        nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
    };

    return DomUtils;
}();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExpressionEngine = function () {
    function ExpressionEngine() {
        _classCallCheck(this, ExpressionEngine);
    }

    ExpressionEngine.getExpressionFn = function getExpressionFn(code) {
        var codeProcessed = '\n                var res;\n                with(localScope) {\n                    with(this){\n                        res=' + code + ';\n                    }\n                }\n                return res;';
        codeProcessed = codeProcessed.split('\n').join('').split('  ').join(' ');
        window.c = codeProcessed;
        var fn = new Function('localScope', codeProcessed);
        fn.expression = code;
        return fn;
    };

    ExpressionEngine.runExpressionFn = function runExpressionFn(fn, component) {
        try {
            return fn.call(component.modelView, component.localModelView || {});
        } catch (e) {
            console.error('can not evaluate expression:' + fn.expression);
            console.error('current context', component.modelView);
            console.error('current local context', component.localModelView);
            throw e;
        }
    };
    /**
     * ?????????? ???????? ??????? ?? ?????????
     * ????????, expression = 'user.name' object[field] = value
     */


    ExpressionEngine.setValueToContext = function setValueToContext(context, expression, value) {
        var quotes = '';
        if (typeof value == 'string') quotes = '"';
        var code = 'with(this){' + expression + ' = ' + quotes + value + quotes + '}';
        try {
            var fn = new Function(code);
            fn.call(context);
        } catch (e) {
            console.error('can not evaluate expression:' + expression);
            console.error('current code', code);
            console.error('current context', context);
            console.error('desired value to set', value);
            throw e;
        }
    };
    /**
     * ???????? js ?????? ?? ?????????? ????????? ???? "{a:1}"
     * @param code
     * @returns {*}
     */


    ExpressionEngine.getObjectFromString = function getObjectFromString(code) {
        try {
            var fn = new Function('return (' + code + ')');
            return fn();
        } catch (e) {
            console.error('can not parse properties: ' + code);
            throw e;
        }
    };

    return ExpressionEngine;
}();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MiscUtils = function () {
    function MiscUtils() {
        _classCallCheck(this, MiscUtils);
    }

    /**
     * �������� ������������ �������
     * @param obj
     * @returns {*}
     */
    MiscUtils.deepCopy = function deepCopy(obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var out = [],
                i = 0,
                len = obj.length;
            for (; i < len; i++) {
                out[i] = MiscUtils.deepCopy(obj[i]);
            }
            return out;
        }
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
            var _out = {};
            for (var _i in obj) {
                _out[_i] = MiscUtils.deepCopy(obj[_i]);
            }
            return _out;
        }
        return obj;
    };
    /**
     * ��������� �������� �� ��������� �� ��������
     * @param x
     * @param y
     * @returns {*}
     */


    MiscUtils.deepEqual = function deepEqual(x, y) {
        //if (isNaN(x) && isNaN(y)) return true;
        return x && y && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && (typeof y === 'undefined' ? 'undefined' : _typeof(y)) === 'object' ? Object.keys(x).length === Object.keys(y).length && Object.keys(x).reduce(function (isEqual, key) {
            return isEqual && MiscUtils.deepEqual(x[key], y[key]);
        }, true) : x === y;
    };

    return MiscUtils;
}();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Core = function () {
    function Core() {
        _classCallCheck(this, Core);
    }

    Core.registerComponent = function registerComponent(name, modelView) {
        var tmpl = document.getElementById(modelView.template.value);
        var domTemplate = tmpl.innerHTML;
        tmpl.remove();
        var node = document.createElement('div');
        node.innerHTML = domTemplate;
        var componentProto = new ComponentProto(name, node, modelView);
        ComponentProto.instances.push(componentProto);
    };

    Core.applyBindings = function applyBindings(domElement, modelView) {
        if (typeof domElement == 'string') domElement = document.querySelector(domElement);
        if (!domElement) throw "can not apply bindings: root element not defined";
        var fragment = new ScopedDomFragment(domElement, modelView);
        fragment.run();
    };

    Core.run = function run() {
        ComponentProto.instances.forEach(function (componentProto) {
            var domEls = DomUtils.nodeListToArray(document.getElementsByTagName(componentProto.name));
            var componentNodes = [];
            domEls.forEach(function (it) {
                var componentNode = componentProto.node.cloneNode(true);
                componentNodes.push(componentNode);
                it.parentNode.insertBefore(componentNode, it);
                var dataProperties = it.getAttribute('data-properties') || '{}';
                dataProperties = ExpressionEngine.getObjectFromString(dataProperties);
                componentProto.runNewInstance(componentNode, dataProperties);
                it.parentNode.removeChild(it);
            });
            componentNodes.forEach(function (node) {
                DomUtils.removeParentBunNotChildren(node);
            });
        });
    };

    return Core;
}();

Core.version = '0.0.1';

window.RF = Core;
}());
