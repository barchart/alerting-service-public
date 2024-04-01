(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
  is = require('@barchart/common-js/lang/is');
const condition = require('./condition'),
  publisher = require('./publisher');
module.exports = (() => {
  'use strict';

  const validator = {
    forCreate: (alert, description) => {
      const d = getDescription(description);
      validator.forUser(alert, description);
      assert.argumentIsOptional(alert.template_id, `${d}.template_id`, String);
      assert.argumentIsOptional(alert.alert_type, `${d}.alert_type`, String);
      assert.argumentIsOptional(alert.name, `${d}.name`, String);
      assert.argumentIsOptional(alert.notes, `${d}.notes`, Object);
      assert.argumentIsOptional(alert.user_notes, `${d}.user_notes`, String);
      assert.argumentIsOptional(alert.alert_system_key, `${d}.alert_system_key`, String);
      assert.argumentIsOptional(alert.alert_behavior, `${d}.alert_behavior`, String);
      assert.argumentIsArray(alert.conditions, `${d}.conditions`, condition.forCreate);
      if (alert.hasOwnProperty('publishers')) {
        assert.argumentIsArray(alert.publishers, `${d}.publishers`, publisher.forCreate);
      }
    },
    forEdit: (alert, description) => {
      const d = getDescription(description);
      assert.argumentIsRequired(alert.alert_id, `${d}.alert_id`, String);
      validator.forCreate(alert, description);
    },
    forQuery: (alert, description) => {
      const d = getDescription(description);
      assert.argumentIsRequired(alert, d, Object);
      assert.argumentIsRequired(alert.alert_id, `${d}.alert_id`, String);
    },
    forUser: (alert, description) => {
      const d = getDescription(description);
      assert.argumentIsRequired(alert, d, Object);
      assert.argumentIsRequired(alert.user_id, `${d}.user_id`, String);
      assert.argumentIsRequired(alert.alert_system, `${d}.alert_system`, String);
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
})();

},{"./condition":2,"./publisher":3,"@barchart/common-js/lang/assert":5,"@barchart/common-js/lang/is":6}],2:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
  is = require('@barchart/common-js/lang/is');
module.exports = (() => {
  'use strict';

  const validator = {
    forCreate: (condition, description) => {
      const d = getDescription(description);
      assert.argumentIsRequired(condition.property, `${d}.property`, Object);
      assert.argumentIsRequired(condition.property.property_id, `${d}.property.property_id`, Number);
      assert.argumentIsRequired(condition.property.target, `${d}.property.target`, Object);
      assert.argumentIsRequired(condition.property.target.identifier, `${d}.property.target.identifier`, String);
      assert.argumentIsOptional(condition.property.target.display, `${d}.property.target.display`, String);
      assert.argumentIsOptional(condition.property.target.kind, `${d}.property.target.kind`, String);
      assert.argumentIsRequired(condition.operator, `${d}.operator`, Object);
      assert.argumentIsRequired(condition.operator.operator_id, `${d}.operator.operator_id`, Number);
      if (Array.isArray(condition.operator.operand)) {
        assert.argumentIsArray(condition.operator.operand, `${d}.operator.operand`, String);
      } else {
        assert.argumentIsOptional(condition.operator.operand, `${d}.operator.operand`, String);
      }
      if (condition.operator.modifiers) {
        assert.argumentIsArray(condition.operator.modifiers, `${d}.operator.modifiers`, validateModifier);
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
    assert.argumentIsRequired(modifier.modifier_id, `${d}.modifier_id`, Number);
    assert.argumentIsRequired(modifier.value, `${d}.value`, String);
  }
  return validator;
})();

},{"@barchart/common-js/lang/assert":5,"@barchart/common-js/lang/is":6}],3:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
  is = require('@barchart/common-js/lang/is');
module.exports = (() => {
  'use strict';

  const validator = {
    forCreate: (publisher, description) => {
      const d = getDescription(description);
      assert.argumentIsRequired(publisher.type, `${d}.type`, Object);
      assert.argumentIsRequired(publisher.type.publisher_type_id, `${d}.type.publisher_type_id`, Number);
      assert.argumentIsRequired(publisher.use_default_recipient, `${d}.use_default_recipient`, Boolean);
      if (publisher.use_default_recipient === undefined || publisher.use_default_recipient === null) {
        publisher.use_default_recipient = false;
      }
      assert.argumentIsRequired(publisher.use_default_recipient, `${d}.use_default_recipient`, Boolean);
      if (publisher.use_default_recipient) {
        publisher.recipient = null;
      } else {
        assert.argumentIsRequired(publisher.recipient, `${d}.recipient`, String);
      }
      assert.argumentIsOptional(publisher.format, `${d}.format`, String);
      assert.argumentIsOptional(publisher.title, `${d}.title`, String);
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
})();

},{"@barchart/common-js/lang/assert":5,"@barchart/common-js/lang/is":6}],4:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert');
module.exports = (() => {
  'use strict';

  /**
   * An object which contains the required assertions for a token.
   *
   * @public
   * @exported
   * @param {String} userId - The unique identifier of the authenticated user.
   * @param {String} alertSystem - The authenticated user's domain. In the demo environment, use your company name. In the production environment, Barchart will assign a value to use.
   */
  class JwtPayload {
    constructor(userId, alertSystem) {
      assert.argumentIsRequired(userId, 'userId', String);
      assert.argumentIsRequired(alertSystem, 'alertSystem', String);
      this._userId = userId;
      this._alertSystem = alertSystem;
    }

    /**
     * The unique identifier of the authenticated user. This value must match
     * the {@link Schema.Alert#user_id} of any alert you attempt to create, edit, or delete.
     *
     * @public
     * @returns {String}
     */
    get userId() {
      return this._userId;
    }

    /**
     * The authenticated user's domain. In the demo environment, use your company name. This value must
     * match the {@link Schema.Alert#alert_system} of any alert you attempt to create, edit, or delete.
     *
     * @public
     * @returns {String}
     */
    get alertSystem() {
      return this._alertSystem;
    }

    /**
     * Returns the simple object representation, used for signing a token.
     *
     * @public
     * @returns {String}
     */
    forSigning() {
      const serialized = {};
      serialized.user_id = this.userId;
      serialized.userId = this.userId;
      serialized.alert_system = this.alertSystem;
      serialized.contextId = this.alertSystem;
      return serialized;
    }
    toString() {
      return '[JwtPayload]';
    }
  }
  return JwtPayload;
})();

},{"@barchart/common-js/lang/assert":5}],5:[function(require,module,exports){
const is = require('./is');
module.exports = (() => {
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
    let message;
    if (typeof index === 'number') {
      message = `The argument [ ${variableName || 'unspecified'} ], at index [ ${index.toString()} ] must be a [ ${typeDescription || 'unknown'} ]`;
    } else {
      message = `The argument [ ${variableName || 'unspecified'} ] must be a [ ${typeDescription || 'Object'} ]`;
    }
    throw new Error(message);
  }
  function throwCustomValidationError(variableName, predicateDescription) {
    throw new Error(`The argument [ ${variableName || 'unspecified'} ] failed a validation check [ ${predicateDescription || 'No description available'} ]`);
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
     * @param {String=} variableName - The name of the value (used for formatting an error message).
     * @param {*=} type - The expected type of the argument.
     * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
     */
    argumentIsRequired(variable, variableName, type, typeDescription) {
      checkArgumentType(variable, variableName, type, typeDescription);
    },
    /**
     * A relaxed version of the "argumentIsRequired" function that will not throw if
     * the value is undefined or null.
     *
     * @static
     * @param {*} variable - The value to check.
     * @param {String=} variableName - The name of the value (used for formatting an error message).
     * @param {*=} type - The expected type of the argument.
     * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
     */
    argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
      if (variable === null || variable === undefined) {
        return;
      }
      checkArgumentType(variable, variableName, type, typeDescription);
      if (is.fn(predicate) && !predicate(variable)) {
        throwCustomValidationError(variableName, predicateDescription);
      }
    },
    argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
      this.argumentIsRequired(variable, variableName, Array);
      if (itemConstraint) {
        let itemValidator;
        if (typeof itemConstraint === 'function' && itemConstraint !== Function) {
          itemValidator = (value, index) => itemConstraint.prototype !== undefined && value instanceof itemConstraint || itemConstraint(value, `${variableName}[${index}]`);
        } else {
          itemValidator = (value, index) => checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
        }
        variable.forEach((v, i) => {
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
     * @param {String=} variableName - The name of the value (used for formatting an error message).
     * @param {Function=} predicate - A function used to validate the item (beyond type checking).
     * @param {String=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
     */
    argumentIsValid(variable, variableName, predicate, predicateDescription) {
      if (!predicate(variable)) {
        throwCustomValidationError(variableName, predicateDescription);
      }
    },
    areEqual(a, b, descriptionA, descriptionB) {
      if (a !== b) {
        throw new Error(`The objects must be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
      }
    },
    areNotEqual(a, b, descriptionA, descriptionB) {
      if (a === b) {
        throw new Error(`The objects cannot be equal [${descriptionA || a.toString()}] and [${descriptionB || b.toString()}]`);
      }
    }
  };
})();

},{"./is":6}],6:[function(require,module,exports){
module.exports = (() => {
  'use strict';

  /**
   * Utilities for interrogating variables (e.g. checking data types).
   *
   * @public
   * @module lang/is
   */
  return {
    /**
     * Returns true if the argument is a number. NaN will return false.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    number(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate);
    },
    /**
     * Returns true if the argument is NaN.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    nan(candidate) {
      return typeof candidate === 'number' && isNaN(candidate);
    },
    /**
     * Returns true if the argument is a valid 32-bit integer.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    integer(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
    },
    /**
     * Returns true if the argument is a valid integer (which can exceed 32 bits); however,
     * the check can fail above the value of Number.MAX_SAFE_INTEGER.
     *
     * @static
     * @public
     * @param {*) candidate
     * @returns {boolean}
     */
    large(candidate) {
      return typeof candidate === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
    },
    /**
     * Returns true if the argument is a number that is positive.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    positive(candidate) {
      return this.number(candidate) && candidate > 0;
    },
    /**
     * Returns true if the argument is a number that is negative.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    negative(candidate) {
      return this.number(candidate) && candidate < 0;
    },
    /**
     * Returns true if the argument is iterable.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    iterable(candidate) {
      return !this.null(candidate) && !this.undefined(candidate) && this.fn(candidate[Symbol.iterator]);
    },
    /**
     * Returns true if the argument is a string.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    string(candidate) {
      return typeof candidate === 'string';
    },
    /**
     * Returns true if the argument is a JavaScript Date instance.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    date(candidate) {
      return candidate instanceof Date;
    },
    /**
     * Returns true if the argument is a function.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    fn(candidate) {
      return typeof candidate === 'function';
    },
    /**
     * Returns true if the argument is an array.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    array(candidate) {
      return Array.isArray(candidate);
    },
    /**
     * Returns true if the argument is a Boolean value.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    boolean(candidate) {
      return typeof candidate === 'boolean';
    },
    /**
     * Returns true if the argument is an object.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    object(candidate) {
      return typeof candidate === 'object' && candidate !== null;
    },
    /**
     * Returns true if the argument is a null value.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    null(candidate) {
      return candidate === null;
    },
    /**
     * Returns true if the argument is an undefined value.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    undefined(candidate) {
      return candidate === undefined;
    },
    /**
     * Returns true if the argument is a zero-length string.
     *
     * @static
     * @public
     * @param {*} candidate
     * @returns {boolean}
     */
    zeroLengthString(candidate) {
      return this.string(candidate) && candidate.length === 0;
    },
    /**
     * Given two classes, determines if the "child" class extends
     * the "parent" class (without instantiation).
     *
     * @param {Function} parent
     * @param {Function} child
     * @returns {Boolean}
     */
    extension(parent, child) {
      return this.fn(parent) && this.fn(child) && child.prototype instanceof parent;
    }
  };
})();

},{}],7:[function(require,module,exports){
const JwtPayload = require('./../../../lib/security/JwtPayload');
describe('When constructing a JwtPayload', () => {
  'use strict';

  const userId = 'me';
  const alertSystem = 'mystery';
  let payload;
  beforeEach(() => {
    payload = new JwtPayload(userId, alertSystem);
  });
  it('the "userId" property should equal the value passed to the constructor', () => {
    expect(payload.userId).toEqual(userId);
  });
  it('the "alertSystem" property should equal the value passed to the constructor', () => {
    expect(payload.alertSystem).toEqual(alertSystem);
  });
  describe('and serialized the instance for signing purposes', () => {
    let serialized;
    beforeEach(() => {
      serialized = payload.forSigning();
    });
    it('the result should be an object', () => {
      expect(typeof serialized).toEqual('object');
    });
    it('the result should have a "user_id" property', () => {
      expect(serialized.hasOwnProperty('user_id')).toEqual(true);
    });
    it('the result should have a "alert_system" property', () => {
      expect(serialized.hasOwnProperty('alert_system')).toEqual(true);
    });
    it('the result\'s "user_id" property should have the same value as the "userId" property', () => {
      expect(serialized.user_id).toEqual(payload.userId);
    });
    it('the result\'s "alert_system" property should have the same value as the "alertSystem" property', () => {
      expect(serialized.alert_system).toEqual(payload.alertSystem);
    });
  });
});

},{"./../../../lib/security/JwtPayload":4}],8:[function(require,module,exports){
const validator = require('./../../../lib/data/validators/alert');
describe('When validating an alert object', () => {
  'use strict';

  describe('for queries', () => {
    let alert;
    beforeEach(() => {
      alert = {};
      alert.alert_id = 'id';
    });
    it('an object having an "alert_id" property with a string value should be valid', () => {
      expect(() => validator.forQuery(alert)).not.toThrow();
    });
  });
});

},{"./../../../lib/data/validators/alert":1}]},{},[7,8]);
