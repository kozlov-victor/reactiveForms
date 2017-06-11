;(function() {
"use strict";

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

if (!window.console) {
    window.console = {};
    window.console.log = window.console.error = window.console.warn = function (msg) {
        window.status = msg;
    };
}

var ElementPrototype = typeof HTMLElement !== "undefined" ? HTMLElement.prototype : Element.prototype;

if (!ElementPrototype.remove) {
    ElementPrototype.remove = function () {
        this.parentNode && this.parentNode.removeChild(this);
    };
}

if (!ElementPrototype.matches) {
    (function (e) {
        e.matches || (e.matches = e.matchesSelector || function (selector) {
            var matches = document.querySelectorAll(selector),
                th = this;
            return Array.prototype.some.call(matches, function (e) {
                return e === th;
            });
        });
    })(Element.prototype);
}

if (!ElementPrototype.closest) {
    (function (e) {
        e.closest = e.closest || function (css) {
            var node = this;

            while (node) {
                if (node.matches(css)) return node;else node = node.parentElement;
            }
            return null;
        };
    })(Element.prototype);
}

if (!Object.keys) {
    Object.keys = function (obj) {
        var keys = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                keys.push(i);
            }
        }
        return keys;
    };
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
            value = void 0;
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

// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
    Array.prototype.some = function (fun /*, thisArg*/) {
        'use strict';

        if (this == null) {
            throw new TypeError('Array.prototype.some called on null or undefined');
        }

        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(thisArg, t[i], i, t)) {
                return true;
            }
        }

        return false;
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

if (!Array.prototype.map) {
    Array.prototype.map = function (fn) {
        var rv = [];
        for (var i = 0, l = this.length; i < l; i++) {
            rv.push(fn(this[i]));
        }return rv;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = from < 0 ? Math.ceil(from) : Math.floor(from);
        if (from < 0) from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt) return from;
        }
        return -1;
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return !this.indexOf(str);
    };
}

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

(function (undef) {

    var nativeSplit = String.prototype.split,
        compliantExecNpcg = /()??/.exec("")[1] === undef,
        // NPCG: nonparticipating capturing group
    self;

    self = function self(str, separator, limit) {
        // If `separator` is not a regex, use `nativeSplit`
        if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
            return nativeSplit.call(str, separator, limit);
        }
        var output = [],
            flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + ( // Proposed for ES6
        separator.sticky ? "y" : ""),
            // Firefox 3+
        lastLastIndex = 0,

        // Make `global` and avoid `lastIndex` issues by working with a copy
        separator = new RegExp(separator.source, flags + "g"),
            separator2,
            match,
            lastIndex,
            lastLength;
        str += ""; // Type-convert
        if (!compliantExecNpcg) {
            // Doesn't need flags gy, but they don't hurt
            separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
        }
        /* Values for `limit`, per the spec:
         * If undefined: 4294967295 // Math.pow(2, 32) - 1
         * If 0, Infinity, or NaN: 0
         * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
         * If negative number: 4294967296 - Math.floor(Math.abs(limit))
         * If other: Type-convert, then use the above rules
         */
        limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
        limit >>> 0; // ToUint32(limit)
        while (match = separator.exec(str)) {
            // `separator.lastIndex` is not reliable cross-browser
            lastIndex = match.index + match[0].length;
            if (lastIndex > lastLastIndex) {
                output.push(str.slice(lastLastIndex, match.index));
                // Fix browsers whose `exec` methods don't consistently return `undefined` for
                // nonparticipating capturing groups
                if (!compliantExecNpcg && match.length > 1) {
                    match[0].replace(separator2, function () {
                        for (var i = 1; i < arguments.length - 2; i++) {
                            if (arguments[i] === undef) {
                                match[i] = undef;
                            }
                        }
                    });
                }
                if (match.length > 1 && match.index < str.length) {
                    Array.prototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = lastIndex;
                if (output.length >= limit) {
                    break;
                }
            }
            if (separator.lastIndex === match.index) {
                separator.lastIndex++; // Avoid an infinite loop
            }
        }
        if (lastLastIndex === str.length) {
            if (lastLength || !separator.test("")) {
                output.push("");
            }
        } else {
            output.push(str.slice(lastLastIndex));
        }
        return output.length > limit ? output.slice(0, limit) : output;
    };

    // For convenience
    String.prototype.split = function (separator, limit) {
        return self(this, separator, limit);
    };

    return self;
})();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
    function Component(name, node, modelView) {
        var _this = this;

        _classCallCheck(this, Component);

        this.parent = null;
        this.children = null;
        this.disableParentScopeEvaluation = false;
        this.name = name;
        this.node = node;
        this.modelView = modelView;
        this.watchers = [];
        this.id = MiscUtils.getUID();
        this.domId = null;
        this.node.setAttribute('data-component-id', this.id);
        this.isWatchEnable = true;
        this.isMounted = false;
        this.isShown = false;
        this.stateExpression = null;
        DomUtils.nodeListToArray(this.node.querySelectorAll('*')).forEach(function (el) {
            el.setAttribute('data-component-id', _this.id);
        });
        modelView.$el = node;
        Component.instances.push(this);
    }

    Component.prototype.addChild = function addChild(childComponent) {
        if (!this.children) this.children = [];
        this.children.push(childComponent);
    };

    Component.prototype.setShown = function setShown(val, params) {
        var _this2 = this;

        var res = 'noChanged';
        if (this.isShown == val) return res;
        this.isShown = val;
        if (this.isShown) {
            res = this.modelView.onShow(params);
        } else {
            this.modelView.onHide();
        }
        this.isWatchEnable = val;
        if (this.children) {
            this.children.forEach(function (c) {
                c.setShown(_this2.isShown);
            });
        }
        return res;
    };

    Component.prototype.setMounted = function setMounted(val, params) {
        var _this3 = this;

        var res = 'noChanged';
        if (this.isMounted == val) return res;
        this.isMounted = val;
        if (this.isMounted) {
            res = this.modelView.onMount(params);
        } else {
            this.modelView.onUnmount();
        }
        this.isWatchEnable = val;
        if (this.children) {
            this.children.forEach(function (c) {
                c.setMounted(_this3.isMounted);
            });
        }
        return res;
    };

    Component.prototype.addWatcher = function addWatcher(expression, listenerFn) {
        var watcherFn = ExpressionEngine.getExpressionFn(expression);
        this.watchers.push({
            expression: expression,
            watcherFn: watcherFn,
            listenerFn: listenerFn
        });
        listenerFn(ExpressionEngine.runExpressionFn(watcherFn, this));
    };

    Component.prototype._updateExternalState = function _updateExternalState() {
        var _this4 = this;

        if (!this.stateExpression) return;
        var newExternalState = ExpressionEngine.executeExpression(this.stateExpression, this.parent);
        Object.keys(newExternalState).forEach(function (key) {
            if (_this4.modelView[key] !== newExternalState[key]) _this4.modelView[key] = newExternalState[key];
        });
    };

    Component.prototype.digest = function digest() {
        var _this5 = this;

        if (!this.isWatchEnable) return;

        this._updateExternalState();
        this.watchers.forEach(function (watcher) {
            var newValue = ExpressionEngine.runExpressionFn(watcher.watcherFn, _this5);
            var oldValue = watcher.last;
            var newValDeepCopy = MiscUtils.deepCopy(newValue);
            if (!MiscUtils.deepEqual(newValDeepCopy, oldValue)) {
                watcher.listenerFn(newValue, oldValue);
            }
            watcher.last = newValDeepCopy;
        });
    };

    Component.prototype.run = function run() {
        new DirectiveEngine(this).run();
    };

    Component.prototype.destroy = function destroy() {
        this.node.remove();
        Component.instances.splice(Component.instances.indexOf(this), 1);
        if (this.children) {
            this.children.forEach(function (c) {
                c.destroy();
            });
        }
    };

    Component.prototype.getComponentsByName = function getComponentsByName(name) {
        return this.children && this.children.filter(function (child) {
            return child.name == name;
        });
    };

    Component.prototype.getComponentById = function getComponentById(id) {
        return this.children && this.children.filter(function (child) {
            return child.domId == id;
        })[0];
    };

    Component.digestAll = function digestAll() {
        Component.instances.forEach(function (cmp) {
            cmp.digest();
        });
    };

    Component.getComponentByInternalId = function getComponentByInternalId(id) {
        var res = null;
        Component.instances.some(function (cmp) {
            if (cmp.id == id) {
                res = cmp;
                return true;
            }
        });
        return res;
    };

    Component.getComponentByDomId = function getComponentByDomId(domId) {
        var res = null;
        Component.instances.some(function (cmp) {
            if (cmp.domId == domId) {
                res = cmp;
                return true;
            }
        });
        return res;
    };

    return Component;
}();

