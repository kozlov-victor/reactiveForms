!function() {
    "use strict";
    var Component, ComponentProto, ScopedDomFragment, ScopedLoopContainer, DomUtils, MiscUtils, cnt, TemplateLoader, DirectiveEngine, _getValByPath, getVal, external, ExpressionEngine, Token, Lexer, HashRouterStrategy, ManualRouterStrategy, RouterStrategyProvider, routeNode, __showPage, Router, Core, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, ElementPrototype = "undefined" != typeof HTMLElement ? HTMLElement.prototype : Element.prototype;
    if (!ElementPrototype.remove) ElementPrototype.remove = function() {
        this.parentNode && this.parentNode.removeChild(this);
    };
    if (!Object.keys) Object.keys = function(obj) {
        var i, keys = [];
        for (i in obj) if (obj.hasOwnProperty(i)) keys.push(i);
        return keys;
    };
    if (!Array.prototype.reduce) Array.prototype.reduce = function(callback) {
        if (null == this) throw new TypeError("Array.prototype.reduce called on null or undefined");
        if ("function" != typeof callback) throw new TypeError(callback + " is not a function");
        var value, t = Object(this), len = t.length >>> 0, k = 0;
        if (arguments.length >= 2) value = arguments[1]; else {
            for (;k < len && !(k in t); ) k++;
            if (k >= len) throw new TypeError("Reduce of empty array with no initial value");
            value = t[k++];
        }
        for (;k < len; k++) if (k in t) value = callback(value, t[k], k, t);
        return value;
    };
    // Production steps of ECMA-262, Edition 5, 15.4.4.17
    // Reference: http://es5.github.io/#x15.4.4.17
    if (!Array.prototype.some) Array.prototype.some = function(fun) {
        var t, len, thisArg, i;
        if (null == this) throw new TypeError("Array.prototype.some called on null or undefined");
        if ("function" != typeof fun) throw new TypeError();
        t = Object(this);
        len = t.length >>> 0;
        thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (i = 0; i < len; i++) if (i in t && fun.call(thisArg, t[i], i, t)) return true;
        return false;
    };
    if ("function" != typeof Array.prototype.forEach) Array.prototype.forEach = function(callback, thisArg) {
        if ("number" == typeof this.length) if ("function" == typeof callback) if ("object" == _typeof(this)) for (var i = 0; i < this.length; i++) if (i in this) callback.call(thisArg || this, this[i], i, this); else return;
    };
    [].filter || (Array.prototype.filter = // Use the native array filter method, if available.
    function(a, //a function to test each value of the array against. Truthy values will be put into the new array and falsy values will be excluded from the new array
    b, // placeholder
    c, // placeholder
    d, // placeholder
    e) {
        c = this;
        // cache the array
        d = [];
        // array to hold the new values which match the expression
        for (e in c) // for each value in the array,
        ~~e + "" == e && e >= 0 && // coerce the array position and if valid,
        a.call(b, c[e], +e, c) && // pass the current value into the expression and if truthy,
        d.push(c[e]);
        // add it to the new array
        return d;
    });
    if (!Array.prototype.map) Array.prototype.map = function(fn) {
        var i, l, rv = [];
        for (i = 0, l = this.length; i < l; i++) rv.push(fn(this[i]));
        return rv;
    };
    if (!Array.prototype.indexOf) Array.prototype.indexOf = function(elt) {
        var len = this.length >>> 0, from = Number(arguments[1]) || 0;
        from = from < 0 ? Math.ceil(from) : Math.floor(from);
        if (from < 0) from += len;
        for (;from < len; from++) if (from in this && this[from] === elt) return from;
        return -1;
    };
    if (!String.prototype.trim) String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    };
    if (!String.prototype.startsWith) String.prototype.startsWith = function(str) {
        return !this.indexOf(str);
    };
    if (!Object.create) Object.create = function(o, props) {
        function F() {}
        F.prototype = o;
        if ("object" === (void 0 === props ? "undefined" : _typeof(props))) for (var prop in props) if (props.hasOwnProperty(prop)) F[prop] = props[prop];
        return new F();
    };
    if (!window.Node) window.Node = {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3
    };
    !function(undef) {
        var // NPCG: nonparticipating capturing group
        self, nativeSplit = String.prototype.split, compliantExecNpcg = void 0 === /()??/.exec("")[1];
        self = function(str, separator, limit) {
            // If `separator` is not a regex, use `nativeSplit`
            if ("[object RegExp]" !== Object.prototype.toString.call(separator)) return nativeSplit.call(str, separator, limit);
            var separator2, match, lastIndex, lastLength, output = [], flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + (// Proposed for ES6
            separator.sticky ? "y" : ""), // Firefox 3+
            lastLastIndex = 0, // Make `global` and avoid `lastIndex` issues by working with a copy
            separator = new RegExp(separator.source, flags + "g");
            str += "";
            // Type-convert
            if (!compliantExecNpcg) // Doesn't need flags gy, but they don't hurt
            separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
            /* Values for `limit`, per the spec:
         * If undefined: 4294967295 // Math.pow(2, 32) - 1
         * If 0, Infinity, or NaN: 0
         * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
         * If negative number: 4294967296 - Math.floor(Math.abs(limit))
         * If other: Type-convert, then use the above rules
         */
            limit = void 0 === limit ? -1 >>> 0 : // Math.pow(2, 32) - 1
            limit >>> 0;
            // ToUint32(limit)
            for (;match = separator.exec(str); ) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(str.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) match[0].replace(separator2, function() {
                        for (var i = 1; i < arguments.length - 2; i++) if (void 0 === arguments[i]) match[i] = void 0;
                    });
                    if (match.length > 1 && match.index < str.length) Array.prototype.push.apply(output, match.slice(1));
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) break;
                }
                if (separator.lastIndex === match.index) separator.lastIndex++;
            }
            if (lastLastIndex === str.length) {
                if (lastLength || !separator.test("")) output.push("");
            } else output.push(str.slice(lastLastIndex));
            return output.length > limit ? output.slice(0, limit) : output;
        };
        // For convenience
        String.prototype.split = function(separator, limit) {
            return self(this, separator, limit);
        };
        self;
    }();
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    Component = function() {
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
            this.node.setAttribute("data-component-id", this.id);
            DomUtils.nodeListToArray(this.node.querySelectorAll("*")).forEach(function(el) {
                el.setAttribute("data-component-id", _this.id);
            });
            Component.instances.push(this);
        }
        Component.prototype.addChild = function(childComponent) {
            if (!this.children) this.children = [];
            this.children.push(childComponent);
        };
        Component.prototype.updateModelView = function(modelView) {
            // todo remove
            //MiscUtils.superficialCopy(this.modelView,modelView);
            this.modelView = modelView;
            if (this.children) this.children.forEach(function(c) {});
        };
        Component.prototype.onShow = function() {};
        // todo move to modelview class
        Component.prototype.addWatcher = function(expression, listenerFn) {
            var watcherFn = ExpressionEngine.getExpressionFn(expression);
            this.watchers.push({
                expression: expression,
                watcherFn: watcherFn,
                listenerFn: listenerFn
            });
            listenerFn(ExpressionEngine.runExpressionFn(watcherFn, this));
        };
        Component.prototype.digest = function() {
            var _this2 = this;
            this.watchers.forEach(function(watcher) {
                var oldValue, newValue = ExpressionEngine.runExpressionFn(watcher.watcherFn, _this2);
                if ("object" == (void 0 === newValue ? "undefined" : _typeof(newValue))) newValue = MiscUtils.deepCopy(newValue);
                oldValue = watcher.last;
                if (!MiscUtils.deepEqual(newValue, oldValue)) watcher.listenerFn(newValue, oldValue);
                watcher.last = newValue;
            });
        };
        Component.prototype.run = function() {
            new DirectiveEngine(this).run();
        };
        Component.prototype.destroy = function() {
            // todo not implemented yet!
            // remove watchers
            // remove nodes
            this.node.remove();
            if (this.children) this.children.forEach(function(c) {
                c.destroy();
            });
        };
        Component.digestAll = function() {
            Component.instances.forEach(function(cmp) {
                cmp.digest();
            });
        };
        Component.getComponentById = function(id) {
            var res = null;
            Component.instances.some(function(cmp) {
                if (cmp.id == id) {
                    res = cmp;
                    return true;
                }
            });
            return res;
        };
        return Component;
    }();
    Component.instances = [];
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    ComponentProto = function() {
        function ComponentProto(name, node, modelView) {
            _classCallCheck(this, ComponentProto);
            this.name = name;
            this.node = node;
            this.modelView = modelView;
        }
        ComponentProto.prototype.applyProperties = function(componentName, target) {
            var properties = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, opts = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, strict = opts.strict;
            Object.keys(properties).forEach(function(key) {
                if (strict && !target.hasOwnProperty(key)) throw "can not apply non declared property " + key + " to component " + componentName;
                target[key] = properties[key];
            });
        };
        ComponentProto.prototype.newInstance = function(node, properties) {
            var externalProperties = this.modelView.external, modelView = MiscUtils.deepCopy(this.modelView);
            delete modelView.external;
            externalProperties && this.applyProperties(this.name, modelView, externalProperties);
            this.applyProperties(this.name, modelView, properties, {
                strict: true
            });
            return new Component(this.name, node, modelView);
        };
        ComponentProto.getByName = function(name) {
            return ComponentProto.instances.filter(function(it) {
                return it.name == name;
            })[0] || null;
        };
        return ComponentProto;
    }();
    ComponentProto.instances = [];
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _possibleConstructorReturn(self, call) {
        if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return call && ("object" == typeof call || "function" == typeof call) ? call : self;
    }
    function _inherits(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    /**
 * безымянный компонент, образованый методом applyBindings
 * либо при итерации
 */
    ScopedDomFragment = function(_Component) {
        _inherits(ScopedDomFragment, _Component);
        function ScopedDomFragment(node, modelView) {
            _classCallCheck(this, ScopedDomFragment);
            return _possibleConstructorReturn(this, _Component.call(this, null, node, modelView));
        }
        return ScopedDomFragment;
    }(Component);
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    function _possibleConstructorReturn(self, call) {
        if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return call && ("object" == typeof call || "function" == typeof call) ? call : self;
    }
    function _inherits(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    ScopedLoopContainer = function(_Component) {
        _inherits(ScopedLoopContainer, _Component);
        function ScopedLoopContainer(node, modelView) {
            _classCallCheck(this, ScopedLoopContainer);
            var _this = _possibleConstructorReturn(this, _Component.call(this, null, node, modelView));
            if (node.getAttribute("data-for")) throw "can not use data-for attribute at component directly. Use this directive at parent node";
            _this.scopedDomFragments = [];
            _this.lastFrafmentsLength = 0;
            _this.node = node;
            _this.parent = null;
            return _this;
        }
        ScopedLoopContainer.prototype._destroyFragment = function(index) {
            this.scopedDomFragments.splice(index, 1)[0].destroy();
            this.lastFrafmentsLength--;
        };
        ScopedLoopContainer.prototype.run = function(eachItemName, indexName, iterableObjectName) {
            var _this2 = this;
            this.eachItemName = eachItemName;
            this.indexName = indexName;
            this.anchor = document.createComment("component-id: " + this.id + "; loop: " + eachItemName + " in " + iterableObjectName);
            this.node.parentNode.insertBefore(this.anchor, this.node.nextSibling);
            this.node.remove();
            this.node = this.node.cloneNode(true);
            this.addWatcher(iterableObjectName, function(newArr, oldArr) {
                _this2._processIterations(newArr, oldArr);
            });
        };
        ScopedLoopContainer.prototype._processIterations = function() {
            var l, i, max, _this3 = this, newArr = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], currNodeInIteration = (arguments[1], 
            this.anchor);
            newArr.forEach(function(iterableItem, i) {
                var localModelView, node, scopedDomFragment, _localModelView;
                if (!_this3.scopedDomFragments[i]) {
                    localModelView = {};
                    localModelView[_this3.eachItemName] = iterableItem;
                    if (_this3.indexName) localModelView[_this3.indexName] = i;
                    node = _this3.node.cloneNode(true);
                    scopedDomFragment = new ScopedDomFragment(node, localModelView);
                    currNodeInIteration.parentNode.insertBefore(node, currNodeInIteration.nextSibling);
                    scopedDomFragment.parent = _this3.parent;
                    scopedDomFragment.parent.addChild(scopedDomFragment);
                    scopedDomFragment.run();
                    currNodeInIteration = node;
                    _this3.scopedDomFragments.push(scopedDomFragment);
                    _this3.lastFrafmentsLength++;
                } else {
                    _localModelView = _this3.scopedDomFragments[i].modelView;
                    _localModelView[_this3.eachItemName] = iterableItem;
                    if (_this3.indexName) _localModelView[_this3.indexName] = i;
                    //this.scopedDomFragments[i].updateModelView(localModelView);
                    currNodeInIteration = _this3.scopedDomFragments[i].node;
                    _this3.scopedDomFragments[i].digest();
                }
            });
            if (this.lastFrafmentsLength > newArr.length) {
                l = this.scopedDomFragments.length;
                for (i = 0, max = this.lastFrafmentsLength - newArr.length; i < max; i++) this._destroyFragment(l - i - 1);
            }
        };
        return ScopedLoopContainer;
    }(Component);
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    DomUtils = function() {
        function DomUtils() {
            _classCallCheck(this, DomUtils);
        }
        /**
     * обработка текстовых узлов с выражением типа {{expression}}
     * @param root
     * @returns {Array}
     */
        DomUtils.processScopedTextNodes = function(root) {
            var textNodes = function(root) {
                var textNodes = [];
                addTextNodes(root);
                Array.prototype.forEach.call(root.querySelectorAll("*"), addTextNodes);
                return textNodes;
                function addTextNodes(el) {
                    textNodes = textNodes.concat(Array.prototype.filter.call(el.childNodes, function(k) {
                        return k.nodeType == Node.TEXT_NODE;
                    }));
                }
            }(root), result = [];
            textNodes.forEach(function(textNode) {
                var scopedNode = document.createDocumentFragment(), hasExpressions = false;
                (textNode.textContent || textNode.innerText || textNode.data).split(/(\{\{.*?}})/).forEach(function(item) {
                    var exp, newNode = void 0;
                    if (0 == item.indexOf("{{")) {
                        newNode = document.createTextNode("");
                        exp = item.split("{{").join("").split("}}").join("");
                        if (!exp) return;
                        hasExpressions = true;
                        result.push({
                            node: newNode,
                            expression: exp
                        });
                    } else newNode = document.createTextNode(item);
                    scopedNode.appendChild(newNode);
                });
                hasExpressions && textNode.parentNode.replaceChild(scopedNode, textNode);
            });
            return result;
        };
        DomUtils.setInputValue = function(el, value) {
            var type;
            switch (el.tagName.toLowerCase()) {
              case "input":
                type = el.getAttribute("type");
                switch (type) {
                  case "checkbox":
                    el.checked = !!value;
                    break;

                  case "radio":
                    el.checked = value == el.value;
                    break;

                  default:
                    el.value = value;
                }
                break;

              case "select":
                el.value = value;
                break;

              case "textarea":
                el.value = value;
            }
        };
        DomUtils.getInputValue = function(el) {
            var type, checkedEls, checkedEl, i;
            switch (el.tagName.toLowerCase()) {
              case "input":
                type = el.getAttribute("type");
                switch (type) {
                  case "checkbox":
                    return el.checked;

                  case "radio":
                    checkedEls = document.querySelectorAll('[type=radio][_data-model="' + el.getAttribute("_data-model") + '"]');
                    checkedEl = null;
                    for (i = 0; i < checkedEls.length; i++) if (checkedEls[i].checked) {
                        checkedEl = checkedEls[i];
                        break;
                    }
                    if (checkedEl) return checkedEl.value; else return "";

                  default:
                    return el.value;
                }
                break;

              case "select":
                return el.value;

              case "textarea":
                return el.value;
            }
        };
        DomUtils.getDefaultInputChangeEvents = function(el) {
            var type;
            switch (el.tagName.toLowerCase()) {
              case "input":
                type = el.getAttribute("type");
                switch (type) {
                  case "checkbox":
                    return "click";

                  case "radio":
                    return "click";

                  case "range":
                  case "number":
                    return "input,change";

                  default:
                    return "keyup,change";
                }
                break;

              case "select":
                return "change";

              case "textarea":
                return "keyup";

              default:
                return "change";
            }
        };
        DomUtils.addEventListener = function(el, type, fn) {
            if (el.addEventListener) el.addEventListener(type, fn); else el.attachEvent("on" + type, fn);
        };
        DomUtils.setTextNodeValue = function(el, value) {
            if ("textContent" in el) el.textContent = value; else el.nodeValue = value;
        };
        DomUtils.toggleClass = function(el, className, isAdd) {
            if (!el.classList) if (isAdd) {
                if (el.className.indexOf(className) == -1) el.className += " " + className;
            } else el.className = el.className.split(className).join(" "); else el.classList.toggle(className, isAdd);
        };
        DomUtils.nodeListToArray = function(nodeList) {
            var i, arr = [];
            for (i = 0; i < nodeList.length; i++) arr.push(nodeList[i]);
            return arr;
        };
        DomUtils.removeParentButNotChildren = function(nodeToBeRemoved) {
            for (;nodeToBeRemoved.firstChild; ) nodeToBeRemoved.parentNode.insertBefore(nodeToBeRemoved.firstChild, nodeToBeRemoved);
            nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
        };
        DomUtils.getClosestElWithDataAttr = function(node, dataAttr) {
            for (;node; ) {
                if (node === document) return;
                if (node.hasAttribute(dataAttr)) return node;
                node = node.parentNode;
            }
        };
        return DomUtils;
    }();
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    MiscUtils = function() {
        function MiscUtils() {
            _classCallCheck(this, MiscUtils);
        }
        /**
     * @param obj
     * @returns {*}
     */
        MiscUtils.deepCopy = function(obj) {
            var out, i, len, _out, _i;
            if (void 0 !== obj) {
                if (null === obj) return null;
                if ("[object Array]" === Object.prototype.toString.call(obj)) {
                    out = [], i = 0, len = obj.length;
                    for (;i < len; i++) out[i] = MiscUtils.deepCopy(obj[i]);
                    return out;
                }
                if ("object" === (void 0 === obj ? "undefined" : _typeof(obj))) {
                    _out = {};
                    for (_i in obj) _out[_i] = MiscUtils.deepCopy(obj[_i]);
                    return _out;
                }
                return obj;
            }
        };
        MiscUtils.superficialCopy = function(a, b) {
            if (a && b) Object.keys(b).forEach(function(key) {
                a[key] = b[key];
            });
        };
        /**
     * @param x
     * @param y
     * @returns {*}
     */
        MiscUtils.deepEqual = function(x, y) {
            //if (isNaN(x) && isNaN(y)) return true;
            return x && y && "object" === (void 0 === x ? "undefined" : _typeof(x)) && "object" === (void 0 === y ? "undefined" : _typeof(y)) ? Object.keys(x).length === Object.keys(y).length && Object.keys(x).reduce(function(isEqual, key) {
                return isEqual && MiscUtils.deepEqual(x[key], y[key]);
            }, true) : x === y;
        };
        MiscUtils.camelToSnake = function(str) {
            return str.replace(/([A-Z])/g, function($1) {
                return "-" + $1.toLowerCase();
            });
        };
        MiscUtils.getUID = function() {
            return cnt++;
        };
        return MiscUtils;
    }();
    cnt = 0;
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    TemplateLoader = function() {
        function TemplateLoader() {
            _classCallCheck(this, TemplateLoader);
        }
        TemplateLoader._getNodeFromDom = function(templateObj) {
            if (!templateObj.value) throw "template.value must be specified";
            var node = document.getElementById(templateObj.value);
            if (!node) throw "can not fing dom element with id " + templateObj.value;
            return node;
        };
        TemplateLoader._getNodeFromString = function(templateObj) {
            if (!templateObj.value) throw "template string not provided";
            if ("string" != typeof templateObj.value) throw "template.value mast be a String, but " + _typeof(templateObj.value) + " found";
            var container = document.createElement("div");
            container.innerHTML = templateObj.value;
            return container;
        };
        TemplateLoader.getNode = function(templateObj) {
            if (!templateObj) throw "template object not defined. Provide template at your component";
            switch (templateObj.type) {
              case "dom":
                return TemplateLoader._getNodeFromDom(templateObj);

              case "string":
                return TemplateLoader._getNodeFromString(templateObj);

              default:
                throw "can not load template with type " + templateObj.type + ', only "dom" and "string" types is supported';
            }
        };
        return TemplateLoader;
    }();
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    DirectiveEngine = function() {
        function DirectiveEngine(component) {
            _classCallCheck(this, DirectiveEngine);
            this.component = component;
        }
        DirectiveEngine.prototype._eachElementWithAttr = function(dataAttrName, onEachElementFn) {
            var i, elements = [], nodes = this.component.node.querySelectorAll("[" + dataAttrName + "]");
            for (i = 0; i < nodes.length; i++) elements.push(nodes[i]);
            if (this.component.node.hasAttribute(dataAttrName)) elements.push(this.component.node);
            elements.forEach(function(el) {
                var expression = el.getAttribute(dataAttrName);
                el.removeAttribute(dataAttrName);
                el.setAttribute("_" + dataAttrName, expression);
                onEachElementFn(el, expression);
            });
        };
        DirectiveEngine.prototype.runDirective_For = function() {
            var _this = this;
            this._eachElementWithAttr("data-for", function(el, expression) {
                var variables, eachItemName, indexName, iterableObjectName, scopedLoopContainer, tokens = expression.split(" ");
                if ([ "in", "of" ].indexOf(tokens[1]) == -1) throw "can not parse expression " + expression;
                variables = Lexer.tokenize(tokens[0]).filter(function(t) {
                    return [ Token.TYPE.VARIABLE, Token.TYPE.OBJECT_KEY ].indexOf(t.tokenType) > -1;
                }).map(function(t) {
                    return t.tokenValue;
                });
                if (!variables.length) throw "can not parse expression " + expression;
                eachItemName = variables[0];
                indexName = variables[1];
                iterableObjectName = tokens[2];
                scopedLoopContainer = new ScopedLoopContainer(el, _this.component.modelView);
                scopedLoopContainer.parent = _this.component;
                scopedLoopContainer.run(eachItemName, indexName, iterableObjectName);
            });
        };
        DirectiveEngine.prototype.runTextNodes = function() {
            var _this2 = this;
            DomUtils.processScopedTextNodes(this.component.node).forEach(function(it) {
                _this2.component.addWatcher(it.expression, function(value) {
                    if ("object" == (void 0 === value ? "undefined" : _typeof(value))) value = JSON.stringify(value);
                    DomUtils.setTextNodeValue(it.node, value);
                });
            });
        };
        DirectiveEngine.prototype.runDomEvent = function(eventName) {
            var _this3 = this;
            this._eachElementWithAttr("data-" + eventName, function(el, expression) {
                var fn = ExpressionEngine.getExpressionFn(expression);
                DomUtils.addEventListener(el, eventName, function(e) {
                    var shouldPreventDefault = [ "keypress", "keydown" ].indexOf(eventName) == -1;
                    if (shouldPreventDefault) {
                        e = e || window.e;
                        e.preventDefault && e.preventDefault();
                        e.stopPropagation && e.stopPropagation();
                        e.cancelBubble = true;
                    }
                    ExpressionEngine.runExpressionFn(fn, _this3.component);
                    Component.digestAll();
                    if (shouldPreventDefault) return false;
                });
            });
        };
        DirectiveEngine.prototype.runDirective_Bind = function() {
            var _this4 = this;
            this._eachElementWithAttr("data-bind", function(el, expression) {
                var fn = ExpressionEngine.getExpressionFn(expression);
                ExpressionEngine.runExpressionFn(fn, _this4.component);
                _this4.component.addWatcher(expression, function(value) {
                    DomUtils.setTextNodeValue(el, value);
                });
            });
        };
        DirectiveEngine.prototype.runDirective_Value = function() {};
        DirectiveEngine.prototype._runDirective_Model_OfSelect = function(selectEl, modelExpression) {
            var component, val, selectedEl = DomUtils.nodeListToArray(selectEl.querySelectorAll("option")).filter(function(opt) {
                return opt.selected;
            })[0];
            if (selectedEl) {
                component = void 0, val = void 0;
                component = Component.getComponentById(selectedEl.getAttribute("data-component-id"));
                if (component) val = ExpressionEngine.executeExpression(selectedEl.getAttribute("data-value"), component);
                if (!val) val = selectedEl.getAttribute("value");
                ExpressionEngine.setValueToContext(this.component.modelView, modelExpression, val);
            }
        };
        DirectiveEngine.prototype.runDirective_Model = function() {
            var _this5 = this;
            this._eachElementWithAttr("data-model", function(el, expression) {
                if ("radio" == el.getAttribute("type") && !el.getAttribute("name")) el.setAttribute("name", expression);
                DomUtils.getDefaultInputChangeEvents(el).split(",").forEach(function(eventName) {
                    if ("select" == el.tagName.toLowerCase()) DomUtils.addEventListener(el, eventName, function() {
                        _this5._runDirective_Model_OfSelect(el, expression);
                        Component.digestAll();
                    }); else DomUtils.addEventListener(el, eventName, function() {
                        ExpressionEngine.setValueToContext(_this5.component.modelView, expression, DomUtils.getInputValue(el));
                        Component.digestAll();
                    });
                });
                _this5.component.addWatcher(expression, function(value) {
                    if ("select" == el.tagName.toLowerCase()) {
                        if (!DomUtils.nodeListToArray(el.querySelectorAll("option")).some(function(opt) {
                            var componentId = opt.getAttribute("data-component-id"), component = Component.getComponentById(componentId), modelItemExpression = opt.getAttribute("data-value"), modelItem = ExpressionEngine.executeExpression(modelItemExpression, component);
                            if (MiscUtils.deepEqual(modelItem, value)) return opt.selected = true;
                        })) el.value = value;
                    } else if (DomUtils.getInputValue(el) !== value) DomUtils.setInputValue(el, value);
                });
            });
        };
        DirectiveEngine.prototype.runDirective_Class = function() {
            var _this6 = this;
            this._eachElementWithAttr("data-class", function(el, expression) {
                _this6.component.addWatcher(expression, function(classNameOrObj) {
                    if ("object" === (void 0 === classNameOrObj ? "undefined" : _typeof(classNameOrObj))) {
                        for (var key in classNameOrObj) if (classNameOrObj.hasOwnProperty(key)) DomUtils.toggleClass(el, key, !!classNameOrObj[key]);
                    } else el.className = classNameOrObj;
                });
            });
        };
        DirectiveEngine.prototype.runDirective_Style = function() {
            var _this7 = this;
            this._eachElementWithAttr("data-style", function(el, expression) {
                _this7.component.addWatcher(expression, function(styleObject) {
                    for (var key in styleObject) if (styleObject.hasOwnProperty(key)) el.style[key] = styleObject[key] ? styleObject[key] : "";
                });
            });
        };
        DirectiveEngine.prototype.runDirective_Disabled = function() {
            var _this8 = this;
            this._eachElementWithAttr("data-disabled", function(el, expression) {
                _this8.component.addWatcher(expression, function(value) {
                    if (value) el.setAttribute("disabled", "disabled"); else el.removeAttribute("disabled");
                });
            });
        };
        DirectiveEngine.prototype.runDirective_If = function() {
            var _this9 = this;
            this._eachElementWithAttr("data-if", function(el, expression) {
                var comment = document.createComment("");
                el.parentNode.insertBefore(comment, el);
                _this9.component.addWatcher(expression, function(val) {
                    if (val) {
                        if (!el.parentElement) comment.parentNode.insertBefore(el, comment.nextSibling);
                    } else el.remove();
                });
            });
        };
        DirectiveEngine.prototype.runComponents = function() {
            var _this10 = this;
            ComponentProto.instances.forEach(function(componentProto) {
                var componentNodes, domEls = DomUtils.nodeListToArray(_this10.component.node.getElementsByTagName(componentProto.name));
                if (_this10.component.node.tagName.toLowerCase() == componentProto.name.toLowerCase()) {
                    console.error('\n                   Can not use "data-for" attribute at component directly. Use "data-for" directive at parent node');
                    console.error("component node:", _this10.component.node);
                    throw "Can not use data-for attribute at component";
                }
                componentNodes = [];
                domEls.forEach(function(it) {
                    var componentNode, dataPropertiesAttr, dataProperties, component;
                    if (!it.getAttribute("data-_processed")) {
                        it.setAttribute("data-_processed", "1");
                        componentNode = componentProto.node.cloneNode(true);
                        componentNodes.push(componentNode);
                        it.parentNode.insertBefore(componentNode, it);
                        dataPropertiesAttr = it.getAttribute("data-properties");
                        dataProperties = dataPropertiesAttr ? ExpressionEngine.executeExpression(dataPropertiesAttr, _this10.component) : {};
                        component = componentProto.newInstance(componentNode, dataProperties);
                        component.run();
                        component.parent = _this10.component;
                        component.parent.addChild(component);
                        component.disableParentScopeEvaluation = true;
                        // avoid recursion in Component
                        it.parentNode.removeChild(it);
                    }
                });
                componentNodes.forEach(function(node) {
                    DomUtils.removeParentButNotChildren(node);
                });
            });
        };
        DirectiveEngine.prototype.run = function() {
            var _this11 = this;
            this.runDirective_Value();
            this.runDirective_For();
            this.runComponents();
            this.runTextNodes();
            this.runDirective_Model();
            // todo check event sequence in legacy browsers
            [ "click", "blur", "focus", "submit", "change", "keypress", "keyup", "keydown" ].forEach(function(eventName) {
                _this11.runDomEvent(eventName);
            });
            this.runDirective_Bind();
            this.runDirective_Value();
            this.runDirective_Class();
            this.runDirective_Style();
            // todo this.runDirective_Show();
            // todo this.runDirective_Hide();
            this.runDirective_Disabled();
            this.runDirective_If();
        };
        return DirectiveEngine;
    }();
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    _getValByPath = function _getValByPath(component, path) {
        var keys = path.split("."), lastKey = keys.pop(), res = component.modelView;
        keys.forEach(function(key) {
            if (void 0 !== res) res = res[key];
        });
        if (void 0 !== res) res = res[lastKey];
        if (!component.disableParentScopeEvaluation && void 0 === res && component.parent) return _getValByPath(component.parent, path); else if (res && res.call) return function() {
            return res.apply(component.modelView, Array.prototype.slice.call(arguments));
        }; else return res;
    };
    getVal = function(component, path) {
        return _getValByPath(component, path);
    };
    external = {
        getVal: getVal
    };
    ExpressionEngine = function() {
        function ExpressionEngine() {
            _classCallCheck(this, ExpressionEngine);
        }
        ExpressionEngine.getExpressionFn = function(code) {
            var codeProcessed, fn;
            code = code.split("\n").join("").split("'").join('"');
            codeProcessed = "\n                return " + Lexer.convertExpression(code, "external.getVal(component,'{expr}')") + "\n        ";
            try {
                fn = new Function("component", "external", codeProcessed);
                fn.expression = code;
                fn.fnProcessed = fn.toString();
                //console.log(fn.fnProcessed);
                return fn;
            } catch (e) {
                console.error("can not compile function from expression");
                console.error("expression", code);
                console.error("compiled code", codeProcessed);
            }
        };
        ExpressionEngine.runExpressionFn = function(fn, component) {
            try {
                return fn.call(component.modelView, component, external);
            } catch (e) {
                console.error("getting value error");
                console.error("can not evaluate expression:" + fn.expression);
                console.error("     at compiled function:" + fn.fnProcessed);
                console.error("component", component);
                throw e;
            }
        };
        ExpressionEngine.executeExpression = function(code, component) {
            var fn = ExpressionEngine.getExpressionFn(code);
            return ExpressionEngine.runExpressionFn(fn, component);
        };
        /**
     * expression = 'user.name' object[field] = value
     */
        ExpressionEngine.setValueToContext = function(context, expression, value) {
            var fn, code = Lexer.convertExpression(expression, "context.{expr}") + "=value";
            try {
                fn = new Function("context", "value", code);
                fn(context, value);
            } catch (e) {
                console.error("setting value error");
                console.error("can not evaluate expression:" + expression);
                console.error("     at compiled function", code);
                console.error("current context", context);
                console.error("desired value to set", value);
                throw e;
            }
        };
        /**
     *  "{a:1}"
     * @param code
     * @returns {*}
     */
        ExpressionEngine.getObjectFromString = function(code) {
            try {
                return new Function("return (" + code + ")")();
            } catch (e) {
                console.error("can not parse properties: " + code);
                throw e;
            }
        };
        return ExpressionEngine;
    }();
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    Token = function Token(type, val) {
        _classCallCheck(this, Token);
        this.tokenType = type;
        this.tokenValue = val;
    };
    Token.SYMBOL = {
        L_PAR: "(",
        R_PAR: ")",
        L_CURLY: "{",
        R_CURLY: "}",
        L_SQUARE: "[",
        R_SQUARE: "]",
        COMMA: ",",
        PLUS: "+",
        MULTIPLY: "*",
        MINUS: "-",
        DIVIDE: "/",
        GT: ">",
        LT: "<",
        EQUAL: "=",
        QUESTION: "?",
        COLON: ":",
        AMPERSAND: "&",
        OR: "|",
        EXCLAMATION: "!",
        SEMICOLON: ";"
    };
    Token.KEY_WORDS = [ "in", "of", "null", "undefined" ];
    Token.ALL_SPECIAL_SYMBOLS = Object.keys(Token.SYMBOL).map(function(key) {
        return Token.SYMBOL[key];
    });
    Token.TYPE = {
        SPECIAL_SYMBOL: "SPECIAL_SYMBOL",
        DIGIT: "DIGIT",
        VARIABLE: "VARIABLE",
        STRING: "STRING",
        OBJECT_KEY: "OBJECT_KEY",
        FUNCTION: "FUNCTION",
        BOOLEAN: "BOOLEAN",
        KEY_WORD: "KEY_WORD"
    };
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function charInArr(char, arr) {
        return char && arr.indexOf(char) > -1;
    }
    Lexer = function() {
        function Lexer() {
            _classCallCheck(this, Lexer);
        }
        Lexer.tokenize = function(expression) {
            var isEndWithSemicolon = expression[expression.length - 1] == Token.SYMBOL.SEMICOLON, tokens = [], t = void 0, lastChar = "";
            expression = expression.trim();
            if (!isEndWithSemicolon) expression += Token.SYMBOL.SEMICOLON;
            expression.split("").forEach(function(char, i) {
                var type, lastToken = tokens[tokens.length - 1];
                if (lastToken && charInArr(lastToken.tokenValue, [ "true", "false" ])) lastToken.tokenType = Token.TYPE.BOOLEAN;
                if (charInArr(char, Token.ALL_SPECIAL_SYMBOLS)) {
                    t = new Token(Token.TYPE.SPECIAL_SYMBOL, char);
                    tokens.push(t);
                    lastChar = char;
                    if (!lastToken) return;
                    if (char == Token.SYMBOL.L_PAR) lastToken.tokenType = Token.TYPE.FUNCTION;
                } else {
                    if (lastToken && lastToken.tokenType != Token.TYPE.STRING && " " == char) return;
                    if (lastToken && (lastToken.tokenType == Token.TYPE.DIGIT || lastToken.tokenType == Token.TYPE.VARIABLE || lastToken.tokenType == Token.TYPE.STRING)) lastToken.tokenValue += char; else {
                        type = void 0;
                        if (isNumber(char)) type = Token.TYPE.DIGIT; else if (charInArr(char, [ '"', "'" ])) type = Token.TYPE.STRING; else type = Token.TYPE.VARIABLE;
                        t = new Token(type, char);
                        tokens.push(t);
                    }
                    lastChar = char;
                }
            });
            tokens.forEach(function(t, i) {
                t.tokenValue && (t.tokenValue = t.tokenValue.trim());
                if (charInArr(t.tokenValue, Token.KEY_WORDS)) t.tokenType = Token.KEY_WORDS;
                if (t && t.tokenType == Token.TYPE.VARIABLE) {
                    var next = tokens[i + 1];
                    if (next && next.tokenValue == Token.SYMBOL.COLON) t.tokenType = Token.TYPE.OBJECT_KEY;
                    if (t.tokenValue && t.tokenValue.startsWith(".")) t.tokenType = Token.TYPE.STRING;
                }
            });
            if (!isEndWithSemicolon) tokens.pop();
            //console.log(JSON.stringify(tokens));
            return tokens;
        };
        Lexer.convertExpression = function(expression) {
            var variableReplacerStr = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "{expr}", out = "";
            expression = expression.split("\n").join("");
            Lexer.tokenize(expression).forEach(function(token) {
                if ([ Token.TYPE.VARIABLE, Token.TYPE.FUNCTION ].indexOf(token.tokenType) > -1) out += variableReplacerStr.replace("{expr}", token.tokenValue); else out += token.tokenValue || token.tokenType;
            });
            return out;
        };
        return Lexer;
    }();
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    HashRouterStrategy = function() {
        function HashRouterStrategy() {
            _classCallCheck(this, HashRouterStrategy);
        }
        // todo complete
        HashRouterStrategy.navigateTo = function(route, params) {
            location.hash = route;
        };
        HashRouterStrategy.goBack = function() {
            if (window.history) history.back();
        };
        HashRouterStrategy._check = function(hash) {
            var isMatch = false;
            hash = hash.substr(1);
            Object.keys(Router._pages).some(function(key) {
                var routeParams = {}, keys = key.match(/:([^\/]+)/g), match = hash.match(new RegExp(key.replace(/:([^\/]+)/g, "([^/]*)")));
                if (match) {
                    match.shift();
                    match.forEach(function(value, i) {
                        routeParams[keys[i].replace(":", "")] = value;
                    });
                    isMatch = true;
                    __showPage(key, routeParams);
                    return true;
                }
            });
            if (!isMatch) throw "page with path " + hash + " not registered, set up router correctly";
        };
        HashRouterStrategy.setup = function() {
            location.hash && HashRouterStrategy._check(location.hash);
            DomUtils.addEventListener(window, "hashchange", function() {
                HashRouterStrategy._check(location.hash);
            });
        };
        return HashRouterStrategy;
    }();
    ManualRouterStrategy = function() {
        function ManualRouterStrategy() {
            _classCallCheck(this, ManualRouterStrategy);
        }
        ManualRouterStrategy.navigateTo = function(route, params) {
            if (!Router._pages[route]) throw route + " not registered, set up router correctly";
            __showPage(route, params);
            ManualRouterStrategy.history.push({
                route: route,
                params: params
            });
        };
        ManualRouterStrategy.setup = function() {};
        ManualRouterStrategy.goBack = function() {
            ManualRouterStrategy.history.pop();
            var state = ManualRouterStrategy.history[ManualRouterStrategy.history.length - 1];
            if (state) __showPage(state.route, state.params);
        };
        return ManualRouterStrategy;
    }();
    ManualRouterStrategy.history = [];
    RouterStrategyProvider = function() {
        function RouterStrategyProvider() {
            _classCallCheck(this, RouterStrategyProvider);
        }
        RouterStrategyProvider.getRouterStrategy = function(strategyName) {
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
    routeNode = null;
    __showPage = function(pageName, params) {
        var componentNode, pageItem = Router._pages[pageName];
        if (!pageItem) throw "no page with name " + pageName + " registered";
        if (!pageItem.component) {
            componentNode = pageItem.componentProto.node.cloneNode(true);
            pageItem.component = pageItem.componentProto.newInstance(componentNode, {});
            pageItem.component.modelView.onShow && pageItem.component.modelView.onShow(params);
            pageItem.component.run();
            delete pageItem.componentProto;
        } else pageItem.component.modelView.onShow && pageItem.component.modelView.onShow(params);
        routeNode.parentNode.replaceChild(pageItem.component.node, routeNode);
        routeNode = pageItem.component.node;
        Component.digestAll();
    };
    Router = function() {
        function Router() {
            _classCallCheck(this, Router);
        }
        Router.setup = function(keyValues) {
            var routePlaceholderNode, strategyName = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Router.STRATEGY.MANUAL;
            Router._strategy = RouterStrategyProvider.getRouterStrategy(strategyName);
            routePlaceholderNode = document.querySelector("[data-route]");
            if (!routePlaceholderNode) throw "can not run Route: element with data-route attribute not found";
            routeNode = routePlaceholderNode.parentNode.appendChild(document.createElement("div"));
            Object.keys(keyValues).forEach(function(key) {
                Router._pages[key] = {
                    componentProto: keyValues[key],
                    component: null
                };
            });
            Router._strategy.setup();
        };
        Router.navigateTo = function(pageName, params) {
            Router._strategy.navigateTo(pageName, params);
        };
        Router.goBack = function() {
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
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    Core = function() {
        function Core() {
            _classCallCheck(this, Core);
        }
        Core.registerComponent = function(name, modelView) {
            var tmpl, domTemplate, node, componentProto;
            name = MiscUtils.camelToSnake(name);
            tmpl = TemplateLoader.getNode(modelView.template);
            domTemplate = tmpl.innerHTML;
            tmpl.remove();
            node = document.createElement("div");
            node.innerHTML = domTemplate;
            componentProto = new ComponentProto(name, node, modelView);
            ComponentProto.instances.push(componentProto);
            return componentProto;
        };
        Core.applyBindings = function(domElementSelector, modelView) {
            var domElement, fragment;
            if (!domElementSelector) throw "ca not applyBindings: element selector not provided";
            if ("string" != typeof domElementSelector) throw "element selector parameter mast me a string,\n            but " + (void 0 === domElementSelector ? "undefined" : _typeof(domElementSelector)) + " found}";
            domElement = document.querySelector(domElementSelector);
            if (!domElement) throw "can not apply bindings: root element with selector " + domElementSelector + " not defined";
            fragment = new ScopedDomFragment(domElement, modelView);
            fragment.run();
        };
        Core.digest = function() {
            Component.digestAll();
        };
        Core.getComponentById = function(id) {
            return Component.getComponentById(id);
        };
        Core.run = function() {
            console.warn("core.run() is deprecated for now");
        };
        return Core;
    }();
    Core.version = "0.5.1";
    window.RF = Core;
    window.RF.Router = Router;
}();