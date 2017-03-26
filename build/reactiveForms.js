!function() {
    "use strict";
    var Component, ComponentProto, ScopedDomFragment, ScopedLoopContainer, DirectiveEngine, DomUtils, _getValByPath, getVal, external, ExpressionEngine, Token, Lexer, MiscUtils, Router, Core, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, ElementPrototype = "undefined" != typeof HTMLElement ? HTMLElement.prototype : Element.prototype;
    if (!ElementPrototype.remove) ElementPrototype.remove = function() {
        this.parentNode.removeChild(this);
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
            _classCallCheck(this, Component);
            this.parent = null;
            this.children = null;
            this.name = name;
            this.node = node;
            this.modelView = modelView;
            this.watchers = [];
            Component.instances.push(this);
        }
        Component.prototype.addChild = function(childComponent) {
            if (!this.children) this.children = [];
            this.children.push(childComponent);
        };
        Component.prototype.updateModelView = function(modelView) {
            this.modelView = modelView;
            if (this.children) this.children.forEach(function(c) {
                c.modelView = modelView;
            });
        };
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
            var _this = this;
            this.watchers.forEach(function(watcher) {
                var oldValue, newValue = ExpressionEngine.runExpressionFn(watcher.watcherFn, _this);
                if ("object" == (void 0 === newValue ? "undefined" : _typeof(newValue))) newValue = MiscUtils.deepCopy(newValue);
                oldValue = watcher.last;
                if (!MiscUtils.deepEqual(newValue, oldValue)) watcher.listenerFn(newValue, oldValue);
                watcher.last = newValue;
            });
        };
        Component.prototype.run = function() {
            new DirectiveEngine(this).run();
        };
        Component.prototype.destroy = function() {};
        Component.digestAll = function() {
            Component.instances.forEach(function(cmp) {
                cmp.digest();
            });
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
        ComponentProto.prototype.applyProperties = function(target) {
            var properties = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, opts = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, strict = opts.strict;
            Object.keys(properties).forEach(function(key) {
                if (strict && !target.hasOwnProperty(key)) throw "can not apply non declared property " + key + " to component " + target.name;
                target[key] = properties[key];
            });
        };
        ComponentProto.prototype.runNewInstance = function(node, properties) {
            var instance, externalProperties = this.modelView.external, modelView = MiscUtils.deepCopy(this.modelView);
            delete modelView.external;
            this.applyProperties(modelView, properties, {
                strict: true
            });
            externalProperties && this.applyProperties(modelView, externalProperties);
            instance = new Component(this.name, node, modelView);
            instance.run();
            return instance;
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
            var _this = _possibleConstructorReturn(this, _Component.call(this, null, node, modelView, void 0));
            _this.scopedDomFragments = [];
            _this.lastFrafmentsLength = 0;
            _this.node = node;
            _this.parent = null;
            return _this;
        }
        ScopedLoopContainer.prototype._destroyFragment = function(index) {
            var removedFragment;
            this.scopedDomFragments[index].node.remove();
            removedFragment = this.scopedDomFragments.splice(index, 1);
            removedFragment.destroy();
            this.lastFrafmentsLength--;
        };
        ScopedLoopContainer.prototype.run = function(eachItemName, iterableObjectName) {
            var _this2 = this;
            this.eachItemName = eachItemName;
            this.anchor = document.createComment("loop: " + eachItemName + " in " + iterableObjectName);
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
                    localModelView.index = i;
                    node = _this3.node.cloneNode(true);
                    currNodeInIteration.parentNode.insertBefore(node, currNodeInIteration.nextSibling);
                    scopedDomFragment = new ScopedDomFragment(node, localModelView);
                    scopedDomFragment.parent = _this3.parent;
                    scopedDomFragment.parent.addChild(scopedDomFragment);
                    new DirectiveEngine(scopedDomFragment).run();
                    currNodeInIteration = node;
                    _this3.scopedDomFragments.push(scopedDomFragment);
                    _this3.lastFrafmentsLength++;
                } else {
                    _localModelView = _this3.scopedDomFragments[i].modelView;
                    _localModelView[_this3.eachItemName] = iterableItem;
                    _localModelView.index = i;
                    currNodeInIteration = _this3.scopedDomFragments[i].node;
                    _this3.scopedDomFragments[i].updateModelView(_localModelView);
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
                var eachItemName, iterableObjectName, scopedLoopContainer, tokens = expression.split(" ");
                if ([ "in", "of" ].indexOf(tokens[1]) == -1) throw "can not parse expression " + expression;
                eachItemName = tokens[0];
                iterableObjectName = tokens[2];
                scopedLoopContainer = new ScopedLoopContainer(el, _this.component.modelView);
                scopedLoopContainer.parent = _this.component;
                scopedLoopContainer.run(eachItemName, iterableObjectName);
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
                    e = e || window.e;
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.cancelBubble = true;
                    ExpressionEngine.runExpressionFn(fn, _this3.component);
                    Component.digestAll();
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
        DirectiveEngine.prototype.runDirective_Value = function() {
            var fn, el = this.component.node, expression = el.getAttribute("data-value");
            if (expression) {
                if ("option" != el.tagName.toLowerCase()) throw "data-value attribute supported only by <option>, use data-model instead";
                fn = ExpressionEngine.getExpressionFn(expression);
                ExpressionEngine.runExpressionFn(fn, this.component);
                this.component.addWatcher(expression, function(value) {
                    el.value = value;
                });
            }
        };
        DirectiveEngine.prototype.runDirective_Model = function() {
            var _this5 = this;
            this._eachElementWithAttr("data-model", function(el, expression) {
                if ("radio" == el.getAttribute("type") && !el.getAttribute("name")) el.setAttribute("name", el.getAttribute("_data-model"));
                DomUtils.getDefaultInputChangeEvents(el).split(",").forEach(function(eventName) {
                    DomUtils.addEventListener(el, eventName, function() {
                        ExpressionEngine.setValueToContext(_this5.component.modelView, expression, DomUtils.getInputValue(el));
                        Component.digestAll();
                    });
                });
                _this5.component.addWatcher(expression, function(value) {
                    if (DomUtils.getInputValue(el) !== value) DomUtils.setInputValue(el, value);
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
        DirectiveEngine.prototype.runDirective_If = function() {
            var _this8 = this;
            this._eachElementWithAttr("data-if", function(el, expression) {
                var cloned, comment = document.createComment("");
                el.parentNode.insertBefore(comment, el);
                cloned = void 0;
                _this8.component.addWatcher(expression, function(val) {
                    if (val) {
                        if (!el.parentElement) {
                            cloned = el.cloneNode(true);
                            comment.parentNode.insertBefore(cloned, comment.nextSibling);
                        }
                    } else if (cloned) cloned.remove(); else el.remove();
                });
            });
        };
        DirectiveEngine.prototype.run = function() {
            var _this9 = this;
            this.runDirective_Value();
            this.runDirective_For();
            this.runTextNodes();
            [ "click", "blur", "focus", "submit", "change", "keypress", "keyup", "keydown" ].forEach(function(eventName) {
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
        DomUtils.removeParentBunNotChildren = function(nodeToBeRemoved) {
            for (;nodeToBeRemoved.firstChild; ) nodeToBeRemoved.parentNode.insertBefore(nodeToBeRemoved.firstChild, nodeToBeRemoved);
            nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
        };
        return DomUtils;
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
        if (void 0 === res && component.parent) return _getValByPath(component.parent, path); else if (res && res.call) return function() {
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
        /**
     * expression = 'user.name' object[field] = value
     */
        ExpressionEngine.setValueToContext = function(context, expression, value) {
            var code, fn, quotes = "";
            if ("string" == typeof value) quotes = '"';
            code = Lexer.convertExpression(expression, "context.{expr}") + "=" + quotes + value + quotes;
            try {
                fn = new Function("context", code);
                fn(context);
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
        OR: "|"
    };
    Token.ALL_SYMBOLS = Object.keys(Token.SYMBOL).map(function(key) {
        return Token.SYMBOL[key];
    });
    Token.TYPE = {
        DIGIT: "DIGIT",
        VARIABLE: "VARIABLE",
        STRING: "STRING",
        OBJECT_KEY: "OBJECT_KEY",
        FUNCTION: "FUNCTION"
    };
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function charInArr(char, arr) {
        return arr.indexOf(char) > -1;
    }
    Lexer = function() {
        function Lexer() {
            _classCallCheck(this, Lexer);
        }
        Lexer.tokenize = function(expression) {
            var tokens = [], t = void 0, lastChar = "";
            expression = expression.trim();
            expression.split("").forEach(function(char, i) {
                var type, lastToken = tokens[tokens.length - 1];
                if (charInArr(char, Token.ALL_SYMBOLS)) {
                    t = new Token(char, null);
                    tokens.push(t);
                    lastChar = char;
                    if (lastToken && char == Token.SYMBOL.L_PAR) lastToken.tokenType = Token.TYPE.FUNCTION;
                } else {
                    if (lastToken && lastToken.tokenType != Token.TYPE.STRING && " " == char) return;
                    if (lastToken && (lastToken.tokenType == Token.TYPE.DIGIT || lastToken.tokenType == Token.TYPE.VARIABLE || lastToken.tokenType == Token.TYPE.OBJECT_KEY || lastToken.tokenType == Token.TYPE.STRING)) lastToken.tokenValue += char; else {
                        type = void 0;
                        if (isNumber(char)) type = Token.TYPE.DIGIT; else if (charInArr(char, [ '"', "'" ])) type = Token.TYPE.STRING; else if (lastChar == Token.SYMBOL.L_CURLY || lastChar == Token.SYMBOL.COMMA) type = Token.TYPE.OBJECT_KEY; else type = Token.TYPE.VARIABLE;
                        t = new Token(type, char);
                        tokens.push(t);
                    }
                    lastChar = char;
                }
            });
            tokens.forEach(function(t) {
                t.tokenValue && (t.tokenValue = t.tokenValue.trim());
            });
            //console.log(JSON.stringify(tokens));
            return tokens;
        };
        Lexer.convertExpression = function(expression, variableReplacerStr) {
            var out = "";
            expression = expression.split("\n").join("");
            Lexer.tokenize(expression).forEach(function(token) {
                if ([ Token.TYPE.VARIABLE, Token.TYPE.FUNCTION ].indexOf(token.tokenType) > -1) out += variableReplacerStr.replace("{expr}", token.tokenValue); else out += token.tokenValue || token.tokenType;
            });
            return out;
        };
        return Lexer;
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
        return MiscUtils;
    }();
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    Router = function() {
        function Router() {
            _classCallCheck(this, Router);
            this._pages = {};
        }
        Router.prototype.setup = function(keyValues) {
            var _this = this;
            this.routeNode = document.querySelector("[data-route]");
            if (!this.routeNode) throw "can not run Route: element with data-route attribute not found";
            Object.keys(keyValues).forEach(function(key) {
                _this._pages[key] = {
                    componentProto: keyValues[key]
                };
            });
        };
        Router.prototype.navigateTo = function(pageName) {
            var componentNode, pageItem = this._pages[pageName];
            if (!pageItem) throw pageName + " not registered, set up router correctly";
            this.routeNode.innerHTML = "";
            if (!pageItem.component) {
                componentNode = pageItem.componentProto.node.cloneNode(true);
                pageItem.component = pageItem.componentProto.runNewInstance(componentNode, {});
                delete pageItem.componentProto;
            }
            this.routeNode.appendChild(pageItem.component.node);
        };
        return Router;
    }();
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    Core = function() {
        function Core() {
            _classCallCheck(this, Core);
        }
        Core.registerComponent = function(name, modelView) {
            var node, componentProto, tmpl = document.getElementById(modelView.template.value), domTemplate = tmpl.innerHTML;
            tmpl.remove();
            node = document.createElement("div");
            node.innerHTML = domTemplate;
            componentProto = new ComponentProto(name, node, modelView);
            ComponentProto.instances.push(componentProto);
            return componentProto;
        };
        Core.applyBindings = function(domElement, modelView) {
            if ("string" == typeof domElement) domElement = document.querySelector(domElement);
            if (!domElement) throw "can not apply bindings: root element not defined";
            new ScopedDomFragment(domElement, modelView).run();
        };
        Core.digest = function() {
            Component.digestAll();
        };
        Core.run = function() {
            ComponentProto.instances.forEach(function(componentProto) {
                var domEls = DomUtils.nodeListToArray(document.getElementsByTagName(componentProto.name)), componentNodes = [];
                domEls.forEach(function(it) {
                    var dataProperties, componentNode = componentProto.node.cloneNode(true);
                    componentNodes.push(componentNode);
                    it.parentNode.insertBefore(componentNode, it);
                    dataProperties = it.getAttribute("data-properties") || "{}";
                    dataProperties = ExpressionEngine.getObjectFromString(dataProperties);
                    componentProto.runNewInstance(componentNode, dataProperties);
                    it.parentNode.removeChild(it);
                });
                componentNodes.forEach(function(node) {
                    DomUtils.removeParentBunNotChildren(node);
                });
            });
        };
        return Core;
    }();
    Core.version = "0.0.1";
    window.RF = Core;
    window.RF.Router = new Router();
}();