(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert');

module.exports = function () {
    'use strict';

    var Disposable = function () {
        function Disposable() {
            _classCallCheck(this, Disposable);

            this._disposed = false;
        }

        _createClass(Disposable, [{
            key: 'dispose',
            value: function dispose() {
                if (this._disposed) {
                    return;
                }

                this._disposed = true;

                this._onDispose();
            }
        }, {
            key: '_onDispose',
            value: function _onDispose() {
                return;
            }
        }, {
            key: 'getIsDisposed',
            value: function getIsDisposed() {
                return this._disposed || false;
            }
        }, {
            key: 'toString',
            value: function toString() {
                return '[Disposable]';
            }
        }], [{
            key: 'fromAction',
            value: function fromAction(disposeAction) {
                assert.argumentIsRequired(disposeAction, 'disposeAction', Function);

                return new DisposableAction(disposeAction);
            }
        }]);

        return Disposable;
    }();

    var DisposableAction = function (_Disposable) {
        _inherits(DisposableAction, _Disposable);

        function DisposableAction(disposeAction) {
            _classCallCheck(this, DisposableAction);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DisposableAction).call(this, disposeAction));

            _this._disposeAction = disposeAction;
            return _this;
        }

        _createClass(DisposableAction, [{
            key: '_onDispose',
            value: function _onDispose() {
                this._disposeAction();
                this._disposeAction = null;
            }
        }, {
            key: 'toString',
            value: function toString() {
                return '[DisposableAction]';
            }
        }]);

        return DisposableAction;
    }(Disposable);

    return Disposable;
}();

},{"./assert":2}],2:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	var assert = {
		argumentIsRequired: function argumentIsRequired(variable, variableName, type, typeDescription) {
			checkArgumentType(variable, variableName, type, typeDescription);
		},

		argumentIsOptional: function argumentIsOptional(variable, variableName, type, typeDescription) {
			if (variable === null || variable === undefined) {
				return;
			}

			checkArgumentType(variable, variableName, type, typeDescription);
		},

		argumentIsArray: function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
			assert.argumentIsRequired(variable, variableName, Array);

			var itemValidator = void 0;

			if (typeof itemConstraint === 'function') {
				itemValidator = function itemValidator(value, index) {
					return itemConstraint(value, variableName + '[' + index + ']');
				};
			} else {
				itemValidator = function itemValidator(value, index) {
					return checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
				};
			}

			variable.forEach(function (v, i) {
				itemValidator(v, i);
			});
		}
	};

	function checkArgumentType(variable, variableName, type, typeDescription, index) {
		if (type === String) {
			if (typeof variable !== 'string') {
				throwInvalidTypeError(variableName, 'string', index);
			}
		} else if (type === Number) {
			if (typeof variable !== 'number') {
				throwInvalidTypeError(variableName, 'number', index);
			}
		} else if (type === Function) {
			if (typeof variable !== 'function') {
				throwInvalidTypeError(variableName, 'function', index);
			}
		} else if (type === Boolean) {
			if (typeof variable !== 'boolean') {
				throwInvalidTypeError(variableName, 'boolean', index);
			}
		} else if (type === Date) {
			if (!(variable instanceof Date)) {
				throwInvalidTypeError(variableName, 'date', index);
			}
		} else if (type === Array) {
			if (!Array.isArray(variable)) {
				throwInvalidTypeError(variableName, 'array', index);
			}
		} else if (!(variable instanceof (type || Object))) {
			throwInvalidTypeError(variableName, typeDescription, index);
		}
	}

	function throwInvalidTypeError(variableName, typeDescription, index) {
		var message = void 0;

		if (typeof index === 'number') {
			message = 'The argument [' + (variableName || 'unspecified') + '], at index [' + index.toString() + '] must be a ' + (typeDescription || 'unknown');
		} else {
			message = 'The argument [' + (variableName || 'unspecified') + '] must be a ' + (typeDescription || 'Object');
		}

		throw new Error(message);
	}

	return assert;
}();

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Disposable = require('./../lang/Disposable');