Component.instances = [];
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentProto = function () {
    function ComponentProto(name, node, properties) {
        _classCallCheck(this, ComponentProto);

        this.name = name;
        this.node = node;
        this.properties = properties;
    }

    ComponentProto.prototype.newInstance = function newInstance(node, externalProperties) {
        var modelView = new ModelView(this.name, this.properties, externalProperties);
        var cmp = new Component(this.name, node, modelView);
        modelView.component = cmp;
        return cmp;
    };

    ComponentProto.getByName = function getByName(name) {
        return ComponentProto.instances.filter(function (it) {
            return it.name == name;
        })[0] || null;
    };

    return ComponentProto;
}();

ComponentProto.instances = [];
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = function noop() {
    return 'noChanged';
};

var ModelView = function () {
    function ModelView(componentName) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var externalProperties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, ModelView);

        this.name = componentName || '';
        this.initialProperties = properties;
        this.externalProperties = externalProperties;
        this.component = null;
        this.resetState({ warnRedefined: true });

        this.onShow = this.onShow || noop;
        this.onHide = this.onHide || noop;
        this.onMount = this.onMount || noop;
        this.onUnmount = this.onUnmount || noop;
        this.onDestroy = this.onDestroy || noop;
    }

    ModelView.prototype.resetState = function resetState() {
        var warnRedefined = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var properties = this.initialProperties;
        this._applyState(properties);
        var initialState = properties.getInitialState && properties.getInitialState();
        initialState && (initialState = MiscUtils.deepCopy(initialState));
        initialState && this._applyState(initialState, { warnRedefined: warnRedefined });
        this._applyState(this.externalProperties, { strict: true });
        this.component && this.component._updateExternalState();
    };

    ModelView.prototype._applyState = function _applyState() {
        var _this = this;

        var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var strict = opts.strict;

        Object.keys(properties).forEach(function (key) {
            if (strict && !_this.hasOwnProperty(key)) throw '\n                    can not apply non declared property "' + key + '" to component "' + _this.name + '",\n                    declare property in getInitialState() method\n                ';
            if (opts.warnRedefined && properties[key] && _this.hasOwnProperty(key)) {
                console.warn('property ' + key + ' is redefined at component ' + _this.name);
            }
            _this[key] = properties[key];
        });
    };

    return ModelView;
}();
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

    function ScopedDomFragment(node, modelView) {
        _classCallCheck(this, ScopedDomFragment);

        return _possibleConstructorReturn(this, _Component.call(this, null, node, modelView));
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

        if (node.getAttribute('data-for')) throw 'can not use "data-for" attribute at component directly. Use this directive at parent node';

        _this.scopedDomFragments = [];
        _this.lastFrafmentsLength = 0;
        _this.node = node;
        _this.parent = null;
        return _this;
    }

    ScopedLoopContainer.prototype._destroyFragment = function _destroyFragment(index) {
        var removedFragment = this.scopedDomFragments.splice(index, 1)[0];
        removedFragment.destroy();
        this.lastFrafmentsLength--;
    };

    ScopedLoopContainer.prototype.run = function run(eachItemName, indexName, iterableObjectName) {
        var _this2 = this;

        this.eachItemName = eachItemName;
        this.indexName = indexName;

        this.anchor = document.createComment('component-id: ' + this.id + '; loop: ' + eachItemName + ' in ' + iterableObjectName);
        this.node.parentNode.insertBefore(this.anchor, this.node.nextSibling);
        this.node.remove();
        this.node = this.node.cloneNode(true);

        this.addWatcher(iterableObjectName, function (newArr, oldArr) {
            _this2._processIterations(newArr, oldArr);
        });
    };

    ScopedLoopContainer.prototype._processIterations = function _processIterations() {
        var _this3 = this;

        var newArr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var oldArr = arguments[1];


        var currNodeInIteration = this.anchor;
        if (newArr instanceof Object) newArr = MiscUtils.objectToArray(newArr);

        if (!newArr.forEach) {
            console.error(this.node);
            throw 'can not evaluate loop expression: ' + this.eachItemName + (this.indexName ? ',' + this.eachItemName : '') + '. Expected object or array, but ' + newArr + ' found.';
        }

        var index = 0;
        newArr.forEach(function (iterableItem, i) {

            if ('key' in iterableItem && 'value' in iterableItem) {
                // if looped object with key and value pairs
                i = iterableItem.key;
                iterableItem = iterableItem.value;
            }

            if (!_this3.scopedDomFragments[index]) {

                var props = {};
                props[_this3.eachItemName] = iterableItem;
                if (_this3.indexName) props[_this3.indexName] = i;
                var localModelView = new ModelView(_this3.indexName, props);

                var node = _this3.node.cloneNode(true);
                var scopedDomFragment = new ScopedDomFragment(node, localModelView);
                // todo Cannot read property 'insertBefore' of null
                currNodeInIteration.parentNode.insertBefore(node, currNodeInIteration.nextSibling);
                scopedDomFragment.parent = _this3.parent;
                scopedDomFragment.parent.addChild(scopedDomFragment);

                scopedDomFragment.run();
                currNodeInIteration = node;
                _this3.scopedDomFragments.push(scopedDomFragment);
                _this3.lastFrafmentsLength++;
            } else {

                var _localModelView = _this3.scopedDomFragments[index].modelView;
                _localModelView[_this3.eachItemName] = iterableItem;
                if (_this3.indexName) _localModelView[_this3.indexName] = i;

                currNodeInIteration = _this3.scopedDomFragments[index].node;
                _this3.scopedDomFragments[index].digest();
            }
            index++;
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
            (textNode.textContent || textNode.innerText || textNode.data).split(DomUtils.EXPRESSION_REGEXP).forEach(function (item) {
                var newNode = void 0;
                var trimmed = item.trim();
                if (trimmed.indexOf('{{') == 0) {
                    newNode = document.createTextNode('');
                    var exp = trimmed.split('{{').join('').split('}}').join('');
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

    // todo ie8 in emulation mode has classList, but it is uncorrect


    DomUtils.toggleClass = function toggleClass(el, className, isAdd) {
        if (el.classList) {
            el.classList.toggle(className, isAdd);
            return;
        }
        if (isAdd) {
            if (el.className.indexOf(className) == -1) el.className += ' ' + className;
        } else {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    };

    DomUtils.nodeListToArray = function nodeListToArray(nodeList) {
        var arr = [];
        for (var i = 0; i < nodeList.length; i++) {
            arr.push(nodeList[i]);
        }
        return arr;
    };

    DomUtils.removeParentButNotChildren = function removeParentButNotChildren(nodeToBeRemoved) {
        var children = DomUtils.nodeListToArray(nodeToBeRemoved.children);
        while (nodeToBeRemoved.firstChild) {
            nodeToBeRemoved.parentNode.insertBefore(nodeToBeRemoved.firstChild, nodeToBeRemoved);
        }
        nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
        return children;
    };

    DomUtils.preventDefault = function preventDefault(e) {
        e = e || window.e;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
    };

    DomUtils.getClosestElWithDataAttr = function getClosestElWithDataAttr(node, dataAttr) {
        while (node) {
            if (node === document) return;
            if (node.hasAttribute(dataAttr)) return node;
            node = node.parentNode;
        }
    };

    return DomUtils;
}();

DomUtils.EXPRESSION_REGEXP = /(\{\{[^\t]*?}})/;
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MiscUtils = function () {
    function MiscUtils() {
        _classCallCheck(this, MiscUtils);
    }

    /**
     * @param obj
     * @param _clonedObjects - internal store of cloned object to avoid self-cycled object recursion
     * @returns {*}
     */
    MiscUtils.deepCopy = function deepCopy(obj) {
        var _clonedObjects = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        if (obj === undefined) return undefined;else if (obj === null) return null;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var out = [],
                i = 0,
                len = obj.length;
            for (; i < len; i++) {
                var clonedObject = void 0;
                if (_clonedObjects.indexOf(obj[i]) > -1) {
                    clonedObject = obj[i];
                } else {
                    _clonedObjects.push(obj[i]);
                    clonedObject = MiscUtils.deepCopy(obj[i], _clonedObjects);
                }
                out[i] = clonedObject;
            }
            return out;
        }
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
            var _out = {};
            for (var _i in obj) {
                var _clonedObject = void 0;
                if (_clonedObjects.indexOf(obj[_i]) > -1) {
                    _clonedObject = obj[_i];
                } else {
                    _clonedObjects.push(obj[_i]);
                    _clonedObject = MiscUtils.deepCopy(obj[_i], _clonedObjects);
                }
                _out[_i] = _clonedObject;
            }
            return _out;
        }
        return obj;
    };

    MiscUtils.superficialCopy = function superficialCopy(a, b) {
        if (!(a && b)) return;
        Object.keys(b).forEach(function (key) {
            a[key] = b[key];
        });
    };

    /**
     * @param x
     * @param y
     * @returns {*}
     */


    MiscUtils.deepEqual = function deepEqual(x, y) {
        //if (isNaN(x) && isNaN(y)) return true;
        if (x && y && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && (typeof y === 'undefined' ? 'undefined' : _typeof(y)) === 'object') {
            if (x === y) return true;
            return Object.keys(x).length === Object.keys(y).length && Object.keys(x).reduce(function (isEqual, key) {
                return isEqual && MiscUtils.deepEqual(x[key], y[key]);
            }, true);
        } else {
            return x === y;
        }
    };

    MiscUtils.camelToSnake = function camelToSnake(str) {
        return str.replace(/([A-Z])/g, function ($1) {
            return "-" + $1.toLowerCase();
        });
    };

    MiscUtils.getUID = function getUID() {
        return cnt++;
    };

    MiscUtils.objectToArray = function objectToArray(obj) {
        var res = [];
        Object.keys(obj).forEach(function (key) {
            res.push({ key: key, value: obj[key] });
        });
        return res;
    };

    return MiscUtils;
}();

var cnt = 0;
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TemplateLoader = function () {
    function TemplateLoader() {
        _classCallCheck(this, TemplateLoader);
    }

    TemplateLoader._getNodeFromDom = function _getNodeFromDom(templateObj, componentName) {
        if (!templateObj.value) {
            console.error("can not process template at component " + componentName);
            throw "template.value must be specified";
        }
        var node = document.getElementById(templateObj.value);
        if (!node) throw "can not fing dom element with id " + templateObj.value;
        return node;
    };

    TemplateLoader._getNodeFromString = function _getNodeFromString(templateObj, componentName) {
        if (!templateObj.value) throw "template string not provided";
        if (typeof templateObj.value !== 'string') {
            console.error("can not process template at component " + componentName);
            throw "template.value mast be a String, but " + _typeof(templateObj.value) + " found";
        }
        var container = document.createElement('div');
        container.innerHTML = templateObj.value;
        return container;
    };

    TemplateLoader.getNode = function getNode() {
        var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var componentName = arguments[1];

        var templateObj = properties.template;
        if (!templateObj) throw "template object not defined. Provide template at your component '" + componentName + "'";
        switch (templateObj.type) {
            case 'dom':
                return TemplateLoader._getNodeFromDom(templateObj, componentName);
            case 'string':
                return TemplateLoader._getNodeFromString(templateObj, componentName);
            default:
                console.error("can not process template at component " + componentName);
                throw "can not load template with type " + templateObj.type + ", only \"dom\" and \"string\" types is supported";
        }
    };

    return TemplateLoader;
}();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dataTransclusion = 'data-transclusion';

var ComponentHelper = function ComponentHelper() {
    _classCallCheck(this, ComponentHelper);
};
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DirectiveEngine = function () {
    function DirectiveEngine(component, ignoreComponents) {
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
            var processed = onEachElementFn(el, expression);
            if (processed === false) el.setAttribute(dataAttrName, expression);
        });
    };

    DirectiveEngine.prototype.runDirective_For = function runDirective_For() {
        var _this = this;

        this._eachElementWithAttr('data-for', function (el, expression) {
            var closestTransclusionEl = el.closest('[data-transclusion]');

            if (closestTransclusionEl && !closestTransclusionEl.getAttribute('data-_processed')) return false;
            expression = expression.replace(/,\s+/, ',').replace(/[\t\n]+/, ' ');
            var tokens = expression.split(' ').filter(function (it) {
                return it.length;
            });
            if (['in', 'of'].indexOf(tokens[1]) == -1) throw 'can not parse expression: ' + expression;
            var variables = Lexer.tokenize(tokens[0]).filter(function (t) {
                return [Token.TYPE.VARIABLE, Token.TYPE.OBJECT_KEY].indexOf(t.tokenType) > -1;
            }).map(function (t) {
                return t.tokenValue;
            });

            if (!variables.length) throw 'can not parse expression: ' + expression;
            var eachItemName = variables[0];
            var indexName = variables[1];
            var iterableObjectName = tokens[2];
            var scopedLoopContainer = new ScopedLoopContainer(el, _this.component.modelView);
            scopedLoopContainer.parent = _this.component;
            scopedLoopContainer.run(eachItemName, indexName, iterableObjectName);
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

    DirectiveEngine.prototype._runDomEvent = function _runDomEvent(el, expression, eventName) {
        var _this3 = this;

        var closestForm = el.closest('form');
        var shouldPreventDefault = !!closestForm && !closestForm.__shouldPreventDefault__;
        var fn = ExpressionEngine.getExpressionFn(expression);
        if (shouldPreventDefault && el !== closestForm) {
            DomUtils.addEventListener(closestForm, 'submit', function (e) {
                DomUtils.preventDefault(e);
                return false;
            });
        }
        DomUtils.addEventListener(el, eventName, function (e) {
            _this3.component.modelView.$event = e;
            ExpressionEngine.runExpressionFn(fn, _this3.component);
            delete _this3.component.modelView.$event;
            Component.digestAll();
            if (eventName == 'submit') {
                DomUtils.preventDefault(e);
                return false;
            }
        });
        closestForm && (closestForm.__shouldPreventDefault__ = '__shouldPreventDefault__');
    };

    DirectiveEngine.prototype.runDomEvent = function runDomEvent(eventName) {
        var _this4 = this;

        this._eachElementWithAttr('data-' + eventName, function (el, expression) {
            _this4._runDomEvent(el, expression, eventName);
        });
    };

    DirectiveEngine.prototype.runDomEvent_Change = function runDomEvent_Change() {
        var _this5 = this;

        this._eachElementWithAttr('data-' + 'change', function (el, expression) {
            ['keyup', 'blur', 'input', 'change'].forEach(function (eventName) {
                _this5._runDomEvent(el, expression, eventName);
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Bind = function runDirective_Bind() {
        var _this6 = this;

        this._eachElementWithAttr('data-bind', function (el, expression) {
            ExpressionEngine.runExpressionFn(fn, _this6.component);
            _this6.component.addWatcher(expression, function (value) {
                DomUtils.setTextNodeValue(el, value);
            });
        });
    };

    DirectiveEngine.prototype._runDirective_Model_OfSelect = function _runDirective_Model_OfSelect(selectEl, modelExpression) {
        var isMultiple = selectEl.multiple,
            val = [];
        var selectedEls = DomUtils.nodeListToArray(selectEl.querySelectorAll('option')).filter(function (opt) {
            return opt.selected;
        });
        selectedEls.forEach(function (selectedEl) {
            var dataValueAttr = selectedEl.getAttribute('data-value');
            var component = void 0;
            component = Component.getComponentByInternalId(selectedEl.getAttribute('data-component-id'));
            if (component && dataValueAttr) {
                val.push(ExpressionEngine.executeExpression(dataValueAttr, component));
            } else {
                val.push(selectedEl.getAttribute('value'));
            }
        });
        ExpressionEngine.setValueToContext(this.component, modelExpression, isMultiple ? val : val[0]);
    };

    DirectiveEngine.prototype.runDirective_Model = function runDirective_Model() {
        var _this7 = this;

        this._eachElementWithAttr('data-model', function (el, expression) {
            if (el.getAttribute('type') == 'radio' && !el.getAttribute('name')) el.setAttribute('name', expression);
            var eventNames = DomUtils.getDefaultInputChangeEvents(el);
            eventNames.split(',').forEach(function (eventName) {
                if (el.tagName.toLowerCase() == 'select') {
                    DomUtils.addEventListener(el, eventName, function (e) {
                        _this7._runDirective_Model_OfSelect(el, expression);
                        Component.digestAll();
                    });
                } else {
                    DomUtils.addEventListener(el, eventName, function (e) {
                        ExpressionEngine.setValueToContext(_this7.component, expression, DomUtils.getInputValue(el));
                        Component.digestAll();
                    });
                }
            });
            _this7.component.addWatcher(expression, function (value) {
                if (el.tagName.toLowerCase() == 'select') {
                    var isMultiple = el.multiple;
                    var isModelSet = false;
                    DomUtils.nodeListToArray(el.querySelectorAll('option')).some(function (opt) {
                        var modelItemExpression = opt.getAttribute('data-value');
                        if (!modelItemExpression) return;
                        var componentId = opt.getAttribute('data-component-id');
                        var component = Component.getComponentByInternalId(componentId);
                        var modelItem = ExpressionEngine.executeExpression(modelItemExpression, component);
                        if (isMultiple) {
                            if (value.indexOf(modelItem) > -1) {
                                isModelSet = true;
                                opt.selected = true;
                            } else {
                                opt.selected = false;
                            }
                        } else {
                            if (modelItem == value) {
                                opt.selected = true;
                                isModelSet = true;
                                return true;
                            }
                        }
                    });
                    if (!isModelSet) {
                        el.value = value;
                        if (isMultiple) {
                            DomUtils.nodeListToArray(el.querySelectorAll('option')).forEach(function (opt) {
                                opt.selected = value.indexOf(opt.getAttribute('value')) > -1;
                            });
                        }
                    }
                } else {
                    if (DomUtils.getInputValue(el) !== value) DomUtils.setInputValue(el, value);
                }
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Class = function runDirective_Class() {
        var _this8 = this;

        this._eachElementWithAttr('data-class', function (el, expression) {
            var initialClassName = el.className;
            _this8.component.addWatcher(expression, function (classNameOrObj) {
                if ((typeof classNameOrObj === 'undefined' ? 'undefined' : _typeof(classNameOrObj)) === 'object') {
                    for (var key in classNameOrObj) {
                        if (!classNameOrObj.hasOwnProperty(key)) continue;
                        DomUtils.toggleClass(el, key, !!classNameOrObj[key]);
                    }
                } else {
                    el.className = initialClassName + ' ' + classNameOrObj;
                }
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Style = function runDirective_Style() {
        var _this9 = this;

        this._eachElementWithAttr('data-style', function (el, expression) {
            _this9.component.addWatcher(expression, function (styleObject) {
                for (var key in styleObject) {
                    if (!styleObject.hasOwnProperty(key)) continue;
                    try {
                        el.style[key] = styleObject[key] ? styleObject[key] : '';
                    } catch (e) {
                        //ie8 throws error if style is incorrect
                    }
                }
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Disabled = function runDirective_Disabled() {
        var _this10 = this;

        this._eachElementWithAttr('data-disabled', function (el, expression) {
            _this10.component.addWatcher(expression, function (value) {
                if (value) el.setAttribute('disabled', 'disabled');else el.removeAttribute('disabled');
            });
        });
    };

    DirectiveEngine.prototype._getChildComponents = function _getChildComponents(el) {
        var componentIds = {};
        var thisId = el.getAttribute('data-component-id');
        var res = [];
        if (!el.children) return [];
        DomUtils.nodeListToArray(el.querySelectorAll('*')).map(function (it) {
            return it.getAttribute('data-component-id');
        }).forEach(function (componentId) {
            if (!componentIds[componentId]) {
                componentIds[componentId] = true;
                if (thisId != componentId) res.push(RF._getComponentByInternalId(componentId));
            }
        });
        return res;
    };

    DirectiveEngine.prototype.runDirective_If = function runDirective_If() {
        var _this11 = this;

        this._eachElementWithAttr('data-if', function (el, expression) {
            var comment = document.createComment('');
            el.parentNode.insertBefore(comment, el);
            var childComponents = _this11._getChildComponents(el);
            _this11.component.addWatcher(expression, function (val) {
                if (val) {
                    if (!el.parentElement) {
                        comment.parentNode.insertBefore(el, comment.nextSibling);
                        childComponents.forEach(function (cmp) {
                            cmp.setMounted(true);
                            cmp.setShown(true);
                        });
                    }
                } else {
                    el.remove();
                    childComponents.forEach(function (cmp) {
                        cmp.setMounted(false);
                        cmp.setShown(false);
                    });
                }
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Show = function runDirective_Show() {
        var _this12 = this;

        this._eachElementWithAttr('data-show', function (el, expression) {
            var initialStyle = el.style.display || '';
            var childComponents = _this12._getChildComponents(el);
            _this12.component.addWatcher(expression, function (val) {
                if (val) {
                    el.style.display = initialStyle;
                    childComponents.forEach(function (cmp) {
                        cmp.setShown(true);
                    });
                } else {
                    el.style.display = 'none';
                    childComponents.forEach(function (cmp) {
                        cmp.setShown(false);
                    });
                }
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Hide = function runDirective_Hide() {
        var _this13 = this;

        this._eachElementWithAttr('data-hide', function (el, expression) {
            var initialStyle = el.style.display || '';
            var childComponents = _this13._getChildComponents(el);
            _this13.component.addWatcher(expression, function (val) {
                if (val) {
                    el.style.display = 'none';
                    childComponents.forEach(function (cmp) {
                        cmp.setShown(false);
                    });
                } else {
                    el.style.display = initialStyle;
                    childComponents.forEach(function (cmp) {
                        cmp.setShown(true);
                    });
                }
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Html = function runDirective_Html() {
        var _this14 = this;

        this._eachElementWithAttr('data-html', function (el, expression) {
            _this14.component.addWatcher(expression, function (val) {
                el.innerHTML = val;
            });
        });
    };

    DirectiveEngine.prototype._runAttributes = function _runAttributes(el, properties) {
        Object.keys(properties).forEach(function (key) {
            var val = properties[key];
            if (typeof val == 'boolean') val ? el.setAttribute(key, key) : el.removeAttribute(key);else el.setAttribute(key, val);
        });
    };

    DirectiveEngine.prototype.runDirective_Attributes = function runDirective_Attributes() {
        var _this15 = this;

        this._eachElementWithAttr('data-attributes', function (el, expression) {
            _this15.component.addWatcher(expression, function (properties) {
                _this15._runAttributes(el, properties);
            });
        });
    };

    DirectiveEngine.prototype.runDirective_Attribute = function runDirective_Attribute() {
        var _this16 = this;

        this._eachElementWithAttr('data-attribute', function (el, expression) {
            expression = '{' + expression + '}';
            _this16.component.addWatcher(expression, function (properties) {
                _this16._runAttributes(el, properties);
            });
        });
    };

    DirectiveEngine.prototype.runComponents = function runComponents() {
        var _this17 = this;

        // todo refactor
        var transclComponents = [];
        ComponentProto.instances.forEach(function (componentProto) {
            var domEls = DomUtils.nodeListToArray(_this17.component.node.getElementsByTagName(componentProto.name));
            if (_this17.component.node.tagName.toLowerCase() == componentProto.name.toLowerCase()) {
                console.error('\n                   Can not use "data-for" attribute at component directly. Use "data-for" directive at parent node');
                console.error('component node:', _this17.component.node);
                throw "Can not use data-for attribute at component";
            }
            var componentNodes = [];
            domEls.forEach(function (domEl) {

                if (domEl.getAttribute('data-_processed')) return;
                domEl.setAttribute('data-_processed', '1');

                var dataTransclusion = 'data-transclusion';

                var hasNotTranscluded = false;
                DomUtils.nodeListToArray(domEl.childNodes).forEach(function (chdrn) {
                    if (chdrn.hasAttribute && !chdrn.hasAttribute(dataTransclusion)) hasNotTranscluded = true;
                });
                if (hasNotTranscluded) {
                    console.warn(domEl);
                    console.warn('children elements of component ' + componentProto.name + ' will be removed');
                }

                var domId = domEl.getAttribute('id');
                var componentNode = componentProto.node.cloneNode(true);
                DomUtils.nodeListToArray(componentNode.querySelectorAll('[' + dataTransclusion + ']')).forEach(function (transclNode) {
                    var name = transclNode.getAttribute(dataTransclusion);
                    if (!name) {
                        console.error(componentProto.node);
                        console.error(transclNode);
                        throw dataTransclusion + ' attribute can not be empty';
                    }

                    var recipients = DomUtils.nodeListToArray(domEl.querySelectorAll('[' + dataTransclusion + '=' + name + ']')).filter(function (el) {
                        var closestWithSameName = el.parentNode && el.parentNode.closest('[' + dataTransclusion + '=' + name + ']');
                        if (!!closestWithSameName) {
                            console.error(domEl);
                            console.error(closestWithSameName);
                            throw '\n                                    transclusion name conflict: \n                                    dont use same transclusion name at different components with parent-child relations. \n                                    Conflicted name: "' + name + '"';
                        }
                        return true;
                    });

                    recipients.forEach(function (rcp) {
                        transclNode.innerHTML = '';
                        transclComponents.push({ transclNode: transclNode, rcp: rcp });
                    });
                });
                domEl.parentNode.insertBefore(componentNode, domEl);

                var dataStateExpression = domEl.getAttribute('data-state');
                var dataState = dataStateExpression ? ExpressionEngine.executeExpression(dataStateExpression, _this17.component) : {};
                var component = componentProto.newInstance(componentNode, dataState);
                domId && (component.domId = domId);

                component.parent = _this17.component;
                component.parent.addChild(component);
                if (dataStateExpression) component.stateExpression = dataStateExpression;
                component.disableParentScopeEvaluation = true; // avoid recursion in Component

                component.run();

                domEl.parentNode.removeChild(domEl);
                componentNodes.push({ component: component, componentNode: componentNode });
            });
            var hasStateChanged = false;
            componentNodes.forEach(function (item) {
                var children = DomUtils.removeParentButNotChildren(item.componentNode);
                if (children.length == 1) {
                    item.component.modelView.$el = children[0];
                } else {
                    item.component.modelView.$el = children;
                }
                hasStateChanged = item.component.setMounted(true) != 'noChanged' || hasStateChanged;
                hasStateChanged = item.component.setShown(true) != 'noChanged' || hasStateChanged;
            });
            hasStateChanged && Component.digestAll();
        });
        transclComponents.forEach(function (trnscl) {
            //trnscl.transclNode.innerHTML = trnscl.rcp.innerHTML;
            DomUtils.nodeListToArray(trnscl.rcp.childNodes).forEach(function (n) {
                trnscl.transclNode.appendChild(n);
            });
            var transclComponent = new ScopedDomFragment(trnscl.transclNode, new ModelView(_this17.component.name));
            _this17.component.addChild(transclComponent);
            transclComponent.parent = _this17.component;
            trnscl.transclNode.setAttribute('data-_processed', '1');
            transclComponent.run();
        });
    };

    DirectiveEngine.prototype.runExpressionsInAttrs = function runExpressionsInAttrs() {
        var _this18 = this;

        DomUtils.nodeListToArray(this.component.node.querySelectorAll('*')).forEach(function (node) {
            if (!node.attributes) return;
            Array.prototype.forEach.call(node.attributes, function (attr) {
                if (!attr) return;
                var name = attr.name,
                    value = attr.value;

                if (value.indexOf('{{') == -1 && value.indexOf('}}') == -1) return;
                value = value.split(/[\n\t]|[\s]{2,}/).join(' ').trim();
                var resultExpArr = [],
                    resultExpr = '';
                value.split(DomUtils.EXPRESSION_REGEXP).forEach(function (token) {
                    if (!token.length) return;
                    if (token.indexOf('{{') == 0) {
                        token = token.split('{{').join('').split('}}').join('');
                        resultExpArr.push('(' + token + ')');
                    } else {
                        resultExpArr.push('"' + token + '"');
                    }
                });
                resultExpr = resultExpArr.join('+');
                _this18.component.addWatcher(resultExpr, function (expr) {
                    node.setAttribute(name, expr.trim());
                });
            });
        });
    };

    DirectiveEngine.prototype.run = function run() {
        var _this19 = this;

        this.runDirective_For();
        this.runComponents();
        this.runTextNodes();
        this.runDirective_Model(); // todo check event sequence in legacy browsers
        ['click', 'blur', 'focus', 'submit', 'keypress', 'keyup', 'keydown', 'input', 'mousedown', 'mouseup', 'mousemove', 'mouseleave', 'mouseenter', 'mouseover', 'mousout'].forEach(function (eventName) {
            _this19.runDomEvent(eventName);
        });
        this.runDomEvent_Change();
        this.runDirective_Bind();
        this.runDirective_Class();
        this.runDirective_Style();
        this.runDirective_Show();
        this.runDirective_Hide();
        this.runDirective_Disabled();
        this.runDirective_Html();
        this.runDirective_Attribute();
        this.runDirective_Attributes();
        this.runExpressionsInAttrs();
        this.runDirective_If();
    };

    return DirectiveEngine;
}();
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _getValByPath = function _getValByPath(component, path) {
    if (!path) return component.modelView;
    var keys = path.split('.');
    var lastKey = keys.pop();
    var contextForPath = component.modelView;
    var res = component.modelView;
    keys.forEach(function (key) {
        if (res !== undefined) {
            res = res[key];
            if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'object') contextForPath = res;
        }
    });
    if (res !== undefined) res = res[lastKey];
    if (!component.disableParentScopeEvaluation && res === undefined && component.parent) {
        return _getValByPath(component.parent, path);
    } else {
        if (res && res.call) {
            return function () {
                return res.apply(contextForPath, Array.prototype.slice.call(arguments));
            };
        }
        return res;
    }
};
var getVal = function getVal(component, path) {
    return _getValByPath(component, path);
};
var RF_API = { getVal: getVal };
var RF_API_STR = '__RF__';

var cache = {};

var ExpressionEngine = function () {
    function ExpressionEngine() {
        _classCallCheck(this, ExpressionEngine);
    }

    ExpressionEngine.getExpressionFn = function getExpressionFn(code) {
        var unconvertedCodeTail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        code = code.split('\n').join('').split("'").join('"');
        var codeProcessed = '\n                return ' + Lexer.convertExpression(code, RF_API_STR + '.getVal(component,\'{expr}\')') + '\n        ' + unconvertedCodeTail;
        try {
            var fn = new Function('component', '' + RF_API_STR, codeProcessed);
            fn.expression = code;
            fn.fnProcessed = fn.toString();
            return fn;
        } catch (e) {
            console.error('can not compile function from expression');
            console.error('expression', code);
            console.error('compiled code', codeProcessed);
            throw e;
        }
    };

    ExpressionEngine.runExpressionFn = function runExpressionFn(fn, component) {
        try {
            return fn.call(component.modelView, component, RF_API);
        } catch (e) {
            console.error('getting value error');
            console.error('can not evaluate expression:' + fn.expression);
            console.error('     at compiled function:' + fn.fnProcessed);
            console.error('component', component);
            throw e;
        }
    };

    ExpressionEngine.executeExpression = function executeExpression(code, component) {
        var fn = cache[code];
        if (!fn) {
            fn = cache[code] = ExpressionEngine.getExpressionFn(code);
        }
        return ExpressionEngine.runExpressionFn(fn, component);
    };

    /**
     * i.e.
     * object[field] = value
     * object.field = value
     * object['field'] = value
     */


    ExpressionEngine.setValueToContext = function setValueToContext(component, expression, value) {
        var fn = cache[expression];
        try {
            if (!fn) {
                var exprTokens = expression.split(/(\..[_$a-zA-Z0-9]+)|(\[.+])/).filter(function (it) {
                    return !!it;
                });
                var lastToken = exprTokens.pop();
                if (lastToken.indexOf('[') == 0) {
                    lastToken = lastToken.replace('[', '').replace(']', '');
                    lastToken = Lexer.convertExpression(lastToken, RF_API_STR + '.getVal(component,\'{expr}\')');
                    lastToken = '[' + lastToken + ']';
                } else if (!exprTokens.length) {
                    lastToken = '.' + lastToken;
                }
                expression = exprTokens.join('');
                expression = Lexer.convertExpression(expression, RF_API_STR + '.getVal(component,\'{expr}\')');
                expression = '' + expression + lastToken + '=value';
                cache[expression] = fn = new Function('component', '' + RF_API_STR, 'value', expression);
            }
            fn(component, RF_API, value);
        } catch (e) {
            console.error('setting value error');
            console.error('current component', component);
            console.error('can not evaluate expression:' + expression);
            console.error(' at compiled fn:', fn);
            console.error('desired value to set', value);
            throw e;
        }
    };
    /**
     *  "{a:1}"
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// [3].indexOf(dataStorage.receiver.actionType)>-1
var Token = function Token(type, val) {
    _classCallCheck(this, Token);

    this.tokenType = type;
    this.tokenValue = val;
};

Token.SYMBOL = {
    L_PAR: '(',
    R_PAR: ')',
    L_CURLY: '{',
    R_CURLY: '}',
    L_SQUARE: '[',
    R_SQUARE: ']',
    COMMA: ',',
    PLUS: '+',
    MULTIPLY: '*',
    MINUS: '-',
    DIVIDE: '/',
    GT: '>',
    LT: '<',
    EQUAL: '=',
    QUESTION: '?',
    COLON: ':',
    AMPERSAND: '&',
    OR: '|',
    EXCLAMATION: '!',
    SEMICOLON: ';'
};

Token.KEY_WORDS = ['in', 'of', 'null', 'undefined'];

Token.ALL_SPECIAL_SYMBOLS = Object.keys(Token.SYMBOL).map(function (key) {
    return Token.SYMBOL[key];
});

Token.TYPE = {
    OPERATOR: 'OPERATOR',
    DIGIT: 'DIGIT',
    VARIABLE: 'VARIABLE',
    STRING: 'STRING',
    OBJECT_KEY: 'OBJECT_KEY',
    FUNCTION: 'FUNCTION',
    BOOLEAN: 'BOOLEAN',
    KEY_WORD: 'KEY_WORD'
};

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function charInArr(char, arr) {
    return char && arr.indexOf(char) > -1;
}

var Lexer = function () {
    function Lexer() {
        _classCallCheck(this, Lexer);
    }

    Lexer.tokenize = function tokenize(expression) {
        var isEndWithSemicolon = expression[expression.length - 1] == Token.SYMBOL.SEMICOLON;
        var tokens = [],
            t = void 0,
            lastChar = '';
        expression = expression.trim();
        if (!isEndWithSemicolon) expression = expression + Token.SYMBOL.SEMICOLON;

        var isStringCurrent = void 0;
        expression.split('').forEach(function (char, i) {

            var lastToken = tokens[tokens.length - 1];
            if (lastToken && charInArr(lastToken.tokenValue, ['true', 'false'])) lastToken.tokenType = Token.TYPE.BOOLEAN;

            if (charInArr(char, ['"', "'"])) isStringCurrent = false;

            if (charInArr(char, Token.ALL_SPECIAL_SYMBOLS) && !isStringCurrent) {
                t = new Token(Token.TYPE.OPERATOR, char);
                tokens.push(t);

                lastChar = char;
                if (!lastToken) return;
                if (char == Token.SYMBOL.L_PAR && !charInArr(lastToken.tokenValue, Token.ALL_SPECIAL_SYMBOLS)) lastToken.tokenType = Token.TYPE.FUNCTION;
            } else {
                if (lastToken && lastToken.tokenType != Token.TYPE.STRING && char == ' ') return;
                if (lastToken && (lastToken.tokenType == Token.TYPE.DIGIT || lastToken.tokenType == Token.TYPE.VARIABLE || lastToken.tokenType == Token.TYPE.STRING)) {
                    lastToken.tokenValue += char;
                } else {
                    var type = void 0;
                    if (isNumber(char)) type = Token.TYPE.DIGIT;else if (charInArr(char, ['"', "'"])) {
                        type = Token.TYPE.STRING;
                        isStringCurrent = true;
                    } else type = Token.TYPE.VARIABLE;
                    t = new Token(type, char);
                    tokens.push(t);
                }
                lastChar = char;
            }
        });

        tokens.forEach(function (t, i) {
            t.tokenValue && (t.tokenValue = t.tokenValue.trim());
            if (charInArr(t.tokenValue, Token.KEY_WORDS)) t.tokenType = Token.KEY_WORDS;

            if (t && t.tokenType == Token.TYPE.VARIABLE) {
                var next = tokens[i + 1];
                var prev = tokens[i - 1];

                if (next && next.tokenValue == Token.SYMBOL.COLON && (!prev || prev && prev.tokenValue !== '?')) t.tokenType = Token.TYPE.OBJECT_KEY;

                if (t.tokenValue && t.tokenValue.startsWith('.')) t.tokenType = Token.TYPE.STRING; // resolve expression error at app.task.taskCases[0].text
            }

            if (t && t.tokenType == Token.TYPE.FUNCTION && t.tokenValue.indexOf('.') == 0) {
                t.tokenType = Token.TYPE.OBJECT_KEY; // resolve expression [1,2,3].indexOf(2)
            }
        });
        if (!isEndWithSemicolon) tokens.pop();
        //console.log(JSON.stringify(tokens));
        return tokens;
    };

    Lexer.convertExpression = function convertExpression(expression) {
        var variableReplacerStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '{expr}';

        if (!expression) return variableReplacerStr.replace('{expr}', '');
        var out = '';
        expression = expression.split('\n').join('');
        Lexer.tokenize(expression).forEach(function (token, index) {
            if (token.tokenValue == Token.SYMBOL.EQUAL && token[index + 1] && token[index + 1].tokenValue != Token.SYMBOL.EQUAL) throw 'assign (like "a=b") not supported at directives for now, change your expression: ' + expression;
            if ([Token.TYPE.VARIABLE, Token.TYPE.FUNCTION].indexOf(token.tokenType) > -1) {
                out += variableReplacerStr.replace('{expr}', token.tokenValue);
            } else out += token.tokenValue || token.tokenType;
        });
        return out;
    };

    return Lexer;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HashRouterStrategy = function () {
    function HashRouterStrategy() {
        _classCallCheck(this, HashRouterStrategy);
    }

    // todo complete

    HashRouterStrategy.navigateTo = function navigateTo(route, params) {
        location.hash = route;
    };

    HashRouterStrategy.goBack = function goBack() {
        if (window.history) history.back();
    };

    HashRouterStrategy._check = function _check(hash) {
        var isMatch = false;
        hash = hash.substr(1);
        Object.keys(Router._pages).some(function (key) {

            var routeParams = {};
            var keys = key.match(/:([^\/]+)/g);
            var match = hash.match(new RegExp(key.replace(/:([^\/]+)/g, "([^\/]*)")));
            if (match) {
                match.shift();
                match.forEach(function (value, i) {
                    routeParams[keys[i].replace(":", "")] = value;
                });
                isMatch = true;
                __showPage(key, routeParams);
                return true;
            }
        });
        if (!isMatch) throw "page with path " + hash + " not registered, set up router correctly";
    };

    HashRouterStrategy.setup = function setup() {
        location.hash && HashRouterStrategy._check(location.hash);
        DomUtils.addEventListener(window, 'hashchange', function () {
            HashRouterStrategy._check(location.hash);
        });
    };

    return HashRouterStrategy;
}();

var ManualRouterStrategy = function () {
    function ManualRouterStrategy() {
        _classCallCheck(this, ManualRouterStrategy);
    }

    ManualRouterStrategy.navigateTo = function navigateTo(route, params) {
        if (!Router._pages[route]) throw route + " not registered, set up router correctly";
        __showPage(route, params);
        ManualRouterStrategy.history.push({ route: route, params: params });
    };

    ManualRouterStrategy.setup = function setup() {};

    ManualRouterStrategy.goBack = function goBack() {
        ManualRouterStrategy.history.pop();
        var state = ManualRouterStrategy.history[ManualRouterStrategy.history.length - 1];
        if (state) __showPage(state.route, state.params);
    };

    return ManualRouterStrategy;
}();

ManualRouterStrategy.history = [];

var RouterStrategyProvider = function () {
    function RouterStrategyProvider() {
        _classCallCheck(this, RouterStrategyProvider);
    }

    RouterStrategyProvider.getRouterStrategy = function getRouterStrategy(strategyName) {
        switch (strategyName) {
            case Router.STRATEGY.MANUAL:
                return ManualRouterStrategy;
            case Router.STRATEGY.HASH:
                return HashRouterStrategy;
            default:
                throw "cat not find strategy with strategyName " + strategyName;
        }
    };

    return RouterStrategyProvider;
}();

var routeNode = null;
var lastPageItem = void 0;
var __showPage = function __showPage(pageName, params) {
    if (lastPageItem) {
        lastPageItem.component.setShown(false);
        DomUtils.nodeListToArray(routeNode.childNodes).forEach(function (el) {
            lastPageItem.component.node.appendChild(el);
        });
        lastPageItem.component.setMounted(false);
    }
    lastPageItem = Router._pages[pageName];
    if (!lastPageItem) throw "no page with name " + pageName + " registered";
    if (!lastPageItem.component) {
        var componentNode = lastPageItem.componentProto.node.cloneNode(true);
        lastPageItem.component = lastPageItem.componentProto.newInstance(componentNode, {});
        lastPageItem.component.run();
        delete lastPageItem.componentProto;
    }
    DomUtils.nodeListToArray(lastPageItem.component.node.childNodes).forEach(function (el) {
        routeNode.appendChild(el);
    });
    lastPageItem.component.setMounted(true, params);
    lastPageItem.component.setShown(true, params);
    Component.digestAll();
};

var Router = function () {
    function Router() {
        _classCallCheck(this, Router);
    }

    Router.setup = function setup(keyValues) {
        var strategyName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Router.STRATEGY.MANUAL;

        Router._strategy = RouterStrategyProvider.getRouterStrategy(strategyName);
        var routePlaceholderNode = document.querySelector('[data-route]');
        if (!routePlaceholderNode) throw 'can not run Route: element with data-route attribute not found';
        routePlaceholderNode.innerHTML = '';
        routeNode = routePlaceholderNode;
        Object.keys(keyValues).forEach(function (key) {
            Router._pages[key] = {
                componentProto: keyValues[key],
                component: null
            };
        });
        Router._strategy.setup();
    };

    Router.navigateTo = function navigateTo(pageName, params) {
        Router._strategy.navigateTo(pageName, params);
    };

    Router.goBack = function goBack() {
        Router._strategy.goBack();
    };

    return Router;
}();

Router._pages = {};
Router._strategy = null;

Router.STRATEGY = {
    MANUAL: 0,
    HASH: 1
};
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Core = function () {
    function Core() {
        _classCallCheck(this, Core);
    }

    Core.registerComponent = function registerComponent(name) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var nameOriginal = name;
        name = MiscUtils.camelToSnake(name);
        if (ComponentProto.getByName(name)) throw 'component with name ' + nameOriginal + ' already registered';
        var tmpl = TemplateLoader.getNode(properties, name);
        var domTemplate = tmpl.innerHTML;
        tmpl.remove();
        var node = document.createElement('div');
        node.innerHTML = domTemplate;

        var componentProto = new ComponentProto(name, node, properties);
        ComponentProto.instances.push(componentProto);
        return componentProto;
    };

    Core.applyBindings = function applyBindings(domElementSelector) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!domElementSelector) throw 'can not applyBindings: element selector not provided';
        if (typeof domElementSelector != 'string') throw 'element selector parameter mast me a string,\n            but ' + (typeof domElementSelector === 'undefined' ? 'undefined' : _typeof(domElementSelector)) + ' found}';
        var domElement = document.querySelector(domElementSelector);
        if (!domElement) throw 'can not apply bindings: root element with selector ' + domElementSelector + ' not defined';
        var modelView = new ModelView(null, properties);
        var fragment = new ScopedDomFragment(domElement, modelView);
        fragment.run();
        fragment.setMounted(true);
        fragment.setShown(true);
        modelView.component = fragment;
        return fragment;
    };

    Core.digest = function digest() {
        Component.digestAll();
    };

    Core.getComponentById = function getComponentById(id) {
        var cmp = Component.getComponentByDomId(id);
        if (!cmp) return null;
        return cmp.modelView;
    };

    Core.getComponents = function getComponents() {
        return Component.instances.map(function (c) {
            return c.modelView;
        });
    };

    Core._getComponentByInternalId = function _getComponentByInternalId(id) {
        return Component.getComponentByInternalId(id);
    };

    return Core;
}();

Core.version = '0.7.17';

window.RF = Core;
window.RF.Router = Router;
}());
