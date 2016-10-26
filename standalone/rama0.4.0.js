/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod){
		if(!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, "default": true };
		for(var p in mod) {
			if(!esProps[p]) return false;
		}
		return true;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			if(useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*dist/core/pollyfills*/
define('dist/core/pollyfills', [
    'module',
    '@loader'
], function (module, loader) {
    loader.get('@@global-helpers').prepareGlobal(module.id, []);
    var define = loader.global.define;
    var require = loader.global.require;
    var source = 'var myWindow = window;\ntry {\n    new myWindow.CustomEvent("test");\n}\ncatch (e) {\n    var CustomEventFuntion = function (typeArg, eventInitDict) {\n        var evt;\n        eventInitDict = eventInitDict || {\n            bubbles: false,\n            cancelable: false,\n            detail: undefined\n        };\n        evt = document.createEvent("CustomEvent");\n        evt.initCustomEvent(typeArg, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);\n        return evt;\n    };\n    CustomEventFuntion.prototype = Event.prototype;\n    myWindow.CustomEvent = CustomEventFuntion; // expose definition to window\n}\n';
    loader.global.define = undefined;
    loader.global.module = undefined;
    loader.global.exports = undefined;
    loader.__exec({
        'source': source,
        'address': module.uri
    });
    loader.global.require = require;
    loader.global.define = define;
    return loader.get('@@global-helpers').retrieveGlobal(module.id, undefined);
});
/*dist/core/utils/string-utils*/
define('dist/core/utils/string-utils', function (require, exports, module) {
    'use strict';
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;
    function titleCase(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    exports.titleCase = titleCase;
    function camelCase(name) {
        return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        }).replace(MOZ_HACK_REGEXP, 'Moz$1');
    }
    exports.camelCase = camelCase;
    function trim(text) {
        return text == null ? '' : (text + '').replace(rtrim, '');
    }
    exports.trim = trim;
});
/*dist/core/UIEventDispatcher*/
define('dist/core/UIEventDispatcher', function (require, exports, module) {
    'use strict';
    var UIEventDispatcher = function () {
        function UIEventDispatcher(element) {
            this.eventListenersDictionary = {};
            this.__setElementRef(element);
        }
        UIEventDispatcher.prototype.__setElementRef = function (node) {
            this._element = node;
            this[0] = node;
        };
        UIEventDispatcher.prototype.addEventListener = function (type, listener, useCapture) {
            this._element.addEventListener(type, listener, useCapture);
            if (this.eventListenersDictionary[type] === undefined || this.eventListenersDictionary[type] === null) {
                this.eventListenersDictionary[type] = [];
            }
            listener.useCapture = useCapture;
            this.eventListenersDictionary[type].push(listener);
        };
        UIEventDispatcher.prototype.dispatchEvent = function (evt) {
            this._element.dispatchEvent(evt);
            return !evt.defaultPrevented;
        };
        UIEventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
            this._element.removeEventListener(type, listener, useCapture);
            if (this.eventListenersDictionary[type] !== undefined && this.eventListenersDictionary[type] !== null) {
                var index = this.eventListenersDictionary[type].indexOf(listener);
                if (index > -1) {
                    this.eventListenersDictionary[type].splice(index, 1);
                }
                if (this.eventListenersDictionary[type].length <= 0) {
                    this.eventListenersDictionary[type] = null;
                }
            }
        };
        UIEventDispatcher.prototype.hasEventListener = function (type) {
            return this.eventListenersDictionary[type] !== undefined && this.eventListenersDictionary[type] !== null;
        };
        UIEventDispatcher.prototype.removeAllEventListeners = function () {
            for (var type in this.eventListenersDictionary) {
                if (this.eventListenersDictionary[type] !== null) {
                    for (var i = this.eventListenersDictionary[type].length - 1; i >= 0; i -= 1) {
                        var item = this.eventListenersDictionary[type][i];
                        this.removeEventListener(type, item, item.useCapture);
                    }
                }
            }
        };
        return UIEventDispatcher;
    }();
    exports.UIEventDispatcher = UIEventDispatcher;
});
/*dist/core/UIElement*/
define('dist/core/UIElement', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    require('dist/core/pollyfills');
    var string_utils_1 = require('dist/core/utils/string-utils');
    var UIEventDispatcher_1 = require('dist/core/UIEventDispatcher');
    var UIElement = function (_super) {
        __extends(UIElement, _super);
        function UIElement(element) {
            var el = element;
            if (typeof element === 'string') {
                el = document.createElement(element);
            }
            _super.call(this, el);
            this._initialized = false;
            this._children = [];
            this._currentState = '';
        }
        UIElement.prototype.getCurrentState = function () {
            return this._currentState;
        };
        UIElement.prototype.setCurrentState = function (value) {
            if (this._currentState !== value) {
                this._currentState = value;
                this.validateState();
            }
        };
        UIElement.prototype.initialize = function () {
            if (this._initialized)
                return;
            this.__preInitialize();
            this.preInitialize();
            this.createChildren();
            this.childrenCreated();
            this._initialized = true;
            this.initialized();
        };
        UIElement.prototype.__preInitialize = function () {
        };
        UIElement.prototype.preInitialize = function () {
        };
        UIElement.prototype.initialized = function () {
        };
        UIElement.prototype.preAttach = function () {
        };
        UIElement.prototype.attached = function () {
        };
        UIElement.prototype.preDetach = function () {
        };
        UIElement.prototype.detached = function () {
        };
        UIElement.prototype.getElementRef = function () {
            return this._element;
        };
        UIElement.prototype.setChildren = function (elements) {
        };
        UIElement.prototype.getChildren = function () {
            return this._children;
        };
        UIElement.prototype.appendChild = function (element) {
            this.appendChildAt(element, this._children.length);
        };
        UIElement.prototype.appendChildAt = function (element, index) {
            if (index === -1) {
                index = 0;
            }
            this.initializeAndAppendElement(element, index);
        };
        UIElement.prototype.initializeAndAppendElement = function (element, index) {
            element.parentElement = this;
            element.initialize();
            element.preAttach();
            if (this._children.length <= 0 || index > this._children.length - 1) {
                this._element.appendChild(element.getElementRef());
            } else {
                var refChild = this._children[index].getElementRef();
                this._element.insertBefore(element.getElementRef(), refChild);
            }
            element.attached();
            this._children.splice(index, 0, element);
        };
        UIElement.prototype.removeChild = function (element) {
            element.preDetach();
            this._children.splice(this._children.indexOf(element), 1);
            this._element.removeChild(element.getElementRef());
            element.detached();
        };
        ;
        UIElement.prototype.removeAllChildren = function () {
            while (this._children.length > 0) {
                this.removeChild(this._children[0]);
            }
        };
        UIElement.prototype.setAttribute = function (name, value) {
            var functionName = 'set' + string_utils_1.titleCase(name);
            if (this[functionName]) {
                this[functionName](value);
            } else {
                this[name] = value;
            }
            var searchPattern = new RegExp('^on');
            if (searchPattern.test(name)) {
                this.addEventListener(name.substring(2), value);
            }
            if (this._element instanceof Element && typeof value === 'string') {
                this._element.setAttribute(name, value);
            }
        };
        UIElement.prototype.getAttribute = function (name) {
            if (this._element instanceof Element) {
                return this._element.getAttribute(name);
            }
            return null;
        };
        UIElement.prototype.isInitialized = function () {
            return this._initialized;
        };
        UIElement.prototype.createChildren = function () {
        };
        UIElement.prototype.childrenCreated = function () {
        };
        UIElement.prototype.validateState = function () {
        };
        UIElement.prototype.hasClass = function (name) {
            if (!this.getAttribute)
                return false;
            return (' ' + (this.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + name + ' ') > -1;
        };
        UIElement.prototype.removeClasses = function (names) {
            var _this = this;
            if (names) {
                names.forEach(function (cssClass) {
                    _this.setAttribute('class', _this.trim((' ' + (_this.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').replace(' ' + _this.trim(cssClass) + ' ', ' ')));
                }, this);
            }
        };
        UIElement.prototype.addClasses = function (names) {
            var _this = this;
            if (names) {
                var existingClasses = (' ' + (this.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ');
                names.forEach(function (cssClass) {
                    cssClass = _this.trim(cssClass);
                    if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
                        existingClasses += cssClass + ' ';
                    }
                });
                this[0].setAttribute('class', this.trim(existingClasses));
            }
        };
        UIElement.prototype.toggleClasses = function (names) {
            var _this = this;
            if (names) {
                names.forEach(function (className) {
                    var classCondition = !_this.hasClass(className);
                    if (classCondition)
                        _this.addClasses([className]);
                    else
                        _this.removeClasses([className]);
                });
            }
        };
        UIElement.prototype.trim = function (text) {
            return text == null ? '' : (text + '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
        return UIElement;
    }(UIEventDispatcher_1.UIEventDispatcher);
    exports.UIElement = UIElement;
});
/*dist/core/support_classes/PropertySetter*/
define('dist/core/support_classes/PropertySetter', function (require, exports, module) {
    'use strict';
    var PropertySetter = function () {
        function PropertySetter(target, name, value) {
            this._target = null;
            this._name = null;
            this._value = null;
            this.oldValue = null;
            this._target = target;
            this._name = name;
            this._value = value;
        }
        Object.defineProperty(PropertySetter.prototype, 'target', {
            get: function () {
                return this._target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertySetter.prototype, 'name', {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertySetter.prototype, 'value', {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        PropertySetter.prototype.apply = function () {
            if (this._target) {
                this.oldValue = this._target.getAttribute(this._name);
                if (!this.oldValue) {
                    this.oldValue = '';
                }
                this._target.setAttribute(this._name, this._value);
            }
        };
        PropertySetter.prototype.remove = function () {
            if (this._target) {
                this._target.setAttribute(this._name, this.oldValue);
            }
        };
        return PropertySetter;
    }();
    exports.PropertySetter = PropertySetter;
});
/*dist/core/GroupBase*/
define('dist/core/GroupBase', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var UIElement_1 = require('dist/core/UIElement');
    var GroupBase = function (_super) {
        __extends(GroupBase, _super);
        function GroupBase() {
            _super.apply(this, arguments);
        }
        GroupBase.prototype.setChildren = function (elements) {
            if (this._initialized) {
                this.removeAllChildren();
                this._children = elements;
                this.createChildren();
                return;
            }
            this._children = elements;
        };
        GroupBase.prototype.createChildren = function () {
            if (this._children && this._children.length > 0) {
                var docFragment = document.createDocumentFragment();
                for (var i = 0; i < this._children.length; i++) {
                    var element = this._children[i];
                    element.parentElement = this;
                    element.initialize();
                    element.preAttach();
                    docFragment.appendChild(element.getElementRef());
                    element.attached();
                }
                this._element.appendChild(docFragment);
            }
        };
        return GroupBase;
    }(UIElement_1.UIElement);
    exports.GroupBase = GroupBase;
});
/*dist/core/DOMElement*/
define('dist/core/DOMElement', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var GroupBase_1 = require('dist/core/GroupBase');
    var DOMElement = function (_super) {
        __extends(DOMElement, _super);
        function DOMElement() {
            _super.apply(this, arguments);
        }
        return DOMElement;
    }(GroupBase_1.GroupBase);
    exports.DOMElement = DOMElement;
});
/*dist/core/collections/Dictionary*/
define('dist/core/collections/Dictionary', function (require, exports, module) {
    'use strict';
    var Dictionary = function () {
        function Dictionary() {
            this.dictionaryArray = [];
        }
        Dictionary.prototype.get = function (key) {
            var item = this.getKeyItem(key);
            if (item !== undefined) {
                return item.value;
            }
            return null;
        };
        Dictionary.prototype.set = function (key, value) {
            var item = this.getKeyItem(key);
            if (item !== undefined) {
                item.value = value;
            } else {
                this.dictionaryArray.push({
                    key: key,
                    value: value
                });
            }
        };
        Dictionary.prototype.remove = function (key, value) {
            for (var i = 0; i < this.dictionaryArray.length; i++) {
                var item = this.dictionaryArray[i];
                if (item.key === key) {
                    this.dictionaryArray.splice(i, 1);
                    break;
                }
            }
        };
        Dictionary.prototype.hasKey = function (key) {
            var item = this.getKeyItem(key);
            return item !== undefined;
        };
        Dictionary.prototype.getKeyItem = function (key) {
            for (var i = 0; i < this.dictionaryArray.length; i++) {
                var item = this.dictionaryArray[i];
                if (item.key === key) {
                    return item;
                }
            }
        };
        return Dictionary;
    }();
    exports.Dictionary = Dictionary;
});
/*dist/core/utils/dom*/
define('dist/core/utils/dom', function (require, exports, module) {
    'use strict';
    var UIElement_1 = require('dist/core/UIElement');
    var PropertySetter_1 = require('dist/core/support_classes/PropertySetter');
    var string_utils_1 = require('dist/core/utils/string-utils');
    var DOMElement_1 = require('dist/core/DOMElement');
    var Dictionary_1 = require('dist/core/collections/Dictionary');
    exports.eventMetadata = new Dictionary_1.Dictionary();
    function createVNode(ele, props) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var elementProps = {};
        var stateManagedProperties = {};
        for (var prop in props) {
            var nameAndState = prop.split('__');
            if (nameAndState.length == 2) {
                var stateName = nameAndState[1];
                if (stateManagedProperties[stateName] === undefined) {
                    stateManagedProperties[stateName] = {};
                }
                stateManagedProperties[stateName][nameAndState[0]] = props[prop];
            } else {
                elementProps[prop] = props[prop];
            }
        }
        return {
            type: ele,
            children: args,
            props: elementProps,
            stateManagedProps: stateManagedProperties
        };
    }
    exports.createVNode = createVNode;
    function createElement(tag, refs, stateManagedProperties) {
        var element;
        var vnode;
        if (typeof tag == 'string') {
            vnode = {
                type: 'text',
                text: tag
            };
        } else {
            vnode = tag;
        }
        if (vnode.type == 'text') {
            var textNode = document.createTextNode(vnode.text);
            return new DOMElement_1.DOMElement(textNode);
        }
        if (typeof vnode.type === 'string') {
            var htmlNode = document.createElement(vnode.type);
            element = new DOMElement_1.DOMElement(htmlNode);
        } else {
            element = new vnode.type();
        }
        if (!(element instanceof UIElement_1.UIElement)) {
            throw TypeError('Custom Component Class must extend UIElement.\n' + element.toString());
        }
        if (vnode.props) {
            for (var attrName in vnode.props) {
                element.setAttribute(attrName, vnode.props[attrName]);
            }
        }
        var children = vnode.children;
        if (children) {
            var childElements = [];
            for (var i = 0; i < children.length; i++) {
                var childElement = createElement(children[i], refs, stateManagedProperties);
                if (childElement) {
                    var childNode = children[i];
                    if (typeof children[i] !== 'string' && typeof childNode.type === 'string') {
                        var functionName = 'set' + string_utils_1.titleCase(childNode.type);
                        if (element[functionName]) {
                            element[functionName](childElement.getChildren());
                        } else {
                            childElements.push(childElement);
                        }
                    } else {
                        childElements.push(childElement);
                    }
                }
            }
            element.setChildren(childElements);
        }
        registerRefs(refs, vnode.props, element);
        registerStateManagedComponent(element, stateManagedProperties, vnode.stateManagedProps);
        registerEvents(element, vnode.props);
        return element;
    }
    exports.createElement = createElement;
    function registerEvents(element, props) {
        var events = exports.eventMetadata.get(element.constructor);
        if (events) {
            events.forEach(function (eventName) {
                if (props[eventName]) {
                    element.addEventListener(eventName, props[eventName]);
                }
            });
        }
    }
    function registerRefs(refs, props, element) {
        if (refs && props && props.id) {
            refs[props.id] = element;
        }
    }
    function registerStateManagedComponent(element, stateManagedProperties, stateManagedAttributes) {
        if (stateManagedProperties && stateManagedAttributes) {
            for (var stateName in stateManagedAttributes) {
                if (stateManagedProperties[stateName] === undefined) {
                    stateManagedProperties[stateName] = [];
                }
                var attributes = stateManagedAttributes[stateName];
                for (var attrName in attributes) {
                    var propertySetter = new PropertySetter_1.PropertySetter(element, attrName, attributes[attrName]);
                    stateManagedProperties[stateName].push(propertySetter);
                }
            }
        }
    }
});
/*dist/core/ModelEventDispatcher*/
define('dist/core/ModelEventDispatcher', function (require, exports, module) {
    'use strict';
    var HandlerObject = function () {
        function HandlerObject(handler, context) {
            this._handler = handler;
            this._context = context;
        }
        Object.defineProperty(HandlerObject.prototype, 'handler', {
            get: function () {
                return this._handler;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HandlerObject.prototype, 'context', {
            get: function () {
                return this._context;
            },
            enumerable: true,
            configurable: true
        });
        return HandlerObject;
    }();
    var ModelEventDispatcher = function () {
        function ModelEventDispatcher() {
            this.handlers = {};
        }
        ModelEventDispatcher.prototype.dispatchEvent = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var handlers;
            var eventType;
            if (typeof event == 'string')
                eventType = event;
            else
                eventType = event.type;
            handlers = this.getHandlers(eventType);
            if (handlers) {
                for (var i = 0; i < handlers.length; i++) {
                    var handler = handlers[i];
                    if (typeof event == 'string')
                        (_a = handler.handler).call.apply(_a, [handler.context].concat(args));
                    else
                        handler.handler.call(handler.context, event);
                }
            }
            var _a;
        };
        ModelEventDispatcher.prototype.addEventListener = function (eventName, callback, context) {
            this.toggleSubscription(eventName, callback, true, context);
        };
        ModelEventDispatcher.prototype.removeEventListener = function (eventName, callback) {
            this.toggleSubscription(eventName, callback, false);
        };
        ModelEventDispatcher.prototype.removeAllEventListeners = function (eventName) {
            this.handlers[eventName] = [];
        };
        ModelEventDispatcher.prototype.toggleSubscription = function (eventName, callback, subscribe, context) {
            var handlers = this.getHandlers(eventName);
            for (var i = 0; i < handlers.length; i++) {
                var handler = handlers[i];
                if (handler.handler === callback) {
                    if (subscribe === false) {
                        handlers.splice(handlers.indexOf(handler), 1);
                    }
                    return;
                }
            }
            handlers.push(new HandlerObject(callback, context));
        };
        ModelEventDispatcher.prototype.getHandlers = function (eventName) {
            var handlers;
            handlers = this.handlers[eventName];
            if (handlers === null || handlers === undefined)
                this.handlers[eventName] = handlers = [];
            return handlers;
        };
        ModelEventDispatcher.prototype.hasEventListener = function (eventName) {
            return this.handlers[eventName] !== undefined && this.handlers[eventName].length > 0;
        };
        return ModelEventDispatcher;
    }();
    exports.ModelEventDispatcher = ModelEventDispatcher;
});
/*dist/core/event*/
define('dist/core/event', function (require, exports, module) {
    'use strict';
    var REventInit = function () {
        function REventInit(bubbles, cancelable, detail) {
            this.bubbles = bubbles;
            this.cancelable = cancelable;
            this.detail = detail;
        }
        return REventInit;
    }();
    exports.REventInit = REventInit;
    var REvent = function () {
        function REvent(eventName) {
            this._type = eventName;
        }
        Object.defineProperty(REvent.prototype, 'type', {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        return REvent;
    }();
    exports.REvent = REvent;
});
/*dist/core/collections/events/CollectionEvent*/
define('dist/core/collections/events/CollectionEvent', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var event_1 = require('dist/core/event');
    exports.CollectionEventKind = {
        ADD: 'add',
        MOVE: 'move',
        REMOVE: 'remove',
        REPLACE: 'replace',
        EXPAND: 'expand',
        REFRESH: 'refresh',
        RESET: 'reset',
        UPDATE: 'update'
    };
    var CollectionEvent = function (_super) {
        __extends(CollectionEvent, _super);
        function CollectionEvent(eventName, kind, location, oldLocation, items) {
            _super.call(this, eventName);
            this.kind = kind;
            this.location = location;
            this.oldLocation = oldLocation;
            this.items = items ? items : [];
        }
        return CollectionEvent;
    }(event_1.REvent);
    exports.CollectionEvent = CollectionEvent;
});
/*dist/core/collections/ArrayList*/
define('dist/core/collections/ArrayList', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var CollectionEvent_1 = require('dist/core/collections/events/CollectionEvent');
    var CollectionEvent_2 = require('dist/core/collections/events/CollectionEvent');
    var ModelEventDispatcher_1 = require('dist/core/ModelEventDispatcher');
    var ArrayList = function (_super) {
        __extends(ArrayList, _super);
        function ArrayList(source) {
            _super.call(this);
            this._dispatchEvents = 0;
            this._source = null;
            this.disableEvents();
            this.setSource(source);
            this.enableEvents();
        }
        ArrayList.prototype.getSource = function () {
            return this._source;
        };
        ArrayList.prototype.setSource = function (value) {
            var i;
            var len;
            this._source = value ? value : [];
            if (this._dispatchEvents == 0) {
                var event = new CollectionEvent_1.CollectionEvent(CollectionEvent_1.CollectionEvent.COLLECTION_CHANGE, CollectionEvent_2.CollectionEventKind.RESET);
                this.dispatchEvent(event);
            }
        };
        Object.defineProperty(ArrayList.prototype, 'length', {
            get: function () {
                if (this._source)
                    return this._source.length;
                else
                    return 0;
            },
            enumerable: true,
            configurable: true
        });
        ArrayList.prototype.addItem = function (item) {
            this.addItemAt(item, this.length);
        };
        ;
        ArrayList.prototype.addItemAt = function (item, index) {
            if (index < 0 || index > this.length) {
                var message = 'Index out of bounds Exception: Specified index ' + index + 'is out of bounds for' + 'this collection of length ' + this.length;
                throw new RangeError(message);
            }
            this._source.splice(index, 0, item);
            this.internalDispatchEvent(CollectionEvent_2.CollectionEventKind.ADD, item, index);
        };
        ArrayList.prototype.addAll = function (addList) {
            this.addAllAt(addList, this.length);
        };
        ArrayList.prototype.addAllAt = function (addList, index) {
            var length = addList.length;
            for (var i = 0; i < length; i++) {
                this.addItemAt(addList[i], i + index);
            }
        };
        ArrayList.prototype.getItemIndex = function (item) {
            return this._source.indexOf(item);
        };
        ;
        ArrayList.prototype.removeItem = function (item) {
            var index = this.getItemIndex(item);
            var result = index >= 0;
            if (result)
                this.removeItemAt(index);
            return result;
        };
        ArrayList.prototype.removeItemAt = function (index) {
            if (index < 0 || index >= this.length) {
                var message = 'Index out of bounds Exception: Specified index ' + index + 'is out of bounds for' + 'this collection of length ' + this.length;
                throw new RangeError(message);
            }
            var removed = this._source.splice(index, 1)[0];
            this.internalDispatchEvent(CollectionEvent_2.CollectionEventKind.REMOVE, removed, index);
            return removed;
        };
        ;
        ArrayList.prototype.removeAll = function () {
            if (this.length > 0) {
                this._source.splice(0, this.length);
                this.internalDispatchEvent(CollectionEvent_2.CollectionEventKind.RESET);
            }
        };
        ArrayList.prototype.toArray = function () {
            return this._source.concat();
        };
        ArrayList.prototype.toString = function () {
            return this._source.toString();
        };
        ArrayList.prototype.getItemAt = function (index) {
            if (index < 0 || index >= this.length) {
                var message = 'Index out of bounds Exception: Specified index ' + index + 'is out of bounds for' + 'this collection of length ' + this.length;
                throw new RangeError(message);
            }
            return this._source[index];
        };
        ;
        ArrayList.prototype.setItemAt = function (item, index) {
            if (index < 0 || index >= this.length) {
                var message = 'Index out of bounds Exception: Specified index ' + index + 'is out of bounds for' + 'this collection of length ' + this.length;
                throw new RangeError(message);
            }
            var oldItem = this._source[index];
            this._source[index] = item;
            if (this._dispatchEvents == 0) {
                var hasCollectionListener = this.hasEventListener(CollectionEvent_1.CollectionEvent.COLLECTION_CHANGE);
                if (hasCollectionListener) {
                    var event = new CollectionEvent_1.CollectionEvent(CollectionEvent_1.CollectionEvent.COLLECTION_CHANGE);
                    event.kind = CollectionEvent_2.CollectionEventKind.REPLACE;
                    event.location = index;
                    var updateInfo = {};
                    updateInfo.oldValue = oldItem;
                    updateInfo.newValue = item;
                    updateInfo.property = index;
                    event.items.push(updateInfo);
                    this.dispatchEvent(event);
                }
            }
            return oldItem;
        };
        ArrayList.prototype.refresh = function () {
            var refreshEvent = new CollectionEvent_1.CollectionEvent(CollectionEvent_1.CollectionEvent.COLLECTION_CHANGE);
            refreshEvent.kind = CollectionEvent_2.CollectionEventKind.REFRESH;
            this.dispatchEvent(refreshEvent);
        };
        ArrayList.prototype.forEach = function (fn, context) {
            for (var i = 0; i < this.length; i++) {
                fn.call(context, this._source[i]);
            }
        };
        ArrayList.prototype.internalDispatchEvent = function (kind, item, location) {
            if (this._dispatchEvents == 0) {
                if (this.hasEventListener(CollectionEvent_1.CollectionEvent.COLLECTION_CHANGE)) {
                    var event = new CollectionEvent_1.CollectionEvent(CollectionEvent_1.CollectionEvent.COLLECTION_CHANGE, kind, location);
                    event.items.push(item);
                    this.dispatchEvent(event);
                }
            }
        };
        ArrayList.prototype.enableEvents = function () {
            this._dispatchEvents++;
            if (this._dispatchEvents > 0)
                this._dispatchEvents = 0;
        };
        ArrayList.prototype.disableEvents = function () {
            this._dispatchEvents--;
        };
        return ArrayList;
    }(ModelEventDispatcher_1.ModelEventDispatcher);
    exports.ArrayList = ArrayList;
});
/*dist/core/collections/ArrayCollection*/
define('dist/core/collections/ArrayCollection', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ModelEventDispatcher_1 = require('dist/core/ModelEventDispatcher');
    var ArrayList_1 = require('dist/core/collections/ArrayList');
    var CollectionEvent_1 = require('dist/core/collections/events/CollectionEvent');
    var ArrayCollection = function (_super) {
        __extends(ArrayCollection, _super);
        function ArrayCollection(source, filterFunc, sortFunction) {
            _super.call(this);
            this._filterFunction = filterFunc;
            this._sortFunction = sortFunction;
            this.setSource(source);
        }
        Object.defineProperty(ArrayCollection.prototype, 'sortFunction', {
            get: function () {
                return this._sortFunction;
            },
            set: function (value) {
                this._sortFunction = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrayCollection.prototype, 'filterFunction', {
            get: function () {
                return this._filterFunction;
            },
            set: function (value) {
                this._filterFunction = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArrayCollection.prototype, 'length', {
            get: function () {
                if (this._localIndex) {
                    return this._localIndex.length;
                } else if (this._list) {
                    return this._list.length;
                } else {
                    return 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        ArrayCollection.prototype.setSource = function (source) {
            var _this = this;
            if (this._list && this._list.getSource() === source)
                return;
            this._list = new ArrayList_1.ArrayList(source);
            this.internalRefresh(false);
            this._list.addEventListener(CollectionEvent_1.CollectionEvent.COLLECTION_CHANGE, function (event) {
                _this.dataProvider_collectionChangeHandler(event);
            });
        };
        ArrayCollection.prototype.getSource = function () {
            if (this._list)
                return this._list.getSource();
            return null;
        };
        ArrayCollection.prototype.addItem = function (item) {
            this.addItemAt(item, this.length);
        };
        ;
        ArrayCollection.prototype.addItemAt = function (item, index) {
            if (index < 0 || index > this.length) {
                var message = 'Index out of bounds Exception: Specified index ' + index + 'is out of bounds for' + 'this collection of length ' + this.length;
                throw new RangeError(message);
            }
            var listIndex = index;
            if (this._localIndex && this._sortFunction) {
                listIndex = this._list.length;
            } else if (this._localIndex && this._filterFunction != null) {
                if (listIndex == this._localIndex.length)
                    listIndex = this._list.length;
                else
                    listIndex = this._list.getItemIndex(this._localIndex[index]);
            }
            this._list.addItemAt(item, listIndex);
        };
        ;
        ArrayCollection.prototype.addAll = function (addList) {
            this.addAllAt(addList, this.length);
        };
        ArrayCollection.prototype.addAllAt = function (addList, index) {
            var length = addList.length;
            for (var i = 0; i < length; i++) {
                this.addItemAt(addList[i], i + index);
            }
        };
        ;
        ArrayCollection.prototype.getItemIndex = function (item) {
            var i;
            if (this._localIndex) {
                var len = this._localIndex.length;
                for (i = 0; i < len; i++) {
                    if (this._localIndex[i] == item)
                        return i;
                }
                return -1;
            }
            return this._list.getItemIndex(item);
        };
        ;
        ArrayCollection.prototype.removeItem = function (item) {
            var index = this.getItemIndex(item);
            var result = index >= 0;
            if (result)
                this.removeItemAt(index);
            return result;
        };
        ;
        ArrayCollection.prototype.removeItemAt = function (index) {
            if (index < 0 || index >= this.length) {
                var message = 'Index out of bounds Exception: Specified index ' + index + 'is out of bounds for' + 'this collection of length ' + this.length;
                throw new RangeError(message);
            }
            var listIndex = index;
            if (this._localIndex) {
                var oldItem = this._localIndex[index];
                listIndex = this._list.getItemIndex(oldItem);
                this._localIndex.splice(index, 1);
            }
            return this._list.removeItemAt(listIndex);
        };
        ;
        ArrayCollection.prototype.removeAll = function () {
            var len = this.length;
            if (len > 0) {
                if (this._localIndex) {
                    for (var i = len - 1; i >= 0; i--) {
                        this.removeItemAt(i);
                    }
                } else {
                    this._list.removeAll();
                }
            }
        };
        ;
        ArrayCollection.prototype.toArray = function () {
            var ret;
            if (this._localIndex) {
                ret = this._localIndex.concat();
            } else {
                ret = this._list.toArray();
            }
            return ret;
        };
        ;
        ArrayCollection.prototype.toString = function () {
            if (this._localIndex) {
                return this._localIndex.toString();
            } else {
                if (this._list && this._list.toString)
                    return this._list.toString();
                else
                    this.toString();
            }
        };
        ;
        ArrayCollection.prototype.getItemAt = function (index) {
            if (index < 0 || index >= this.length) {
                var message = 'Index out of bounds Exception: Specified index ' + index + 'is out of bounds for' + 'this collection of length ' + this.length;
                throw new RangeError(message);
            }
            if (this._localIndex) {
                return this._localIndex[index];
            } else if (this._list) {
                return this._list.getItemAt(index);
            }
            return null;
        };
        ;
        ArrayCollection.prototype.setItemAt = function (item, index) {
            if (index < 0 || index >= this.length) {
                var message = 'Index out of bounds Exception: Specified index ' + index + 'is out of bounds for' + 'this collection of length ' + this.length;
                throw new RangeError(message);
            }
            var listIndex = index;
            if (this._localIndex) {
                var oldItem = this._localIndex[index];
                listIndex = this._list.getItemIndex(oldItem);
                this._localIndex[index] = item;
            }
            return this._list.setItemAt(item, listIndex);
        };
        ;
        ArrayCollection.prototype.refresh = function () {
            this.internalRefresh(true);
        };
        ;
        ArrayCollection.prototype.forEach = function (fn, context) {
            for (var i = 0; i < this.length; i++) {
                fn.call(context, this.getItemAt(i));
            }
        };
        ArrayCollection.prototype.dataProvider_collectionChangeHandler = function (event) {
            var newEvent = new CollectionEvent_1.CollectionEvent(CollectionEvent_1.CollectionEvent.COLLECTION_CHANGE);
            for (var propName in newEvent) {
                if (event.hasOwnProperty(propName))
                    newEvent[propName] = event[propName];
            }
            this.dispatchEvent(newEvent);
        };
        ArrayCollection.prototype.internalRefresh = function (dispatch) {
            if (this._sortFunction || this._filterFunction) {
                if (this._list) {
                    this._localIndex = this._list.toArray();
                } else {
                    this._localIndex = [];
                }
                if (this._filterFunction != null) {
                    var tmp = [];
                    var len = this._localIndex.length;
                    for (var i = 0; i < len; i++) {
                        var item = this._localIndex[i];
                        if (this._filterFunction(item)) {
                            tmp.push(item);
                        }
                    }
                    this._localIndex = tmp;
                }
                if (this._sortFunction) {
                    this._localIndex.sort(this._sortFunction);
                    dispatch = true;
                }
            } else if (this._localIndex) {
                this._localIndex = null;
            }
            if (dispatch) {
                this._list.refresh();
            }
        };
        return ArrayCollection;
    }(ModelEventDispatcher_1.ModelEventDispatcher);
    exports.ArrayCollection = ArrayCollection;
});
/*dist/decorators*/
define('dist/decorators', function (require, exports, module) {
    'use strict';
    var dom_1 = require('dist/core/utils/dom');
    function skinPart(required) {
        if (required === void 0) {
            required = false;
        }
        return function (target, key) {
            if (!target.skinParts)
                target.skinParts = {};
            target.skinParts[key] = { required: required };
        };
    }
    exports.skinPart = skinPart;
    function event(name) {
        return function (constructor) {
            if (!dom_1.eventMetadata.get(constructor))
                dom_1.eventMetadata.set(constructor, []);
            var events = dom_1.eventMetadata.get(constructor);
            if (events.indexOf(name) == -1)
                events.push(name);
        };
    }
    exports.event = event;
});
/*dist/core/support_classes/State*/
define('dist/core/support_classes/State', function (require, exports, module) {
    'use strict';
    var string_utils_1 = require('dist/core/utils/string-utils');
    var State = function () {
        function State(name, stateGroups) {
            var _this = this;
            this.propertySetters = [];
            this._stateGroups = [];
            this._name = name;
            if (stateGroups) {
                var tempStateGroups = stateGroups.split(',');
                tempStateGroups.forEach(function (stateGroup) {
                    _this._stateGroups.push(string_utils_1.trim(stateGroup));
                });
            }
        }
        Object.defineProperty(State.prototype, 'stateGroups', {
            get: function () {
                return this._stateGroups;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, 'name', {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        State.prototype.initialize = function () {
            if (!this._initialized) {
                this._initialized = true;
            }
        };
        State.prototype.apply = function () {
            for (var i = 0; i < this.propertySetters.length; i++) {
                var componentItem = this.propertySetters[i];
                componentItem.target[componentItem.name] = componentItem.value;
            }
        };
        return State;
    }();
    exports.State = State;
});
/*dist/core/ViewBase*/
define('dist/core/ViewBase', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var dom_1 = require('dist/core/utils/dom');
    var State_1 = require('dist/core/support_classes/State');
    var UIElement_1 = require('dist/core/UIElement');
    var ViewBase = function (_super) {
        __extends(ViewBase, _super);
        function ViewBase() {
            _super.call(this);
            this._viewStates = [];
            this._stateManagedProperties = {};
        }
        ViewBase.prototype.__preInitialize = function () {
            var _this = this;
            this.parse();
            this._viewStates.forEach(function (state) {
                if (_this._stateManagedProperties.hasOwnProperty(state.name)) {
                    state.propertySetters.push.apply(state.propertySetters, _this._stateManagedProperties[state.name]);
                }
                state.stateGroups.forEach(function (stateGroup) {
                    if (_this._stateManagedProperties.hasOwnProperty(stateGroup)) {
                        state.propertySetters.push.apply(state.propertySetters, _this._stateManagedProperties[stateGroup]);
                    }
                });
            });
        };
        ViewBase.prototype.initialized = function () {
            this.setCurrentState(this._tempCurrentState);
        };
        ViewBase.prototype.setChildren = function (elements) {
            if (this._initialized) {
                this._children = elements;
                this.createChildren();
                return;
            }
            this._children = elements;
        };
        ViewBase.prototype.getChildren = function () {
            return this.rootElement.getChildren();
        };
        ViewBase.prototype.removeChild = function (element) {
            this.rootElement.removeChild(element);
        };
        ViewBase.prototype.removeAllChildren = function () {
            this.rootElement.removeAllChildren();
        };
        ViewBase.prototype.appendChildAt = function (element, index) {
            this.rootElement.appendChildAt(element, index);
        };
        ViewBase.prototype.appendChild = function (newChild) {
            this.rootElement.appendChild(newChild);
        };
        ViewBase.prototype.createChildren = function () {
            if (this._children && this._children.length > 0) {
                this.rootElement.setChildren(this._children);
            }
            this.rootElement.initialize();
        };
        ViewBase.prototype.parse = function () {
            var tempVNode = this.render();
            var statesVNode;
            if (tempVNode === null || tempVNode === undefined) {
                tempVNode = { type: 'div' };
            }
            if (tempVNode.children) {
                for (var i = 0; i < tempVNode.children.length; i++) {
                    var childNode = tempVNode.children[i];
                    if (typeof childNode !== 'string' && childNode.type === 'states') {
                        statesVNode = childNode;
                        tempVNode.children.splice(i, 1);
                        break;
                    }
                }
            }
            if (statesVNode && statesVNode.children) {
                for (var j = 0; j < statesVNode.children.length; j++) {
                    var stateNode = statesVNode.children[j];
                    if (typeof stateNode === 'string')
                        return;
                    if (stateNode.props && stateNode.props['name'] !== null && stateNode.props['name'] !== undefined) {
                        var state = new State_1.State(stateNode.props['name'], stateNode.props['stateGroups']);
                        this._viewStates.push(state);
                    }
                }
            }
            this.rootElement = dom_1.createElement(tempVNode, this, this._stateManagedProperties);
            this.__setElementRef(this.rootElement.getElementRef());
        };
        ViewBase.prototype.hasState = function (stateName) {
            for (var i = 0; i < this._viewStates.length; i++) {
                if (this._viewStates[i].name == stateName)
                    return true;
            }
            return false;
        };
        ;
        ViewBase.prototype.getCurrentState = function () {
            if (!this.initialized)
                return this._tempCurrentState;
            return this._currentState;
        };
        ViewBase.prototype.setCurrentState = function (stateName) {
            var oldState = this.getState(this._currentState);
            if (this._initialized) {
                if (this.isBaseState(stateName)) {
                    this.removeState(oldState);
                    this._currentState = stateName;
                } else {
                    var destination = this.getState(stateName);
                    this.initializeState(stateName);
                    this.removeState(oldState);
                    this._currentState = stateName;
                    this.applyState(destination);
                }
            } else {
                this._tempCurrentState = stateName;
            }
        };
        ViewBase.prototype.isBaseState = function (stateName) {
            return !stateName || stateName == '';
        };
        ViewBase.prototype.initializeState = function (stateName) {
            var state = this.getState(stateName);
            if (state) {
                state.initialize();
            }
        };
        ViewBase.prototype.removeState = function (state) {
            if (state) {
                for (var i = 0; i < state.propertySetters.length; i++) {
                    state.propertySetters[i].remove();
                }
            }
        };
        ViewBase.prototype.applyState = function (state) {
            if (state) {
                for (var i = 0; i < state.propertySetters.length; i++) {
                    state.propertySetters[i].apply();
                }
            }
        };
        ViewBase.prototype.getState = function (stateName) {
            if (!this._viewStates || this.isBaseState(stateName))
                return null;
            for (var i = 0; i < this._viewStates.length; i++) {
                if (this._viewStates[i].name == stateName)
                    return this._viewStates[i];
            }
            throw new ReferenceError('State not Found Exception: The state \'' + stateName + '\' being set on the component is not found in the skin');
        };
        return ViewBase;
    }(UIElement_1.UIElement);
    exports.ViewBase = ViewBase;
});
/*dist/View*/
define('dist/View', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ViewBase_1 = require('dist/core/ViewBase');
    var View = function (_super) {
        __extends(View, _super);
        function View() {
            _super.apply(this, arguments);
        }
        return View;
    }(ViewBase_1.ViewBase);
    exports.View = View;
});
/*dist/Skin*/
define('dist/Skin', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ViewBase_1 = require('dist/core/ViewBase');
    var Skin = function (_super) {
        __extends(Skin, _super);
        function Skin() {
            _super.apply(this, arguments);
        }
        Skin.prototype.getSkinPartByID = function (id) {
            var part = this[id];
            return part ? part : null;
        };
        return Skin;
    }(ViewBase_1.ViewBase);
    exports.Skin = Skin;
});
/*dist/Group*/
define('dist/Group', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var GroupBase_1 = require('dist/core/GroupBase');
    var Group = function (_super) {
        __extends(Group, _super);
        function Group() {
            _super.call(this, 'div');
        }
        return Group;
    }(GroupBase_1.GroupBase);
    exports.Group = Group;
});
/*dist/Component*/
define('dist/Component', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var UIElement_1 = require('dist/core/UIElement');
    var Component = function (_super) {
        __extends(Component, _super);
        function Component(element) {
            var el;
            if (!element) {
                el = 'div';
            }
            _super.call(this, el);
        }
        Component.prototype.detached = function () {
            this.detachSkin();
        };
        Component.prototype.setSkinClass = function (value) {
            if (this._skinClass !== value) {
                this._skinClass = value;
                if (this._initialized)
                    this.validateSkinChange();
            }
        };
        Component.prototype.partAdded = function (id, instance) {
        };
        ;
        Component.prototype.partRemoved = function (id, instance) {
        };
        ;
        Component.prototype.createChildren = function () {
            this.validateSkinChange();
        };
        Component.prototype.validateSkinChange = function () {
            if (this._skinElement)
                this.detachSkin();
            this.attachSkin();
        };
        Component.prototype.attachSkin = function () {
            if (this._skinClass) {
                this._skinElement = new this._skinClass();
                this.initializeAndAppendElement(this._skinElement, 0);
                this.findSkinParts();
                this.validateSkinState();
            }
        };
        Component.prototype.validateState = function () {
            this.validateSkinState();
        };
        Component.prototype.validateSkinState = function () {
            if (this._skinElement) {
                this._skinElement.setCurrentState(this.getCurrentState());
            }
        };
        Component.prototype.detachSkin = function () {
            if (this._skinElement) {
                this.clearSkinParts();
                this.removeChild(this._skinElement);
            }
        };
        Component.prototype.findSkinParts = function () {
            if (this._skinElement) {
                for (var id in this.skinParts) {
                    var skinPart = this.skinParts[id];
                    var skinPartFound = false;
                    var skinPartElement = this._skinElement.getSkinPartByID(id);
                    if (skinPartElement) {
                        skinPartFound = true;
                        this[id] = skinPartElement;
                        this.partAdded(id, skinPartElement);
                    }
                    if (skinPart.required === true && !skinPartFound) {
                        throw new ReferenceError('Required Skin part not found: ' + id + ' in the Attached skin');
                    }
                }
            }
        };
        Component.prototype.clearSkinParts = function () {
            if (this._skinElement) {
                for (var id in this.skinParts) {
                    var skinPart = this.skinParts[id];
                    if (this[id] !== null) {
                        this.partRemoved(id, this[id]);
                    }
                }
            }
        };
        Component.prototype.appendChild = function (newChild) {
        };
        Component.prototype.appendChildAt = function (element, index) {
        };
        return Component;
    }(UIElement_1.UIElement);
    exports.Component = Component;
});
/*dist/Container*/
define('dist/Container', function (require, exports, module) {
    'use strict';
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = this && this.__metadata || function (k, v) {
        if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
            return Reflect.metadata(k, v);
    };
    var Component_1 = require('dist/Component');
    var GroupBase_1 = require('dist/core/GroupBase');
    var decorators_1 = require('dist/decorators');
    var Container = function (_super) {
        __extends(Container, _super);
        function Container() {
            _super.apply(this, arguments);
        }
        Container.prototype.getChildren = function () {
            if (this.contentGroup)
                return this.contentGroup.getChildren();
            return this._tempChildren;
        };
        Container.prototype.setChildren = function (elements) {
            this._tempChildren = elements;
            if (this.contentGroup) {
                this.contentGroup.setChildren(this._tempChildren);
            }
        };
        Container.prototype.partAdded = function (id, instance) {
            _super.prototype.partAdded.call(this, id, instance);
            if (instance === this.contentGroup) {
                this.contentGroup.setChildren(this._tempChildren);
            }
        };
        Container.prototype.removeChild = function (element) {
            if (this.contentGroup)
                this.contentGroup.removeChild(element);
        };
        Container.prototype.removeAllChildren = function () {
            if (this.contentGroup)
                this.contentGroup.removeAllChildren();
        };
        Container.prototype.appendChildAt = function (element, index) {
            if (this.contentGroup)
                this.contentGroup.appendChildAt(element, index);
        };
        Container.prototype.appendChild = function (newChild) {
            if (this.contentGroup)
                this.contentGroup.appendChild(newChild);
        };
        __decorate([
            decorators_1.skinPart(false),
            __metadata('design:type', GroupBase_1.GroupBase)
        ], Container.prototype, 'contentGroup', void 0);
        return Container;
    }(Component_1.Component);
    exports.Container = Container;
});
/*dist/index*/
define('dist/index', function (require, exports, module) {
    'use strict';
    function __export(m) {
        for (var p in m)
            if (!exports.hasOwnProperty(p))
                exports[p] = m[p];
    }
    var dom_1 = require('dist/core/utils/dom');
    var DOMElement_1 = require('dist/core/DOMElement');
    exports.rama = { createElement: dom_1.createVNode };
    exports.render = function (elementClass, node) {
        node.innerHTML = '';
        var element = new elementClass();
        element.initialize();
        var domElement = new DOMElement_1.DOMElement(node);
        domElement.appendChild(element);
    };
    __export(require('dist/core/utils/dom'));
    __export(require('dist/core/UIElement'));
    __export(require('dist/core/UIEventDispatcher'));
    __export(require('dist/core/ModelEventDispatcher'));
    __export(require('dist/core/UIElement'));
    __export(require('dist/core/collections/ArrayCollection'));
    __export(require('dist/core/collections/ArrayList'));
    __export(require('dist/core/collections/Dictionary'));
    __export(require('dist/decorators'));
    __export(require('dist/View'));
    __export(require('dist/Skin'));
    __export(require('dist/Group'));
    __export(require('dist/Component'));
    __export(require('dist/Container'));
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();