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
/*object-assign@4.1.0#index*/
define('object-assign', function (require, exports, module) {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
        if (val === null || val === undefined) {
            throw new TypeError('Object.assign cannot be called with null or undefined');
        }
        return Object(val);
    }
    function shouldUseNative() {
        try {
            if (!Object.assign) {
                return false;
            }
            var test1 = new String('abc');
            test1[5] = 'de';
            if (Object.getOwnPropertyNames(test1)[0] === '5') {
                return false;
            }
            var test2 = {};
            for (var i = 0; i < 10; i++) {
                test2['_' + String.fromCharCode(i)] = i;
            }
            var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
                return test2[n];
            });
            if (order2.join('') !== '0123456789') {
                return false;
            }
            var test3 = {};
            'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
                test3[letter] = letter;
            });
            if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
    module.exports = shouldUseNative() ? Object.assign : function (target, source) {
        var from;
        var to = toObject(target);
        var symbols;
        for (var s = 1; s < arguments.length; s++) {
            from = Object(arguments[s]);
            for (var key in from) {
                if (hasOwnProperty.call(from, key)) {
                    to[key] = from[key];
                }
            }
            if (Object.getOwnPropertySymbols) {
                symbols = Object.getOwnPropertySymbols(from);
                for (var i = 0; i < symbols.length; i++) {
                    if (propIsEnumerable.call(from, symbols[i])) {
                        to[symbols[i]] = from[symbols[i]];
                    }
                }
            }
        }
        return to;
    };
});
/*react@15.3.2#lib/reactProdInvariant*/
define('react/lib/reactProdInvariant', function (require, exports, module) {
    'use strict';
    function reactProdInvariant(code) {
        var argCount = arguments.length - 1;
        var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;
        for (var argIdx = 0; argIdx < argCount; argIdx++) {
            message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
        }
        message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';
        var error = new Error(message);
        error.name = 'Invariant Violation';
        error.framesToPop = 1;
        throw error;
    }
    module.exports = reactProdInvariant;
});
/*fbjs@0.8.5#lib/invariant*/
define('fbjs/lib/invariant', function (require, exports, module) {
    'use strict';
    function invariant(condition, format, a, b, c, d, e, f) {
        if (process.env.NODE_ENV !== 'production') {
            if (format === undefined) {
                throw new Error('invariant requires an error message argument');
            }
        }
        if (!condition) {
            var error;
            if (format === undefined) {
                error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
            } else {
                var args = [
                    a,
                    b,
                    c,
                    d,
                    e,
                    f
                ];
                var argIndex = 0;
                error = new Error(format.replace(/%s/g, function () {
                    return args[argIndex++];
                }));
                error.name = 'Invariant Violation';
            }
            error.framesToPop = 1;
            throw error;
        }
    }
    module.exports = invariant;
});
/*react@15.3.2#lib/PooledClass*/
define('react/lib/PooledClass', function (require, exports, module) {
    'use strict';
    var _prodInvariant = require('react/lib/reactProdInvariant');
    var invariant = require('fbjs/lib/invariant');
    var oneArgumentPooler = function (copyFieldsFrom) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, copyFieldsFrom);
            return instance;
        } else {
            return new Klass(copyFieldsFrom);
        }
    };
    var twoArgumentPooler = function (a1, a2) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, a1, a2);
            return instance;
        } else {
            return new Klass(a1, a2);
        }
    };
    var threeArgumentPooler = function (a1, a2, a3) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, a1, a2, a3);
            return instance;
        } else {
            return new Klass(a1, a2, a3);
        }
    };
    var fourArgumentPooler = function (a1, a2, a3, a4) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, a1, a2, a3, a4);
            return instance;
        } else {
            return new Klass(a1, a2, a3, a4);
        }
    };
    var fiveArgumentPooler = function (a1, a2, a3, a4, a5) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, a1, a2, a3, a4, a5);
            return instance;
        } else {
            return new Klass(a1, a2, a3, a4, a5);
        }
    };
    var standardReleaser = function (instance) {
        var Klass = this;
        !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
        instance.destructor();
        if (Klass.instancePool.length < Klass.poolSize) {
            Klass.instancePool.push(instance);
        }
    };
    var DEFAULT_POOL_SIZE = 10;
    var DEFAULT_POOLER = oneArgumentPooler;
    var addPoolingTo = function (CopyConstructor, pooler) {
        var NewKlass = CopyConstructor;
        NewKlass.instancePool = [];
        NewKlass.getPooled = pooler || DEFAULT_POOLER;
        if (!NewKlass.poolSize) {
            NewKlass.poolSize = DEFAULT_POOL_SIZE;
        }
        NewKlass.release = standardReleaser;
        return NewKlass;
    };
    var PooledClass = {
        addPoolingTo: addPoolingTo,
        oneArgumentPooler: oneArgumentPooler,
        twoArgumentPooler: twoArgumentPooler,
        threeArgumentPooler: threeArgumentPooler,
        fourArgumentPooler: fourArgumentPooler,
        fiveArgumentPooler: fiveArgumentPooler
    };
    module.exports = PooledClass;
});
/*react@15.3.2#lib/ReactCurrentOwner*/
define('react/lib/ReactCurrentOwner', function (require, exports, module) {
    'use strict';
    var ReactCurrentOwner = { current: null };
    module.exports = ReactCurrentOwner;
});
/*fbjs@0.8.5#lib/emptyFunction*/
define('fbjs/lib/emptyFunction', function (require, exports, module) {
    'use strict';
    function makeEmptyFunction(arg) {
        return function () {
            return arg;
        };
    }
    var emptyFunction = function emptyFunction() {
    };
    emptyFunction.thatReturns = makeEmptyFunction;
    emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
    emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
    emptyFunction.thatReturnsNull = makeEmptyFunction(null);
    emptyFunction.thatReturnsThis = function () {
        return this;
    };
    emptyFunction.thatReturnsArgument = function (arg) {
        return arg;
    };
    module.exports = emptyFunction;
});
/*fbjs@0.8.5#lib/warning*/
define('fbjs/lib/warning', function (require, exports, module) {
    'use strict';
    var emptyFunction = require('fbjs/lib/emptyFunction');
    var warning = emptyFunction;
    if (process.env.NODE_ENV !== 'production') {
        (function () {
            var printWarning = function printWarning(format) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }
                var argIndex = 0;
                var message = 'Warning: ' + format.replace(/%s/g, function () {
                    return args[argIndex++];
                });
                if (typeof console !== 'undefined') {
                    console.error(message);
                }
                try {
                    throw new Error(message);
                } catch (x) {
                }
            };
            warning = function warning(condition, format) {
                if (format === undefined) {
                    throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
                }
                if (format.indexOf('Failed Composite propType: ') === 0) {
                    return;
                }
                if (!condition) {
                    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                        args[_key2 - 2] = arguments[_key2];
                    }
                    printWarning.apply(undefined, [format].concat(args));
                }
            };
        }());
    }
    module.exports = warning;
});
/*react@15.3.2#lib/canDefineProperty*/
define('react/lib/canDefineProperty', function (require, exports, module) {
    'use strict';
    var canDefineProperty = false;
    if (process.env.NODE_ENV !== 'production') {
        try {
            Object.defineProperty({}, 'x', {
                get: function () {
                }
            });
            canDefineProperty = true;
        } catch (x) {
        }
    }
    module.exports = canDefineProperty;
});
/*react@15.3.2#lib/ReactElement*/
define('react/lib/ReactElement', function (require, exports, module) {
    'use strict';
    var _assign = require('object-assign');
    var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
    var warning = require('fbjs/lib/warning');
    var canDefineProperty = require('react/lib/canDefineProperty');
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 60103;
    var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
    };
    var specialPropKeyWarningShown, specialPropRefWarningShown;
    function hasValidRef(config) {
        if (process.env.NODE_ENV !== 'production') {
            if (hasOwnProperty.call(config, 'ref')) {
                var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
                if (getter && getter.isReactWarning) {
                    return false;
                }
            }
        }
        return config.ref !== undefined;
    }
    function hasValidKey(config) {
        if (process.env.NODE_ENV !== 'production') {
            if (hasOwnProperty.call(config, 'key')) {
                var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
                if (getter && getter.isReactWarning) {
                    return false;
                }
            }
        }
        return config.key !== undefined;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        var warnAboutAccessingKey = function () {
            if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                process.env.NODE_ENV !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
            }
        };
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, 'key', {
            get: warnAboutAccessingKey,
            configurable: true
        });
    }
    function defineRefPropWarningGetter(props, displayName) {
        var warnAboutAccessingRef = function () {
            if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                process.env.NODE_ENV !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
            }
        };
        warnAboutAccessingRef.isReactWarning = true;
        Object.defineProperty(props, 'ref', {
            get: warnAboutAccessingRef,
            configurable: true
        });
    }
    var ReactElement = function (type, key, ref, self, source, owner, props) {
        var element = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            ref: ref,
            props: props,
            _owner: owner
        };
        if (process.env.NODE_ENV !== 'production') {
            element._store = {};
            var shadowChildren = Array.isArray(props.children) ? props.children.slice(0) : props.children;
            if (canDefineProperty) {
                Object.defineProperty(element._store, 'validated', {
                    configurable: false,
                    enumerable: false,
                    writable: true,
                    value: false
                });
                Object.defineProperty(element, '_self', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: self
                });
                Object.defineProperty(element, '_shadowChildren', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: shadowChildren
                });
                Object.defineProperty(element, '_source', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: source
                });
            } else {
                element._store.validated = false;
                element._self = self;
                element._shadowChildren = shadowChildren;
                element._source = source;
            }
            if (Object.freeze) {
                Object.freeze(element.props);
                Object.freeze(element);
            }
        }
        return element;
    };
    ReactElement.createElement = function (type, config, children) {
        var propName;
        var props = {};
        var key = null;
        var ref = null;
        var self = null;
        var source = null;
        if (config != null) {
            if (hasValidRef(config)) {
                ref = config.ref;
            }
            if (hasValidKey(config)) {
                key = '' + config.key;
            }
            self = config.__self === undefined ? null : config.__self;
            source = config.__source === undefined ? null : config.__source;
            for (propName in config) {
                if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                    props[propName] = config[propName];
                }
            }
        }
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
            props.children = children;
        } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
            }
            props.children = childArray;
        }
        if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
                if (props[propName] === undefined) {
                    props[propName] = defaultProps[propName];
                }
            }
        }
        if (process.env.NODE_ENV !== 'production') {
            if (key || ref) {
                if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
                    var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
                    if (key) {
                        defineKeyPropWarningGetter(props, displayName);
                    }
                    if (ref) {
                        defineRefPropWarningGetter(props, displayName);
                    }
                }
            }
        }
        return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
    };
    ReactElement.createFactory = function (type) {
        var factory = ReactElement.createElement.bind(null, type);
        factory.type = type;
        return factory;
    };
    ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
        var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
        return newElement;
    };
    ReactElement.cloneElement = function (element, config, children) {
        var propName;
        var props = _assign({}, element.props);
        var key = element.key;
        var ref = element.ref;
        var self = element._self;
        var source = element._source;
        var owner = element._owner;
        if (config != null) {
            if (hasValidRef(config)) {
                ref = config.ref;
                owner = ReactCurrentOwner.current;
            }
            if (hasValidKey(config)) {
                key = '' + config.key;
            }
            var defaultProps;
            if (element.type && element.type.defaultProps) {
                defaultProps = element.type.defaultProps;
            }
            for (propName in config) {
                if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                    if (config[propName] === undefined && defaultProps !== undefined) {
                        props[propName] = defaultProps[propName];
                    } else {
                        props[propName] = config[propName];
                    }
                }
            }
        }
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
            props.children = children;
        } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
            }
            props.children = childArray;
        }
        return ReactElement(element.type, key, ref, self, source, owner, props);
    };
    ReactElement.isValidElement = function (object) {
        return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    };
    ReactElement.REACT_ELEMENT_TYPE = REACT_ELEMENT_TYPE;
    module.exports = ReactElement;
});
/*react@15.3.2#lib/getIteratorFn*/
define('react/lib/getIteratorFn', function (require, exports, module) {
    (function (global) {
        'use strict';
        var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = '@@iterator';
        function getIteratorFn(maybeIterable) {
            var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
            if (typeof iteratorFn === 'function') {
                return iteratorFn;
            }
        }
        module.exports = getIteratorFn;
    }(function () {
        return this;
    }()));
});
/*react@15.3.2#lib/KeyEscapeUtils*/
define('react/lib/KeyEscapeUtils', function (require, exports, module) {
    'use strict';
    function escape(key) {
        var escapeRegex = /[=:]/g;
        var escaperLookup = {
            '=': '=0',
            ':': '=2'
        };
        var escapedString = ('' + key).replace(escapeRegex, function (match) {
            return escaperLookup[match];
        });
        return '$' + escapedString;
    }
    function unescape(key) {
        var unescapeRegex = /(=0|=2)/g;
        var unescaperLookup = {
            '=0': '=',
            '=2': ':'
        };
        var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);
        return ('' + keySubstring).replace(unescapeRegex, function (match) {
            return unescaperLookup[match];
        });
    }
    var KeyEscapeUtils = {
        escape: escape,
        unescape: unescape
    };
    module.exports = KeyEscapeUtils;
});
/*react@15.3.2#lib/traverseAllChildren*/
define('react/lib/traverseAllChildren', function (require, exports, module) {
    'use strict';
    var _prodInvariant = require('react/lib/reactProdInvariant');
    var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
    var ReactElement = require('react/lib/ReactElement');
    var getIteratorFn = require('react/lib/getIteratorFn');
    var invariant = require('fbjs/lib/invariant');
    var KeyEscapeUtils = require('react/lib/KeyEscapeUtils');
    var warning = require('fbjs/lib/warning');
    var SEPARATOR = '.';
    var SUBSEPARATOR = ':';
    var didWarnAboutMaps = false;
    function getComponentKey(component, index) {
        if (component && typeof component === 'object' && component.key != null) {
            return KeyEscapeUtils.escape(component.key);
        }
        return index.toString(36);
    }
    function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
        var type = typeof children;
        if (type === 'undefined' || type === 'boolean') {
            children = null;
        }
        if (children === null || type === 'string' || type === 'number' || ReactElement.isValidElement(children)) {
            callback(traverseContext, children, nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
            return 1;
        }
        var child;
        var nextName;
        var subtreeCount = 0;
        var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                nextName = nextNamePrefix + getComponentKey(child, i);
                subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
            }
        } else {
            var iteratorFn = getIteratorFn(children);
            if (iteratorFn) {
                var iterator = iteratorFn.call(children);
                var step;
                if (iteratorFn !== children.entries) {
                    var ii = 0;
                    while (!(step = iterator.next()).done) {
                        child = step.value;
                        nextName = nextNamePrefix + getComponentKey(child, ii++);
                        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
                    }
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        var mapsAsChildrenAddendum = '';
                        if (ReactCurrentOwner.current) {
                            var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
                            if (mapsAsChildrenOwnerName) {
                                mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
                            }
                        }
                        process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
                        didWarnAboutMaps = true;
                    }
                    while (!(step = iterator.next()).done) {
                        var entry = step.value;
                        if (entry) {
                            child = entry[1];
                            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
                            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
                        }
                    }
                }
            } else if (type === 'object') {
                var addendum = '';
                if (process.env.NODE_ENV !== 'production') {
                    addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
                    if (children._isReactElement) {
                        addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
                    }
                    if (ReactCurrentOwner.current) {
                        var name = ReactCurrentOwner.current.getName();
                        if (name) {
                            addendum += ' Check the render method of `' + name + '`.';
                        }
                    }
                }
                var childrenString = String(children);
                !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
            }
        }
        return subtreeCount;
    }
    function traverseAllChildren(children, callback, traverseContext) {
        if (children == null) {
            return 0;
        }
        return traverseAllChildrenImpl(children, '', callback, traverseContext);
    }
    module.exports = traverseAllChildren;
});
/*react@15.3.2#lib/ReactChildren*/
define('react/lib/ReactChildren', function (require, exports, module) {
    'use strict';
    var PooledClass = require('react/lib/PooledClass');
    var ReactElement = require('react/lib/ReactElement');
    var emptyFunction = require('fbjs/lib/emptyFunction');
    var traverseAllChildren = require('react/lib/traverseAllChildren');
    var twoArgumentPooler = PooledClass.twoArgumentPooler;
    var fourArgumentPooler = PooledClass.fourArgumentPooler;
    var userProvidedKeyEscapeRegex = /\/+/g;
    function escapeUserProvidedKey(text) {
        return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
    }
    function ForEachBookKeeping(forEachFunction, forEachContext) {
        this.func = forEachFunction;
        this.context = forEachContext;
        this.count = 0;
    }
    ForEachBookKeeping.prototype.destructor = function () {
        this.func = null;
        this.context = null;
        this.count = 0;
    };
    PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);
    function forEachSingleChild(bookKeeping, child, name) {
        var func = bookKeeping.func;
        var context = bookKeeping.context;
        func.call(context, child, bookKeeping.count++);
    }
    function forEachChildren(children, forEachFunc, forEachContext) {
        if (children == null) {
            return children;
        }
        var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
        traverseAllChildren(children, forEachSingleChild, traverseContext);
        ForEachBookKeeping.release(traverseContext);
    }
    function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
        this.result = mapResult;
        this.keyPrefix = keyPrefix;
        this.func = mapFunction;
        this.context = mapContext;
        this.count = 0;
    }
    MapBookKeeping.prototype.destructor = function () {
        this.result = null;
        this.keyPrefix = null;
        this.func = null;
        this.context = null;
        this.count = 0;
    };
    PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);
    function mapSingleChildIntoContext(bookKeeping, child, childKey) {
        var result = bookKeeping.result;
        var keyPrefix = bookKeeping.keyPrefix;
        var func = bookKeeping.func;
        var context = bookKeeping.context;
        var mappedChild = func.call(context, child, bookKeeping.count++);
        if (Array.isArray(mappedChild)) {
            mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
        } else if (mappedChild != null) {
            if (ReactElement.isValidElement(mappedChild)) {
                mappedChild = ReactElement.cloneAndReplaceKey(mappedChild, keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
            }
            result.push(mappedChild);
        }
    }
    function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
        var escapedPrefix = '';
        if (prefix != null) {
            escapedPrefix = escapeUserProvidedKey(prefix) + '/';
        }
        var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
        traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
        MapBookKeeping.release(traverseContext);
    }
    function mapChildren(children, func, context) {
        if (children == null) {
            return children;
        }
        var result = [];
        mapIntoWithKeyPrefixInternal(children, result, null, func, context);
        return result;
    }
    function forEachSingleChildDummy(traverseContext, child, name) {
        return null;
    }
    function countChildren(children, context) {
        return traverseAllChildren(children, forEachSingleChildDummy, null);
    }
    function toArray(children) {
        var result = [];
        mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
        return result;
    }
    var ReactChildren = {
        forEach: forEachChildren,
        map: mapChildren,
        mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
        count: countChildren,
        toArray: toArray
    };
    module.exports = ReactChildren;
});
/*react@15.3.2#lib/ReactNoopUpdateQueue*/
define('react/lib/ReactNoopUpdateQueue', function (require, exports, module) {
    'use strict';
    var warning = require('fbjs/lib/warning');
    function warnNoop(publicInstance, callerName) {
        if (process.env.NODE_ENV !== 'production') {
            var constructor = publicInstance.constructor;
            process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
        }
    }
    var ReactNoopUpdateQueue = {
        isMounted: function (publicInstance) {
            return false;
        },
        enqueueCallback: function (publicInstance, callback) {
        },
        enqueueForceUpdate: function (publicInstance) {
            warnNoop(publicInstance, 'forceUpdate');
        },
        enqueueReplaceState: function (publicInstance, completeState) {
            warnNoop(publicInstance, 'replaceState');
        },
        enqueueSetState: function (publicInstance, partialState) {
            warnNoop(publicInstance, 'setState');
        }
    };
    module.exports = ReactNoopUpdateQueue;
});
/*fbjs@0.8.5#lib/emptyObject*/
define('fbjs/lib/emptyObject', function (require, exports, module) {
    'use strict';
    var emptyObject = {};
    if (process.env.NODE_ENV !== 'production') {
        Object.freeze(emptyObject);
    }
    module.exports = emptyObject;
});
/*react@15.3.2#lib/ReactComponent*/
define('react/lib/ReactComponent', function (require, exports, module) {
    'use strict';
    var _prodInvariant = require('react/lib/reactProdInvariant');
    var ReactNoopUpdateQueue = require('react/lib/ReactNoopUpdateQueue');
    var canDefineProperty = require('react/lib/canDefineProperty');
    var emptyObject = require('fbjs/lib/emptyObject');
    var invariant = require('fbjs/lib/invariant');
    var warning = require('fbjs/lib/warning');
    function ReactComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
    }
    ReactComponent.prototype.isReactComponent = {};
    ReactComponent.prototype.setState = function (partialState, callback) {
        !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
        this.updater.enqueueSetState(this, partialState);
        if (callback) {
            this.updater.enqueueCallback(this, callback, 'setState');
        }
    };
    ReactComponent.prototype.forceUpdate = function (callback) {
        this.updater.enqueueForceUpdate(this);
        if (callback) {
            this.updater.enqueueCallback(this, callback, 'forceUpdate');
        }
    };
    if (process.env.NODE_ENV !== 'production') {
        var deprecatedAPIs = {
            isMounted: [
                'isMounted',
                'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'
            ],
            replaceState: [
                'replaceState',
                'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).'
            ]
        };
        var defineDeprecationWarning = function (methodName, info) {
            if (canDefineProperty) {
                Object.defineProperty(ReactComponent.prototype, methodName, {
                    get: function () {
                        process.env.NODE_ENV !== 'production' ? warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
                        return undefined;
                    }
                });
            }
        };
        for (var fnName in deprecatedAPIs) {
            if (deprecatedAPIs.hasOwnProperty(fnName)) {
                defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
            }
        }
    }
    module.exports = ReactComponent;
});
/*react@15.3.2#lib/ReactPureComponent*/
define('react/lib/ReactPureComponent', function (require, exports, module) {
    'use strict';
    var _assign = require('object-assign');
    var ReactComponent = require('react/lib/ReactComponent');
    var ReactNoopUpdateQueue = require('react/lib/ReactNoopUpdateQueue');
    var emptyObject = require('fbjs/lib/emptyObject');
    function ReactPureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
    }
    function ComponentDummy() {
    }
    ComponentDummy.prototype = ReactComponent.prototype;
    ReactPureComponent.prototype = new ComponentDummy();
    ReactPureComponent.prototype.constructor = ReactPureComponent;
    _assign(ReactPureComponent.prototype, ReactComponent.prototype);
    ReactPureComponent.prototype.isPureReactComponent = true;
    module.exports = ReactPureComponent;
});
/*fbjs@0.8.5#lib/keyMirror*/
define('fbjs/lib/keyMirror', function (require, exports, module) {
    'use strict';
    var invariant = require('fbjs/lib/invariant');
    var keyMirror = function keyMirror(obj) {
        var ret = {};
        var key;
        !(obj instanceof Object && !Array.isArray(obj)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'keyMirror(...): Argument must be an object.') : invariant(false) : void 0;
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            ret[key] = key;
        }
        return ret;
    };
    module.exports = keyMirror;
});
/*react@15.3.2#lib/ReactPropTypeLocations*/
define('react/lib/ReactPropTypeLocations', function (require, exports, module) {
    'use strict';
    var keyMirror = require('fbjs/lib/keyMirror');
    var ReactPropTypeLocations = keyMirror({
        prop: null,
        context: null,
        childContext: null
    });
    module.exports = ReactPropTypeLocations;
});
/*react@15.3.2#lib/ReactPropTypeLocationNames*/
define('react/lib/ReactPropTypeLocationNames', function (require, exports, module) {
    'use strict';
    var ReactPropTypeLocationNames = {};
    if (process.env.NODE_ENV !== 'production') {
        ReactPropTypeLocationNames = {
            prop: 'prop',
            context: 'context',
            childContext: 'child context'
        };
    }
    module.exports = ReactPropTypeLocationNames;
});
/*fbjs@0.8.5#lib/keyOf*/
define('fbjs/lib/keyOf', function (require, exports, module) {
    'use strict';
    var keyOf = function keyOf(oneKeyObj) {
        var key;
        for (key in oneKeyObj) {
            if (!oneKeyObj.hasOwnProperty(key)) {
                continue;
            }
            return key;
        }
        return null;
    };
    module.exports = keyOf;
});
/*react@15.3.2#lib/ReactClass*/
define('react/lib/ReactClass', function (require, exports, module) {
    'use strict';
    var _prodInvariant = require('react/lib/reactProdInvariant'), _assign = require('object-assign');
    var ReactComponent = require('react/lib/ReactComponent');
    var ReactElement = require('react/lib/ReactElement');
    var ReactPropTypeLocations = require('react/lib/ReactPropTypeLocations');
    var ReactPropTypeLocationNames = require('react/lib/ReactPropTypeLocationNames');
    var ReactNoopUpdateQueue = require('react/lib/ReactNoopUpdateQueue');
    var emptyObject = require('fbjs/lib/emptyObject');
    var invariant = require('fbjs/lib/invariant');
    var keyMirror = require('fbjs/lib/keyMirror');
    var keyOf = require('fbjs/lib/keyOf');
    var warning = require('fbjs/lib/warning');
    var MIXINS_KEY = keyOf({ mixins: null });
    var SpecPolicy = keyMirror({
        DEFINE_ONCE: null,
        DEFINE_MANY: null,
        OVERRIDE_BASE: null,
        DEFINE_MANY_MERGED: null
    });
    var injectedMixins = [];
    var ReactClassInterface = {
        mixins: SpecPolicy.DEFINE_MANY,
        statics: SpecPolicy.DEFINE_MANY,
        propTypes: SpecPolicy.DEFINE_MANY,
        contextTypes: SpecPolicy.DEFINE_MANY,
        childContextTypes: SpecPolicy.DEFINE_MANY,
        getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,
        getInitialState: SpecPolicy.DEFINE_MANY_MERGED,
        getChildContext: SpecPolicy.DEFINE_MANY_MERGED,
        render: SpecPolicy.DEFINE_ONCE,
        componentWillMount: SpecPolicy.DEFINE_MANY,
        componentDidMount: SpecPolicy.DEFINE_MANY,
        componentWillReceiveProps: SpecPolicy.DEFINE_MANY,
        shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,
        componentWillUpdate: SpecPolicy.DEFINE_MANY,
        componentDidUpdate: SpecPolicy.DEFINE_MANY,
        componentWillUnmount: SpecPolicy.DEFINE_MANY,
        updateComponent: SpecPolicy.OVERRIDE_BASE
    };
    var RESERVED_SPEC_KEYS = {
        displayName: function (Constructor, displayName) {
            Constructor.displayName = displayName;
        },
        mixins: function (Constructor, mixins) {
            if (mixins) {
                for (var i = 0; i < mixins.length; i++) {
                    mixSpecIntoComponent(Constructor, mixins[i]);
                }
            }
        },
        childContextTypes: function (Constructor, childContextTypes) {
            if (process.env.NODE_ENV !== 'production') {
                validateTypeDef(Constructor, childContextTypes, ReactPropTypeLocations.childContext);
            }
            Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, childContextTypes);
        },
        contextTypes: function (Constructor, contextTypes) {
            if (process.env.NODE_ENV !== 'production') {
                validateTypeDef(Constructor, contextTypes, ReactPropTypeLocations.context);
            }
            Constructor.contextTypes = _assign({}, Constructor.contextTypes, contextTypes);
        },
        getDefaultProps: function (Constructor, getDefaultProps) {
            if (Constructor.getDefaultProps) {
                Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
            } else {
                Constructor.getDefaultProps = getDefaultProps;
            }
        },
        propTypes: function (Constructor, propTypes) {
            if (process.env.NODE_ENV !== 'production') {
                validateTypeDef(Constructor, propTypes, ReactPropTypeLocations.prop);
            }
            Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
        },
        statics: function (Constructor, statics) {
            mixStaticSpecIntoComponent(Constructor, statics);
        },
        autobind: function () {
        }
    };
    function validateTypeDef(Constructor, typeDef, location) {
        for (var propName in typeDef) {
            if (typeDef.hasOwnProperty(propName)) {
                process.env.NODE_ENV !== 'production' ? warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
            }
        }
    }
    function validateMethodOverride(isAlreadyDefined, name) {
        var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;
        if (ReactClassMixin.hasOwnProperty(name)) {
            !(specPolicy === SpecPolicy.OVERRIDE_BASE) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', name) : _prodInvariant('73', name) : void 0;
        }
        if (isAlreadyDefined) {
            !(specPolicy === SpecPolicy.DEFINE_MANY || specPolicy === SpecPolicy.DEFINE_MANY_MERGED) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('74', name) : void 0;
        }
    }
    function mixSpecIntoComponent(Constructor, spec) {
        if (!spec) {
            if (process.env.NODE_ENV !== 'production') {
                var typeofSpec = typeof spec;
                var isMixinValid = typeofSpec === 'object' && spec !== null;
                process.env.NODE_ENV !== 'production' ? warning(isMixinValid, '%s: You\'re attempting to include a mixin that is either null ' + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec) : void 0;
            }
            return;
        }
        !(typeof spec !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component class or function as a mixin. Instead, just use a regular object.') : _prodInvariant('75') : void 0;
        !!ReactElement.isValidElement(spec) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component as a mixin. Instead, just use a regular object.') : _prodInvariant('76') : void 0;
        var proto = Constructor.prototype;
        var autoBindPairs = proto.__reactAutoBindPairs;
        if (spec.hasOwnProperty(MIXINS_KEY)) {
            RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
        }
        for (var name in spec) {
            if (!spec.hasOwnProperty(name)) {
                continue;
            }
            if (name === MIXINS_KEY) {
                continue;
            }
            var property = spec[name];
            var isAlreadyDefined = proto.hasOwnProperty(name);
            validateMethodOverride(isAlreadyDefined, name);
            if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
                RESERVED_SPEC_KEYS[name](Constructor, property);
            } else {
                var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
                var isFunction = typeof property === 'function';
                var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;
                if (shouldAutoBind) {
                    autoBindPairs.push(name, property);
                    proto[name] = property;
                } else {
                    if (isAlreadyDefined) {
                        var specPolicy = ReactClassInterface[name];
                        !(isReactClassMethod && (specPolicy === SpecPolicy.DEFINE_MANY_MERGED || specPolicy === SpecPolicy.DEFINE_MANY)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.', specPolicy, name) : _prodInvariant('77', specPolicy, name) : void 0;
                        if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
                            proto[name] = createMergedResultFunction(proto[name], property);
                        } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
                            proto[name] = createChainedFunction(proto[name], property);
                        }
                    } else {
                        proto[name] = property;
                        if (process.env.NODE_ENV !== 'production') {
                            if (typeof property === 'function' && spec.displayName) {
                                proto[name].displayName = spec.displayName + '_' + name;
                            }
                        }
                    }
                }
            }
        }
    }
    function mixStaticSpecIntoComponent(Constructor, statics) {
        if (!statics) {
            return;
        }
        for (var name in statics) {
            var property = statics[name];
            if (!statics.hasOwnProperty(name)) {
                continue;
            }
            var isReserved = name in RESERVED_SPEC_KEYS;
            !!isReserved ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', name) : _prodInvariant('78', name) : void 0;
            var isInherited = name in Constructor;
            !!isInherited ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('79', name) : void 0;
            Constructor[name] = property;
        }
    }
    function mergeIntoWithNoDuplicateKeys(one, two) {
        !(one && two && typeof one === 'object' && typeof two === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.') : _prodInvariant('80') : void 0;
        for (var key in two) {
            if (two.hasOwnProperty(key)) {
                !(one[key] === undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.', key) : _prodInvariant('81', key) : void 0;
                one[key] = two[key];
            }
        }
        return one;
    }
    function createMergedResultFunction(one, two) {
        return function mergedResult() {
            var a = one.apply(this, arguments);
            var b = two.apply(this, arguments);
            if (a == null) {
                return b;
            } else if (b == null) {
                return a;
            }
            var c = {};
            mergeIntoWithNoDuplicateKeys(c, a);
            mergeIntoWithNoDuplicateKeys(c, b);
            return c;
        };
    }
    function createChainedFunction(one, two) {
        return function chainedFunction() {
            one.apply(this, arguments);
            two.apply(this, arguments);
        };
    }
    function bindAutoBindMethod(component, method) {
        var boundMethod = method.bind(component);
        if (process.env.NODE_ENV !== 'production') {
            boundMethod.__reactBoundContext = component;
            boundMethod.__reactBoundMethod = method;
            boundMethod.__reactBoundArguments = null;
            var componentName = component.constructor.displayName;
            var _bind = boundMethod.bind;
            boundMethod.bind = function (newThis) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }
                if (newThis !== component && newThis !== null) {
                    process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
                } else if (!args.length) {
                    process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
                    return boundMethod;
                }
                var reboundMethod = _bind.apply(boundMethod, arguments);
                reboundMethod.__reactBoundContext = component;
                reboundMethod.__reactBoundMethod = method;
                reboundMethod.__reactBoundArguments = args;
                return reboundMethod;
            };
        }
        return boundMethod;
    }
    function bindAutoBindMethods(component) {
        var pairs = component.__reactAutoBindPairs;
        for (var i = 0; i < pairs.length; i += 2) {
            var autoBindKey = pairs[i];
            var method = pairs[i + 1];
            component[autoBindKey] = bindAutoBindMethod(component, method);
        }
    }
    var ReactClassMixin = {
        replaceState: function (newState, callback) {
            this.updater.enqueueReplaceState(this, newState);
            if (callback) {
                this.updater.enqueueCallback(this, callback, 'replaceState');
            }
        },
        isMounted: function () {
            return this.updater.isMounted(this);
        }
    };
    var ReactClassComponent = function () {
    };
    _assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);
    var ReactClass = {
        createClass: function (spec) {
            var Constructor = function (props, context, updater) {
                if (process.env.NODE_ENV !== 'production') {
                    process.env.NODE_ENV !== 'production' ? warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
                }
                if (this.__reactAutoBindPairs.length) {
                    bindAutoBindMethods(this);
                }
                this.props = props;
                this.context = context;
                this.refs = emptyObject;
                this.updater = updater || ReactNoopUpdateQueue;
                this.state = null;
                var initialState = this.getInitialState ? this.getInitialState() : null;
                if (process.env.NODE_ENV !== 'production') {
                    if (initialState === undefined && this.getInitialState._isMockFunction) {
                        initialState = null;
                    }
                }
                !(typeof initialState === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent') : _prodInvariant('82', Constructor.displayName || 'ReactCompositeComponent') : void 0;
                this.state = initialState;
            };
            Constructor.prototype = new ReactClassComponent();
            Constructor.prototype.constructor = Constructor;
            Constructor.prototype.__reactAutoBindPairs = [];
            injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));
            mixSpecIntoComponent(Constructor, spec);
            if (Constructor.getDefaultProps) {
                Constructor.defaultProps = Constructor.getDefaultProps();
            }
            if (process.env.NODE_ENV !== 'production') {
                if (Constructor.getDefaultProps) {
                    Constructor.getDefaultProps.isReactClassApproved = {};
                }
                if (Constructor.prototype.getInitialState) {
                    Constructor.prototype.getInitialState.isReactClassApproved = {};
                }
            }
            !Constructor.prototype.render ? process.env.NODE_ENV !== 'production' ? invariant(false, 'createClass(...): Class specification must implement a `render` method.') : _prodInvariant('83') : void 0;
            if (process.env.NODE_ENV !== 'production') {
                process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
                process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
            }
            for (var methodName in ReactClassInterface) {
                if (!Constructor.prototype[methodName]) {
                    Constructor.prototype[methodName] = null;
                }
            }
            return Constructor;
        },
        injection: {
            injectMixin: function (mixin) {
                injectedMixins.push(mixin);
            }
        }
    };
    module.exports = ReactClass;
});
/*react@15.3.2#lib/ReactComponentTreeHook*/
define('react/lib/ReactComponentTreeHook', function (require, exports, module) {
    'use strict';
    var _prodInvariant = require('react/lib/reactProdInvariant');
    var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
    var invariant = require('fbjs/lib/invariant');
    var warning = require('fbjs/lib/warning');
    function isNative(fn) {
        var funcToString = Function.prototype.toString;
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
        try {
            var source = funcToString.call(fn);
            return reIsNative.test(source);
        } catch (err) {
            return false;
        }
    }
    var canUseCollections = typeof Array.from === 'function' && typeof Map === 'function' && isNative(Map) && Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) && typeof Set === 'function' && isNative(Set) && Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);
    var itemMap;
    var rootIDSet;
    var itemByKey;
    var rootByKey;
    if (canUseCollections) {
        itemMap = new Map();
        rootIDSet = new Set();
    } else {
        itemByKey = {};
        rootByKey = {};
    }
    var unmountedIDs = [];
    function getKeyFromID(id) {
        return '.' + id;
    }
    function getIDFromKey(key) {
        return parseInt(key.substr(1), 10);
    }
    function get(id) {
        if (canUseCollections) {
            return itemMap.get(id);
        } else {
            var key = getKeyFromID(id);
            return itemByKey[key];
        }
    }
    function remove(id) {
        if (canUseCollections) {
            itemMap['delete'](id);
        } else {
            var key = getKeyFromID(id);
            delete itemByKey[key];
        }
    }
    function create(id, element, parentID) {
        var item = {
            element: element,
            parentID: parentID,
            text: null,
            childIDs: [],
            isMounted: false,
            updateCount: 0
        };
        if (canUseCollections) {
            itemMap.set(id, item);
        } else {
            var key = getKeyFromID(id);
            itemByKey[key] = item;
        }
    }
    function addRoot(id) {
        if (canUseCollections) {
            rootIDSet.add(id);
        } else {
            var key = getKeyFromID(id);
            rootByKey[key] = true;
        }
    }
    function removeRoot(id) {
        if (canUseCollections) {
            rootIDSet['delete'](id);
        } else {
            var key = getKeyFromID(id);
            delete rootByKey[key];
        }
    }
    function getRegisteredIDs() {
        if (canUseCollections) {
            return Array.from(itemMap.keys());
        } else {
            return Object.keys(itemByKey).map(getIDFromKey);
        }
    }
    function getRootIDs() {
        if (canUseCollections) {
            return Array.from(rootIDSet.keys());
        } else {
            return Object.keys(rootByKey).map(getIDFromKey);
        }
    }
    function purgeDeep(id) {
        var item = get(id);
        if (item) {
            var childIDs = item.childIDs;
            remove(id);
            childIDs.forEach(purgeDeep);
        }
    }
    function describeComponentFrame(name, source, ownerName) {
        return '\n    in ' + name + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
    }
    function getDisplayName(element) {
        if (element == null) {
            return '#empty';
        } else if (typeof element === 'string' || typeof element === 'number') {
            return '#text';
        } else if (typeof element.type === 'string') {
            return element.type;
        } else {
            return element.type.displayName || element.type.name || 'Unknown';
        }
    }
    function describeID(id) {
        var name = ReactComponentTreeHook.getDisplayName(id);
        var element = ReactComponentTreeHook.getElement(id);
        var ownerID = ReactComponentTreeHook.getOwnerID(id);
        var ownerName;
        if (ownerID) {
            ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
        }
        process.env.NODE_ENV !== 'production' ? warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
        return describeComponentFrame(name, element && element._source, ownerName);
    }
    var ReactComponentTreeHook = {
        onSetChildren: function (id, nextChildIDs) {
            var item = get(id);
            item.childIDs = nextChildIDs;
            for (var i = 0; i < nextChildIDs.length; i++) {
                var nextChildID = nextChildIDs[i];
                var nextChild = get(nextChildID);
                !nextChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('140') : void 0;
                !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant('141') : void 0;
                !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
                if (nextChild.parentID == null) {
                    nextChild.parentID = id;
                }
                !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('142', nextChildID, nextChild.parentID, id) : void 0;
            }
        },
        onBeforeMountComponent: function (id, element, parentID) {
            create(id, element, parentID);
        },
        onBeforeUpdateComponent: function (id, element) {
            var item = get(id);
            if (!item || !item.isMounted) {
                return;
            }
            item.element = element;
        },
        onMountComponent: function (id) {
            var item = get(id);
            item.isMounted = true;
            var isRoot = item.parentID === 0;
            if (isRoot) {
                addRoot(id);
            }
        },
        onUpdateComponent: function (id) {
            var item = get(id);
            if (!item || !item.isMounted) {
                return;
            }
            item.updateCount++;
        },
        onUnmountComponent: function (id) {
            var item = get(id);
            if (item) {
                item.isMounted = false;
                var isRoot = item.parentID === 0;
                if (isRoot) {
                    removeRoot(id);
                }
            }
            unmountedIDs.push(id);
        },
        purgeUnmountedComponents: function () {
            if (ReactComponentTreeHook._preventPurging) {
                return;
            }
            for (var i = 0; i < unmountedIDs.length; i++) {
                var id = unmountedIDs[i];
                purgeDeep(id);
            }
            unmountedIDs.length = 0;
        },
        isMounted: function (id) {
            var item = get(id);
            return item ? item.isMounted : false;
        },
        getCurrentStackAddendum: function (topElement) {
            var info = '';
            if (topElement) {
                var type = topElement.type;
                var name = typeof type === 'function' ? type.displayName || type.name : type;
                var owner = topElement._owner;
                info += describeComponentFrame(name || 'Unknown', topElement._source, owner && owner.getName());
            }
            var currentOwner = ReactCurrentOwner.current;
            var id = currentOwner && currentOwner._debugID;
            info += ReactComponentTreeHook.getStackAddendumByID(id);
            return info;
        },
        getStackAddendumByID: function (id) {
            var info = '';
            while (id) {
                info += describeID(id);
                id = ReactComponentTreeHook.getParentID(id);
            }
            return info;
        },
        getChildIDs: function (id) {
            var item = get(id);
            return item ? item.childIDs : [];
        },
        getDisplayName: function (id) {
            var element = ReactComponentTreeHook.getElement(id);
            if (!element) {
                return null;
            }
            return getDisplayName(element);
        },
        getElement: function (id) {
            var item = get(id);
            return item ? item.element : null;
        },
        getOwnerID: function (id) {
            var element = ReactComponentTreeHook.getElement(id);
            if (!element || !element._owner) {
                return null;
            }
            return element._owner._debugID;
        },
        getParentID: function (id) {
            var item = get(id);
            return item ? item.parentID : null;
        },
        getSource: function (id) {
            var item = get(id);
            var element = item ? item.element : null;
            var source = element != null ? element._source : null;
            return source;
        },
        getText: function (id) {
            var element = ReactComponentTreeHook.getElement(id);
            if (typeof element === 'string') {
                return element;
            } else if (typeof element === 'number') {
                return '' + element;
            } else {
                return null;
            }
        },
        getUpdateCount: function (id) {
            var item = get(id);
            return item ? item.updateCount : 0;
        },
        getRegisteredIDs: getRegisteredIDs,
        getRootIDs: getRootIDs
    };
    module.exports = ReactComponentTreeHook;
});
/*react@15.3.2#lib/ReactPropTypesSecret*/
define('react/lib/ReactPropTypesSecret', function (require, exports, module) {
    'use strict';
    var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
    module.exports = ReactPropTypesSecret;
});
/*react@15.3.2#lib/checkReactTypeSpec*/
define('react/lib/checkReactTypeSpec', function (require, exports, module) {
    'use strict';
    var _prodInvariant = require('react/lib/reactProdInvariant');
    var ReactPropTypeLocationNames = require('react/lib/ReactPropTypeLocationNames');
    var ReactPropTypesSecret = require('react/lib/ReactPropTypesSecret');
    var invariant = require('fbjs/lib/invariant');
    var warning = require('fbjs/lib/warning');
    var ReactComponentTreeHook;
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
        ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
    }
    var loggedTypeFailures = {};
    function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
        for (var typeSpecName in typeSpecs) {
            if (typeSpecs.hasOwnProperty(typeSpecName)) {
                var error;
                try {
                    !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
                    error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
                } catch (ex) {
                    error = ex;
                }
                process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
                if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                    loggedTypeFailures[error.message] = true;
                    var componentStackInfo = '';
                    if (process.env.NODE_ENV !== 'production') {
                        if (!ReactComponentTreeHook) {
                            ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
                        }
                        if (debugID !== null) {
                            componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
                        } else if (element !== null) {
                            componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
                        }
                    }
                    process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
                }
            }
        }
    }
    module.exports = checkReactTypeSpec;
});
/*react@15.3.2#lib/ReactElementValidator*/
define('react/lib/ReactElementValidator', function (require, exports, module) {
    'use strict';
    var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
    var ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
    var ReactElement = require('react/lib/ReactElement');
    var ReactPropTypeLocations = require('react/lib/ReactPropTypeLocations');
    var checkReactTypeSpec = require('react/lib/checkReactTypeSpec');
    var canDefineProperty = require('react/lib/canDefineProperty');
    var getIteratorFn = require('react/lib/getIteratorFn');
    var warning = require('fbjs/lib/warning');
    function getDeclarationErrorAddendum() {
        if (ReactCurrentOwner.current) {
            var name = ReactCurrentOwner.current.getName();
            if (name) {
                return ' Check the render method of `' + name + '`.';
            }
        }
        return '';
    }
    var ownerHasKeyUseWarning = {};
    function getCurrentComponentErrorInfo(parentType) {
        var info = getDeclarationErrorAddendum();
        if (!info) {
            var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
                info = ' Check the top-level render call using <' + parentName + '>.';
            }
        }
        return info;
    }
    function validateExplicitKey(element, parentType) {
        if (!element._store || element._store.validated || element.key != null) {
            return;
        }
        element._store.validated = true;
        var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});
        var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
        if (memoizer[currentComponentErrorInfo]) {
            return;
        }
        memoizer[currentComponentErrorInfo] = true;
        var childOwner = '';
        if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
            childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
        }
        process.env.NODE_ENV !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
    }
    function validateChildKeys(node, parentType) {
        if (typeof node !== 'object') {
            return;
        }
        if (Array.isArray(node)) {
            for (var i = 0; i < node.length; i++) {
                var child = node[i];
                if (ReactElement.isValidElement(child)) {
                    validateExplicitKey(child, parentType);
                }
            }
        } else if (ReactElement.isValidElement(node)) {
            if (node._store) {
                node._store.validated = true;
            }
        } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (iteratorFn) {
                if (iteratorFn !== node.entries) {
                    var iterator = iteratorFn.call(node);
                    var step;
                    while (!(step = iterator.next()).done) {
                        if (ReactElement.isValidElement(step.value)) {
                            validateExplicitKey(step.value, parentType);
                        }
                    }
                }
            }
        }
    }
    function validatePropTypes(element) {
        var componentClass = element.type;
        if (typeof componentClass !== 'function') {
            return;
        }
        var name = componentClass.displayName || componentClass.name;
        if (componentClass.propTypes) {
            checkReactTypeSpec(componentClass.propTypes, element.props, ReactPropTypeLocations.prop, name, element, null);
        }
        if (typeof componentClass.getDefaultProps === 'function') {
            process.env.NODE_ENV !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
        }
    }
    var ReactElementValidator = {
        createElement: function (type, props, children) {
            var validType = typeof type === 'string' || typeof type === 'function';
            if (!validType) {
                process.env.NODE_ENV !== 'production' ? warning(false, 'React.createElement: type should not be null, undefined, boolean, or ' + 'number. It should be a string (for DOM elements) or a ReactClass ' + '(for composite components).%s', getDeclarationErrorAddendum()) : void 0;
            }
            var element = ReactElement.createElement.apply(this, arguments);
            if (element == null) {
                return element;
            }
            if (validType) {
                for (var i = 2; i < arguments.length; i++) {
                    validateChildKeys(arguments[i], type);
                }
            }
            validatePropTypes(element);
            return element;
        },
        createFactory: function (type) {
            var validatedFactory = ReactElementValidator.createElement.bind(null, type);
            validatedFactory.type = type;
            if (process.env.NODE_ENV !== 'production') {
                if (canDefineProperty) {
                    Object.defineProperty(validatedFactory, 'type', {
                        enumerable: false,
                        get: function () {
                            process.env.NODE_ENV !== 'production' ? warning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : void 0;
                            Object.defineProperty(this, 'type', { value: type });
                            return type;
                        }
                    });
                }
            }
            return validatedFactory;
        },
        cloneElement: function (element, props, children) {
            var newElement = ReactElement.cloneElement.apply(this, arguments);
            for (var i = 2; i < arguments.length; i++) {
                validateChildKeys(arguments[i], newElement.type);
            }
            validatePropTypes(newElement);
            return newElement;
        }
    };
    module.exports = ReactElementValidator;
});
/*react@15.3.2#lib/ReactDOMFactories*/
define('react/lib/ReactDOMFactories', function (require, exports, module) {
    'use strict';
    var ReactElement = require('react/lib/ReactElement');
    var createDOMFactory = ReactElement.createFactory;
    if (process.env.NODE_ENV !== 'production') {
        var ReactElementValidator = require('react/lib/ReactElementValidator');
        createDOMFactory = ReactElementValidator.createFactory;
    }
    var ReactDOMFactories = {
        a: createDOMFactory('a'),
        abbr: createDOMFactory('abbr'),
        address: createDOMFactory('address'),
        area: createDOMFactory('area'),
        article: createDOMFactory('article'),
        aside: createDOMFactory('aside'),
        audio: createDOMFactory('audio'),
        b: createDOMFactory('b'),
        base: createDOMFactory('base'),
        bdi: createDOMFactory('bdi'),
        bdo: createDOMFactory('bdo'),
        big: createDOMFactory('big'),
        blockquote: createDOMFactory('blockquote'),
        body: createDOMFactory('body'),
        br: createDOMFactory('br'),
        button: createDOMFactory('button'),
        canvas: createDOMFactory('canvas'),
        caption: createDOMFactory('caption'),
        cite: createDOMFactory('cite'),
        code: createDOMFactory('code'),
        col: createDOMFactory('col'),
        colgroup: createDOMFactory('colgroup'),
        data: createDOMFactory('data'),
        datalist: createDOMFactory('datalist'),
        dd: createDOMFactory('dd'),
        del: createDOMFactory('del'),
        details: createDOMFactory('details'),
        dfn: createDOMFactory('dfn'),
        dialog: createDOMFactory('dialog'),
        div: createDOMFactory('div'),
        dl: createDOMFactory('dl'),
        dt: createDOMFactory('dt'),
        em: createDOMFactory('em'),
        embed: createDOMFactory('embed'),
        fieldset: createDOMFactory('fieldset'),
        figcaption: createDOMFactory('figcaption'),
        figure: createDOMFactory('figure'),
        footer: createDOMFactory('footer'),
        form: createDOMFactory('form'),
        h1: createDOMFactory('h1'),
        h2: createDOMFactory('h2'),
        h3: createDOMFactory('h3'),
        h4: createDOMFactory('h4'),
        h5: createDOMFactory('h5'),
        h6: createDOMFactory('h6'),
        head: createDOMFactory('head'),
        header: createDOMFactory('header'),
        hgroup: createDOMFactory('hgroup'),
        hr: createDOMFactory('hr'),
        html: createDOMFactory('html'),
        i: createDOMFactory('i'),
        iframe: createDOMFactory('iframe'),
        img: createDOMFactory('img'),
        input: createDOMFactory('input'),
        ins: createDOMFactory('ins'),
        kbd: createDOMFactory('kbd'),
        keygen: createDOMFactory('keygen'),
        label: createDOMFactory('label'),
        legend: createDOMFactory('legend'),
        li: createDOMFactory('li'),
        link: createDOMFactory('link'),
        main: createDOMFactory('main'),
        map: createDOMFactory('map'),
        mark: createDOMFactory('mark'),
        menu: createDOMFactory('menu'),
        menuitem: createDOMFactory('menuitem'),
        meta: createDOMFactory('meta'),
        meter: createDOMFactory('meter'),
        nav: createDOMFactory('nav'),
        noscript: createDOMFactory('noscript'),
        object: createDOMFactory('object'),
        ol: createDOMFactory('ol'),
        optgroup: createDOMFactory('optgroup'),
        option: createDOMFactory('option'),
        output: createDOMFactory('output'),
        p: createDOMFactory('p'),
        param: createDOMFactory('param'),
        picture: createDOMFactory('picture'),
        pre: createDOMFactory('pre'),
        progress: createDOMFactory('progress'),
        q: createDOMFactory('q'),
        rp: createDOMFactory('rp'),
        rt: createDOMFactory('rt'),
        ruby: createDOMFactory('ruby'),
        s: createDOMFactory('s'),
        samp: createDOMFactory('samp'),
        script: createDOMFactory('script'),
        section: createDOMFactory('section'),
        select: createDOMFactory('select'),
        small: createDOMFactory('small'),
        source: createDOMFactory('source'),
        span: createDOMFactory('span'),
        strong: createDOMFactory('strong'),
        style: createDOMFactory('style'),
        sub: createDOMFactory('sub'),
        summary: createDOMFactory('summary'),
        sup: createDOMFactory('sup'),
        table: createDOMFactory('table'),
        tbody: createDOMFactory('tbody'),
        td: createDOMFactory('td'),
        textarea: createDOMFactory('textarea'),
        tfoot: createDOMFactory('tfoot'),
        th: createDOMFactory('th'),
        thead: createDOMFactory('thead'),
        time: createDOMFactory('time'),
        title: createDOMFactory('title'),
        tr: createDOMFactory('tr'),
        track: createDOMFactory('track'),
        u: createDOMFactory('u'),
        ul: createDOMFactory('ul'),
        'var': createDOMFactory('var'),
        video: createDOMFactory('video'),
        wbr: createDOMFactory('wbr'),
        circle: createDOMFactory('circle'),
        clipPath: createDOMFactory('clipPath'),
        defs: createDOMFactory('defs'),
        ellipse: createDOMFactory('ellipse'),
        g: createDOMFactory('g'),
        image: createDOMFactory('image'),
        line: createDOMFactory('line'),
        linearGradient: createDOMFactory('linearGradient'),
        mask: createDOMFactory('mask'),
        path: createDOMFactory('path'),
        pattern: createDOMFactory('pattern'),
        polygon: createDOMFactory('polygon'),
        polyline: createDOMFactory('polyline'),
        radialGradient: createDOMFactory('radialGradient'),
        rect: createDOMFactory('rect'),
        stop: createDOMFactory('stop'),
        svg: createDOMFactory('svg'),
        text: createDOMFactory('text'),
        tspan: createDOMFactory('tspan')
    };
    module.exports = ReactDOMFactories;
});
/*react@15.3.2#lib/ReactPropTypes*/
define('react/lib/ReactPropTypes', function (require, exports, module) {
    'use strict';
    var ReactElement = require('react/lib/ReactElement');
    var ReactPropTypeLocationNames = require('react/lib/ReactPropTypeLocationNames');
    var ReactPropTypesSecret = require('react/lib/ReactPropTypesSecret');
    var emptyFunction = require('fbjs/lib/emptyFunction');
    var getIteratorFn = require('react/lib/getIteratorFn');
    var warning = require('fbjs/lib/warning');
    var ANONYMOUS = '<<anonymous>>';
    var ReactPropTypes = {
        array: createPrimitiveTypeChecker('array'),
        bool: createPrimitiveTypeChecker('boolean'),
        func: createPrimitiveTypeChecker('function'),
        number: createPrimitiveTypeChecker('number'),
        object: createPrimitiveTypeChecker('object'),
        string: createPrimitiveTypeChecker('string'),
        symbol: createPrimitiveTypeChecker('symbol'),
        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker
    };
    function is(x, y) {
        if (x === y) {
            return x !== 0 || 1 / x === 1 / y;
        } else {
            return x !== x && y !== y;
        }
    }
    function PropTypeError(message) {
        this.message = message;
        this.stack = '';
    }
    PropTypeError.prototype = Error.prototype;
    function createChainableTypeChecker(validate) {
        if (process.env.NODE_ENV !== 'production') {
            var manualPropTypeCallCache = {};
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
            componentName = componentName || ANONYMOUS;
            propFullName = propFullName || propName;
            if (process.env.NODE_ENV !== 'production') {
                if (secret !== ReactPropTypesSecret && typeof console !== 'undefined') {
                    var cacheKey = componentName + ':' + propName;
                    if (!manualPropTypeCallCache[cacheKey]) {
                        process.env.NODE_ENV !== 'production' ? warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will not work in the next major version. You may be ' + 'seeing this warning due to a third-party PropTypes library. ' + 'See https://fb.me/react-warning-dont-call-proptypes for details.', propFullName, componentName) : void 0;
                        manualPropTypeCallCache[cacheKey] = true;
                    }
                }
            }
            if (props[propName] == null) {
                var locationName = ReactPropTypeLocationNames[location];
                if (isRequired) {
                    return new PropTypeError('Required ' + locationName + ' `' + propFullName + '` was not specified in ' + ('`' + componentName + '`.'));
                }
                return null;
            } else {
                return validate(props, propName, componentName, location, propFullName);
            }
        }
        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);
        return chainedCheckType;
    }
    function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName, secret) {
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== expectedType) {
                var locationName = ReactPropTypeLocationNames[location];
                var preciseType = getPreciseType(propValue);
                return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
            }
            return null;
        }
        return createChainableTypeChecker(validate);
    }
    function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunction.thatReturns(null));
    }
    function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
            if (typeof typeChecker !== 'function') {
                return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
            }
            var propValue = props[propName];
            if (!Array.isArray(propValue)) {
                var locationName = ReactPropTypeLocationNames[location];
                var propType = getPropType(propValue);
                return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
            }
            for (var i = 0; i < propValue.length; i++) {
                var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
                if (error instanceof Error) {
                    return error;
                }
            }
            return null;
        }
        return createChainableTypeChecker(validate);
    }
    function createElementTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            if (!ReactElement.isValidElement(propValue)) {
                var locationName = ReactPropTypeLocationNames[location];
                var propType = getPropType(propValue);
                return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
            }
            return null;
        }
        return createChainableTypeChecker(validate);
    }
    function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location, propFullName) {
            if (!(props[propName] instanceof expectedClass)) {
                var locationName = ReactPropTypeLocationNames[location];
                var expectedClassName = expectedClass.name || ANONYMOUS;
                var actualClassName = getClassName(props[propName]);
                return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
            }
            return null;
        }
        return createChainableTypeChecker(validate);
    }
    function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
            process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
            return emptyFunction.thatReturnsNull;
        }
        function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            for (var i = 0; i < expectedValues.length; i++) {
                if (is(propValue, expectedValues[i])) {
                    return null;
                }
            }
            var locationName = ReactPropTypeLocationNames[location];
            var valuesString = JSON.stringify(expectedValues);
            return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
        }
        return createChainableTypeChecker(validate);
    }
    function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
            if (typeof typeChecker !== 'function') {
                return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
            }
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== 'object') {
                var locationName = ReactPropTypeLocationNames[location];
                return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
            }
            for (var key in propValue) {
                if (propValue.hasOwnProperty(key)) {
                    var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
                    if (error instanceof Error) {
                        return error;
                    }
                }
            }
            return null;
        }
        return createChainableTypeChecker(validate);
    }
    function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
            process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
            return emptyFunction.thatReturnsNull;
        }
        function validate(props, propName, componentName, location, propFullName) {
            for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
                var checker = arrayOfTypeCheckers[i];
                if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
                    return null;
                }
            }
            var locationName = ReactPropTypeLocationNames[location];
            return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
        }
        return createChainableTypeChecker(validate);
    }
    function createNodeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
            if (!isNode(props[propName])) {
                var locationName = ReactPropTypeLocationNames[location];
                return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
            }
            return null;
        }
        return createChainableTypeChecker(validate);
    }
    function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
            var propValue = props[propName];
            var propType = getPropType(propValue);
            if (propType !== 'object') {
                var locationName = ReactPropTypeLocationNames[location];
                return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
            }
            for (var key in shapeTypes) {
                var checker = shapeTypes[key];
                if (!checker) {
                    continue;
                }
                var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
                if (error) {
                    return error;
                }
            }
            return null;
        }
        return createChainableTypeChecker(validate);
    }
    function isNode(propValue) {
        switch (typeof propValue) {
        case 'number':
        case 'string':
        case 'undefined':
            return true;
        case 'boolean':
            return !propValue;
        case 'object':
            if (Array.isArray(propValue)) {
                return propValue.every(isNode);
            }
            if (propValue === null || ReactElement.isValidElement(propValue)) {
                return true;
            }
            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
                var iterator = iteratorFn.call(propValue);
                var step;
                if (iteratorFn !== propValue.entries) {
                    while (!(step = iterator.next()).done) {
                        if (!isNode(step.value)) {
                            return false;
                        }
                    }
                } else {
                    while (!(step = iterator.next()).done) {
                        var entry = step.value;
                        if (entry) {
                            if (!isNode(entry[1])) {
                                return false;
                            }
                        }
                    }
                }
            } else {
                return false;
            }
            return true;
        default:
            return false;
        }
    }
    function isSymbol(propType, propValue) {
        if (propType === 'symbol') {
            return true;
        }
        if (propValue['@@toStringTag'] === 'Symbol') {
            return true;
        }
        if (typeof Symbol === 'function' && propValue instanceof Symbol) {
            return true;
        }
        return false;
    }
    function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
            return 'array';
        }
        if (propValue instanceof RegExp) {
            return 'object';
        }
        if (isSymbol(propType, propValue)) {
            return 'symbol';
        }
        return propType;
    }
    function getPreciseType(propValue) {
        var propType = getPropType(propValue);
        if (propType === 'object') {
            if (propValue instanceof Date) {
                return 'date';
            } else if (propValue instanceof RegExp) {
                return 'regexp';
            }
        }
        return propType;
    }
    function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
            return ANONYMOUS;
        }
        return propValue.constructor.name;
    }
    module.exports = ReactPropTypes;
});
/*react@15.3.2#lib/ReactVersion*/
define('react/lib/ReactVersion', function (require, exports, module) {
    'use strict';
    module.exports = '15.3.2';
});
/*react@15.3.2#lib/onlyChild*/
define('react/lib/onlyChild', function (require, exports, module) {
    'use strict';
    var _prodInvariant = require('react/lib/reactProdInvariant');
    var ReactElement = require('react/lib/ReactElement');
    var invariant = require('fbjs/lib/invariant');
    function onlyChild(children) {
        !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant('143') : void 0;
        return children;
    }
    module.exports = onlyChild;
});
/*react@15.3.2#lib/React*/
define('react/lib/React', function (require, exports, module) {
    'use strict';
    var _assign = require('object-assign');
    var ReactChildren = require('react/lib/ReactChildren');
    var ReactComponent = require('react/lib/ReactComponent');
    var ReactPureComponent = require('react/lib/ReactPureComponent');
    var ReactClass = require('react/lib/ReactClass');
    var ReactDOMFactories = require('react/lib/ReactDOMFactories');
    var ReactElement = require('react/lib/ReactElement');
    var ReactPropTypes = require('react/lib/ReactPropTypes');
    var ReactVersion = require('react/lib/ReactVersion');
    var onlyChild = require('react/lib/onlyChild');
    var warning = require('fbjs/lib/warning');
    var createElement = ReactElement.createElement;
    var createFactory = ReactElement.createFactory;
    var cloneElement = ReactElement.cloneElement;
    if (process.env.NODE_ENV !== 'production') {
        var ReactElementValidator = require('react/lib/ReactElementValidator');
        createElement = ReactElementValidator.createElement;
        createFactory = ReactElementValidator.createFactory;
        cloneElement = ReactElementValidator.cloneElement;
    }
    var __spread = _assign;
    if (process.env.NODE_ENV !== 'production') {
        var warned = false;
        __spread = function () {
            process.env.NODE_ENV !== 'production' ? warning(warned, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.') : void 0;
            warned = true;
            return _assign.apply(null, arguments);
        };
    }
    var React = {
        Children: {
            map: ReactChildren.map,
            forEach: ReactChildren.forEach,
            count: ReactChildren.count,
            toArray: ReactChildren.toArray,
            only: onlyChild
        },
        Component: ReactComponent,
        PureComponent: ReactPureComponent,
        createElement: createElement,
        cloneElement: cloneElement,
        isValidElement: ReactElement.isValidElement,
        PropTypes: ReactPropTypes,
        createClass: ReactClass.createClass,
        createFactory: createFactory,
        createMixin: function (mixin) {
            return mixin;
        },
        DOM: ReactDOMFactories,
        version: ReactVersion,
        __spread: __spread
    };
    module.exports = React;
});
/*react@15.3.2#react*/
define('react', function (require, exports, module) {
    'use strict';
    module.exports = require('react/lib/React');
});
/*dist/core/UIEventDispatcher*/
define('dist/core/UIEventDispatcher', function (require, exports, module) {
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
    var React = require('react');
    var UIEventDispatcher = function (_super) {
        __extends(UIEventDispatcher, _super);
        function UIEventDispatcher(element) {
            _super.call(this);
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
        UIEventDispatcher.prototype.render = function () {
            return null;
        };
        ;
        return UIEventDispatcher;
    }(React.Component);
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
            this._tempAttributes = {};
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
        ViewBase.prototype.setAttribute = function (name, value) {
            if (this.rootElement) {
                this.rootElement.setAttribute(name, value);
                return;
            }
            this._tempAttributes[name] = value;
        };
        ViewBase.prototype.getAttribute = function (name) {
            return this.rootElement.getAttribute(name);
        };
        ViewBase.prototype.createChildren = function () {
            if (this._children && this._children.length > 0) {
                this.rootElement.setChildren(this._children);
            }
            for (var k in this._tempAttributes) {
                this.rootElement.setAttribute(k, this._tempAttributes[k]);
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