module.exports = function () {
	'use strict';

	var Event = function (_Disposable) {
		_inherits(Event, _Disposable);

		function Event() {
			_classCallCheck(this, Event);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Event).call(this));

			_this._observers = [];
			return _this;
		}

		_createClass(Event, [{
			key: 'register',
			value: function register(handler) {
				if (typeof handler !== 'function') {
					throw new Error('Event handler must be a function.');
				}

				addRegistration.call(this, handler);
			}
		}, {
			key: 'unregister',
			value: function unregister(handler) {
				if (typeof handler !== 'function') {
					throw new Error('Event handler must be a function.');
				}

				removeRegistration.call(this, handler);
			}
		}, {
			key: 'clear',
			value: function clear() {
				this._observers = [];
			}
		}, {
			key: 'fire',
			value: function fire(data) {
				var observers = this._observers;

				for (var i = 0; i < observers.length; i++) {
					var observer = observers[i];

					observer(data);
				}
			}
		}, {
			key: 'getIsEmpty',
			value: function getIsEmpty() {
				return this._observers.length === 0;
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				this._observers = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Event]';
			}
		}]);

		return Event;
	}(Disposable);

	function addRegistration(handler) {
		var copiedObservers = this._observers.slice();

		copiedObservers.push(handler);

		this._observers = copiedObservers;
	}

	function removeRegistration(handler) {
		var indiciesToRemove = [];

		for (var i = 0; i < this._observers.length; i++) {
			var candidate = this._observers[i];

			if (candidate === handler) {
				indiciesToRemove.push(i);
			}
		}

		if (indiciesToRemove.length > 0) {
			var copiedObservers = this._observers.slice();

			for (var j = indiciesToRemove.length - 1; !(j < 0); j--) {
				copiedObservers.splice(indiciesToRemove[j], 1);
			}

			this._observers = copiedObservers;
		}
	}

	return Event;
}();

},{"./../lang/Disposable":1}],4:[function(require,module,exports){
'use strict';

var Event = require('./../../../lib/common/messaging/Event');

describe('When an Event is constructed', function () {
	'use strict';

	var event;

	beforeEach(function () {
		event = new Event();
	});

	describe('and three handlers are registered', function () {
		var eventHandlerOne;
		var eventHandlerTwo;
		var eventHandlerThree;

		beforeEach(function () {
			event.register(eventHandlerOne = jasmine.createSpy('eventHandlerOne'));
			event.register(eventHandlerTwo = jasmine.createSpy('eventHandlerTwo'));
			event.register(eventHandlerThree = jasmine.createSpy('eventHandlerThree'));
		});

		it('should report the event as not empty', function () {
			expect(event.getIsEmpty()).toBe(false);
		});

		describe('and the event fires', function () {
			var eventData;

			beforeEach(function () {
				event.fire(eventData = {});
			});

			it('should notify the first handler', function () {
				expect(eventHandlerOne).toHaveBeenCalledWith(eventData);
			});

			it('should notify the second handler', function () {
				expect(eventHandlerTwo).toHaveBeenCalledWith(eventData);
			});

			it('should notify the third handler', function () {
				expect(eventHandlerThree).toHaveBeenCalledWith(eventData);
			});
		});

		describe('and the second event handler is unregistered', function () {
			beforeEach(function () {
				event.unregister(eventHandlerTwo);
			});

			it('should report the event as not empty', function () {
				expect(event.getIsEmpty()).toBe(false);
			});

			describe('and the event fires', function () {
				var eventData;

				beforeEach(function () {
					event.fire(eventData = {});
				});

				it('should notify the first handler', function () {
					expect(eventHandlerOne).toHaveBeenCalledWith(eventData);
				});

				it('should not notify the second handler', function () {
					expect(eventHandlerTwo).not.toHaveBeenCalledWith(eventData);
				});

				it('should notify the third handler', function () {
					expect(eventHandlerThree).toHaveBeenCalledWith(eventData);
				});
			});
		});

		describe('and all three event handlers are unregistered', function () {
			beforeEach(function () {
				event.unregister(eventHandlerOne);
				event.unregister(eventHandlerTwo);
				event.unregister(eventHandlerThree);
			});

			it('should report the event as empty', function () {
				expect(event.getIsEmpty()).toBe(true);
			});

			describe('and the event fires', function () {
				var eventData;

				beforeEach(function () {
					event.fire(eventData = {});
				});

				it('should not notify the first handler', function () {
					expect(eventHandlerOne).not.toHaveBeenCalledWith(eventData);
				});

				it('should not notify the second handler', function () {
					expect(eventHandlerTwo).not.toHaveBeenCalledWith(eventData);
				});

				it('should not notify the third handler', function () {
					expect(eventHandlerThree).not.toHaveBeenCalledWith(eventData);
				});
			});
		});
	});
});

},{"./../../../lib/common/messaging/Event":3}]},{},[4]);
