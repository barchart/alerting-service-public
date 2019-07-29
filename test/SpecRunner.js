(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

var condition = require('./condition'),
    publisher = require('./publisher');

module.exports = function () {
	'use strict';

	var validator = {
		forCreate: function forCreate(alert, description) {
			var d = getDescription(description);

			validator.forUser(alert, description);

			assert.argumentIsOptional(alert.alert_type, d + '.alert_type', String);
			assert.argumentIsOptional(alert.name, d + '.name', String);
			assert.argumentIsOptional(alert.notes, d + '.notes', Object);
			assert.argumentIsOptional(alert.user_notes, d + '.user_notes', String);
			assert.argumentIsOptional(alert.alert_system_key, d + '.alert_system_key', String);
			assert.argumentIsRequired(alert.automatic_reset, d + '.automatic_reset', Boolean);

			assert.argumentIsArray(alert.conditions, d + '.conditions', condition.forCreate);
			assert.argumentIsArray(alert.publishers, d + '.publishers', publisher.forCreate);
		},

		forEdit: function forEdit(alert, description) {
			var d = getDescription(description);

			assert.argumentIsRequired(alert.alert_id, d + '.alert_id', String);

			validator.forCreate(alert, description);
		},

		forQuery: function forQuery(alert, description) {
			var d = getDescription(description);

			assert.argumentIsRequired(alert, d, Object);
			assert.argumentIsRequired(alert.alert_id, d + '.alert_id', String);
		},

		forUser: function forUser(alert, description) {
			var d = getDescription(description);

			assert.argumentIsRequired(alert, d, Object);
			assert.argumentIsOptional(alert.user_id, d + '.user_id', String);
			assert.argumentIsOptional(alert.alert_system, d + '.alert_system', String);
		}
	};

	function getDescription(description) {
		if (is.string(description)) {
			return description;
		} else {
			return 'alert';
		}
	}

	return validator;
}();

},{"./condition":2,"./publisher":3,"@barchart/common-js/lang/assert":4,"@barchart/common-js/lang/is":5}],2:[function(require,module,exports){
'use strict';

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

module.exports = function () {
	'use strict';

	var validator = {
		forCreate: function forCreate(condition, description) {
			var d = getDescription(description);

			assert.argumentIsRequired(condition.property, d + '.property', Object);
			assert.argumentIsRequired(condition.property.property_id, d + '.property.property_id', Number);
			assert.argumentIsRequired(condition.property.target, d + '.property.target', Object);
			assert.argumentIsRequired(condition.property.target.identifier, d + '.property.target.identifier', String);
			assert.argumentIsOptional(condition.property.target.display, d + '.property.target.display', String);
			assert.argumentIsOptional(condition.property.target.kind, d + '.property.target.kind', String);
			assert.argumentIsRequired(condition.operator, d + '.operator', Object);
			assert.argumentIsRequired(condition.operator.operator_id, d + '.operator.operator_id', Number);

			if (Array.isArray(condition.operator.operand)) {
				assert.argumentIsArray(condition.operator.operand, d + '.operator.operand', String);
			} else {
				assert.argumentIsOptional(condition.operator.operand, d + '.operator.operand', String);
			}

			if (condition.operator.modifiers) {
				assert.argumentIsArray(condition.operator.modifiers, d + '.operator.modifiers', validateModifier);
			}
		}
	};

	function getDescription(description) {
		if (is.string(description)) {
			return description;
		} else {
			return 'condition';
		}
	}

	function validateModifier(modifier, d) {
		assert.argumentIsRequired(modifier.modifier_id, d + '.modifier_id', Number);
		assert.argumentIsRequired(modifier.value, d + '.value', String);
	}

	return validator;
}();

},{"@barchart/common-js/lang/assert":4,"@barchart/common-js/lang/is":5}],3:[function(require,module,exports){
'use strict';

var assert = require('@barchart/common-js/lang/assert'),
    is = require('@barchart/common-js/lang/is');

module.exports = function () {
	'use strict';

	var validator = {
		forCreate: function forCreate(publisher, description) {
			var d = getDescription(description);

			assert.argumentIsRequired(publisher.type, d + '.type', Object);
			assert.argumentIsRequired(publisher.type.publisher_type_id, d + '.type.publisher_type_id', Number);
			assert.argumentIsRequired(publisher.use_default_recipient, d + '.use_default_recipient', Boolean);

			if (publisher.use_default_recipient === undefined || publisher.use_default_recipient === null) {
				publisher.use_default_recipient = false;
			}

			assert.argumentIsRequired(publisher.use_default_recipient, d + '.use_default_recipient', Boolean);

			if (publisher.use_default_recipient) {
				publisher.recipient = null;
			} else {
				assert.argumentIsRequired(publisher.recipient, d + '.recipient', String);
			}

			assert.argumentIsOptional(publisher.format, d + '.format', String);
		}
	};

	function getDescription(description) {
		if (is.string(description)) {
			return description;
		} else {
			return 'publisher';
		}
	}

	return validator;
}();

},{"@barchart/common-js/lang/assert":4,"@barchart/common-js/lang/is":5}],4:[function(require,module,exports){
'use strict';

var is = require('./is');

module.exports = function () {
	'use strict';

	function checkArgumentType(variable, variableName, type, typeDescription, index) {
		if (type === String) {
			if (!is.string(variable)) {
				throwInvalidTypeError(variableName, 'string', index);
			}
		} else if (type === Number) {
			if (!is.number(variable)) {
				throwInvalidTypeError(variableName, 'number', index);
			}
		} else if (type === Function) {
			if (!is.fn(variable)) {
				throwInvalidTypeError(variableName, 'function', index);
			}
		} else if (type === Boolean) {
			if (!is.boolean(variable)) {
				throwInvalidTypeError(variableName, 'boolean', index);
			}
		} else if (type === Date) {
			if (!is.date(variable)) {
				throwInvalidTypeError(variableName, 'date', index);
			}
		} else if (type === Array) {
			if (!is.array(variable)) {
				throwInvalidTypeError(variableName, 'array', index);
			}
		} else if (!(variable instanceof (type || Object))) {
			throwInvalidTypeError(variableName, typeDescription, index);
		}
	}

	function throwInvalidTypeError(variableName, typeDescription, index) {
		var message = void 0;

		if (typeof index === 'number') {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ], at index [ ' + index.toString() + ' ] must be a [ ' + (typeDescription || 'unknown') + ' ]';
		} else {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ] must be a [ ' + (typeDescription || 'Object') + ' ]';
		}

		throw new Error(message);
	}

	function throwCustomValidationError(variableName, predicateDescription) {
		throw new Error('The argument [ ' + (variableName || 'unspecified') + ' ] failed a validation check [ ' + (predicateDescription || 'No description available') + ' ]');
	}

	/**
  * Utilities checking arguments.
  *
  * @public
  * @module lang/assert
  */
	return {
		/**
   * Throws an error if an argument doesn't conform to the desired specification (as
   * determined by a type check).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsRequired: function argumentIsRequired(variable, variableName, type, typeDescription) {
			checkArgumentType(variable, variableName, type, typeDescription);
		},


		/**
   * A relaxed version of the "argumentIsRequired" function that will not throw if
   * the value is undefined or null.
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsOptional: function argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
			if (variable === null || variable === undefined) {
				return;
			}

			checkArgumentType(variable, variableName, type, typeDescription);

			if (is.fn(predicate) && !predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		argumentIsArray: function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
			this.argumentIsRequired(variable, variableName, Array);

			if (itemConstraint) {
				var itemValidator = void 0;

				if (typeof itemConstraint === 'function' && itemConstraint !== Function) {
					itemValidator = function itemValidator(value, index) {
						return itemConstraint.prototype !== undefined && value instanceof itemConstraint || itemConstraint(value, variableName + '[' + index + ']');
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
		},


		/**
   * Throws an error if an argument doesn't conform to the desired specification
   * (as determined by a predicate).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {Function=} predicate - A function used to validate the item (beyond type checking).
   * @param {String=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
   */
		argumentIsValid: function argumentIsValid(variable, variableName, predicate, predicateDescription) {
			if (!predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		areEqual: function areEqual(a, b, descriptionA, descriptionB) {
			if (a !== b) {
				throw new Error('The objects must be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		},
		areNotEqual: function areNotEqual(a, b, descriptionA, descriptionB) {
			if (a === b) {
				throw new Error('The objects cannot be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		}
	};
}();

},{"./is":5}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
	'use strict';

	/**
  * Utilities for interrogating variables (e.g. checking data types).
  *
  * @public
  * @module lang/is
  */

	return {
		/**
   * Returns true, if the argument is a number. NaN will return false.
   *
   * @static
   * @public
   * @param {*} candidate {*}
   * @returns {boolean}
   */
		number: function number(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate);
		},


		/**
   * Returns true, if the argument is NaN.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		nan: function nan(candidate) {
			return typeof candidate === 'number' && isNaN(candidate);
		},


		/**
   * Returns true, if the argument is a valid 32-bit integer.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		integer: function integer(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
		},


		/**
   * Returns true, if the argument is a valid integer (which can exceed 32 bits); however,
   * the check can fail above the value of Number.MAX_SAFE_INTEGER.
   *
   * @static
   * @public
   * @param {*) candidate
   * @returns {boolean}
   */
		large: function large(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
		},


		/**
   * Returns true, if the argument is a number that is positive.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		positive: function positive(candidate) {
			return this.number(candidate) && candidate > 0;
		},


		/**
   * Returns true, if the argument is a number that is negative.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		negative: function negative(candidate) {
			return this.number(candidate) && candidate < 0;
		},


		/**
   * Returns true, if the argument is a string.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		string: function string(candidate) {
			return typeof candidate === 'string';
		},


		/**
   * Returns true, if the argument is a JavaScript Date instance.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		date: function date(candidate) {
			return candidate instanceof Date;
		},


		/**
   * Returns true, if the argument is a function.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		fn: function fn(candidate) {
			return typeof candidate === 'function';
		},


		/**
   * Returns true, if the argument is an array.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		array: function array(candidate) {
			return Array.isArray(candidate);
		},


		/**
   * Returns true, if the argument is a Boolean value.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		boolean: function boolean(candidate) {
			return typeof candidate === 'boolean';
		},


		/**
   * Returns true, if the argument is an object.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		object: function object(candidate) {
			return (typeof candidate === 'undefined' ? 'undefined' : _typeof(candidate)) === 'object' && candidate !== null;
		},


		/**
   * Returns true, if the argument is a null value.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		null: function _null(candidate) {
			return candidate === null;
		},


		/**
   * Returns true, if the argument is an undefined value.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		undefined: function (_undefined) {
			function undefined(_x) {
				return _undefined.apply(this, arguments);
			}

			undefined.toString = function () {
				return _undefined.toString();
			};

			return undefined;
		}(function (candidate) {
			return candidate === undefined;
		}),


		/**
   * Given two classes, determines if the "child" class extends
   * the "parent" class (without instantiation).
   *
   * @param {Function} parent
   * @param {Function} child
   * @returns {Boolean}
   */
		extension: function extension(parent, child) {
			return this.fn(parent) && this.fn(child) && child.prototype instanceof parent;
		}
	};
}();

},{}],6:[function(require,module,exports){
'use strict';

var alert = require('./../../../../lib/alerts/validators/alert');

describe('When validating an alert object', function () {
	'use strict';
});

},{"./../../../../lib/alerts/validators/alert":1}]},{},[6]);
