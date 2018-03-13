/**
 * @Title: util_core
 * @Author: Ganesh Kumar
 * @Version: 1.0
 * @Since: 1.0
 * @Description: JavaScript Utility for Coach
 * @Copyright (c) 2016 Ganesh Kumar < ganeshkumar.jothikumar@gmail.com>
 */

// IE doesn't support remove method
HTMLElement.prototype.remove = function () {
    if (this.parentNode) this.parentNode.removeChild(this);
}

// global singleton variable for utility
window._js = new (function () {
    'use strict';
    var _version = "1.0";// maintains the utility build version
    var _subscription = {};// maintains the listeners
    var _functionNameRegEX = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/; // function name validator

    var _result; // temp variable for results
    var _arrLen; // temp variable for array length
    var _subscriber; // temp variable to maintain subscriber configuration
    var _subscriberArr; // temp variable to maintain subscriber configuration in an Array

    function utility() {}

    /**
     * Returns utility version
     * @returns {string}
     */
    utility.prototype.getVersion = function(){
        return _version;
    };

    /**
     * Shortcut to find element by id of document class.
     * @memberOf utility
     * @since v1.0
     * @param {string} id standard CSS3 selector
     * @classDesc Helper functions available in views/controls through the util property. For example <code>_js.util.byId("input1");</code>
     * @returns {Element} Returns the element found.
     */
    utility.prototype.byId = function (id) {
        try {
            return document.getElementById(id);
        } catch (ex) {
            _js.log.error("Error finding element for id: %s", id, ex);
            throw ex;
        }
    };

    /**
     * Shortcut to find element by querySelector of document class. Optionally supports finding element under a parent.
     * @memberOf utility
     * @since v1.0
     * @param {string} selector standard CSS3 selector
     * @param {Element} [element] element optional parameter, child is searched under this element or globally if ignored
     * @classDesc Helper functions available in views/controls through the util property. For example <code>_js.util.find(".className");</code>
     * @returns {Element} Returns the element found.
     */
    utility.prototype.find = function (selector, element) {
        try {
            element = element || document;
            return element.querySelector(selector);
        } catch (ex) {
            _js.log.error("Error finding element for selector: " + selector, ex);
            throw ex;
        }
    };

    /**
     * Shortcut to find all elements by querySelectorAll of document class. Optionally supports finding elements under a parent.
     * @memberOf utility
     * @since v1.0
     * @param {string} selector standard CSS3 selector
     * @param {Element} [element] element optional parameter, child is searched under this element or globally if ignored
     * @classDesc Helper functions available in views/controls through the util property. For example <code>_js.util.findAll(".className");</code>
     * @returns {NodeList} Returns the element found.
     */
    utility.prototype.findAll = function (selector, element) {
        try {
            element = element || document;
            return element.querySelectorAll(selector);
        } catch (ex) {
            _js.log.error("Error finding elements for selector: %s", selector, ex);
            throw ex;
        }
    };

    /**
     * Shortcut to get/set attribute for an element
     * @memberOf utility
     * @since v1.0
     * @param {string/Element} selector Param can take a string or a dom element to get/set attribute
     * @param {string} name name of the attribute
     * @param {string} [value] - value of the attribute. attribute will be updated if value is given
     * @returns {string} attribute value.
     */
    utility.prototype.attr = function (selector, name, value) {
        try {
            selector = typeof selector === "string" ? this.find(selector) : selector;
            if (this.isNotEmpty(value)) {
                selector.setAttribute(name, value);
            }

            return selector.getAttribute(name);
        } catch (ex) {
            _js.log.error("Error finding elements for selector: %s", selector, ex);
            throw ex;
        }
    };

    /**
     * Listens to messages based on code, multiple listener can be configure for a single code
     * @memberOf utility
     * @since v1.0
     * @param {string} code an unique code to listen for messages. Multiple listeners can be setup on same code.
     * @param {function} callback function to be triggered on receiving message
     * @param {Object} context context in which the function has to be executed, by default executed in windows context
     * @param {number} position a number to indicate the priority of current callback when multiple listeners are setup.
     *                 when multiple listeners request for the same position, latest request takes priority
     * @param {boolean} once boolean indicator to denote this listener will be removed after first message is received
     * @returns {void}
     */
    utility.prototype.listen = function (code, callback, context, position, once) {
        try {
            _subscriberArr = _subscription[code] || [];
            position = position >= 0 ? position : _subscriberArr.length;
            _subscriberArr.splice(position, 0, {
                isOnce: once,
                method: callback,
                scope: context || null
            });
            _subscription[code] = _subscriberArr;
        } catch (ex) {
            _js.log.error("Error registering listener for code: %s", code, ex);
            throw ex;
        }
    };

    /**
     * Posts a message using a unique code. Message will be delivered to all those listen on this code.
     * @memberOf utility
     * @since v1.0
     * @param {string} code an unique code to post a messages.
     * @param {object} eventData user defined object broadcast to listeners
     * @returns {void}
     */
    utility.prototype.post = function (code, eventData) {
        _subscriberArr = _subscription[code] || [];
        _arrLen = _subscriberArr.length;
        for (var _index = 0; _index < _arrLen; _index++) {
            try {
                _subscriber = _subscriberArr[_index];
                if (_subscriber.context) {
                    _subscriber.method.call(_subscriber.context, eventData); // call method in given context with event data
                } else {
                    _subscriber.method(eventData); // cal method in global context
                }

                // listener registered for single execution can be removed
                if (_subscriber.isOnce === true) {
                    _subscriberArr.splice(_index, 1);
                    _arrLen--; // adjust array length
                    _index--; // adjust loop index
                }
            } catch (ex) {
                _js.log.error("Error posting message to listener for code: %s at position: %s", code, _index, ex);
            }
        }
    };

    /**
     * Displays page loading bar
     * @memberOf utility
     * @since v1.0
     */
    utility.prototype.showProgress = function () {
        this.byId('loader').style.display = 'block';
    };

    /**
     * Hides page loading bar
     * @memberOf utility
     * @since v1.0
     */
    utility.prototype.hideProgress = function () {
        this.byId('loader').style.display = 'none';
    };

    /**
     * A no-op function.  Useful for passing around as a default callback.
     */
    utility.prototype.noop = function () {
        // do nothing
    };

    /**
     * Function to check the given string is a function call or just a function name
     * @param {string} str string that could be a function name or function body
     * @returns {boolean}
     * @memberOf utility
     * @since v1.1
     */
    utility.prototype.isFunctionName = function (str) {
        try {
            // default result is false
            _result = false;

            if (typeof str === "function") {
                _result = true;
            } else if (_functionNameRegEX.test(str) === true) {
                _result = eval("typeof " + str) === "function";
            }
        } catch (ex) {
            _js.log.error("Error evaluating function string: %s", str, ex);
        }

        return _result;
    };

    /**
     * Function returns a function object based on input
     * if input is a function name at windows context then the corresponding function is returned
     * any other string will be wrapped inside a new function as function body
     * @param {string} str string that could be a function name or function body
     * @param {Array} args array of arguments that will be passed to function at runtime
     * @returns {Function | undefined}
     * @memberOf utility
     * @since v1.1
     */
    utility.prototype.getFunctionFromString = function (str, args) {
        if (this.isEmpty(str)) {
            return undefined;
        }

        args = args || [];
        if (this.isFunctionName(str)) {
            return window[str];
        } else {
            return new Function(args, str);
        }
    };

    /**
     * Checks if the value is null, undefined or empty
     *
     * @param {*} value object value to be checked
     * @returns {boolean} true is value is empty, null or undefined
     * @memberOf utility
     * @since v1.1
     */
    utility.prototype.isEmpty = function (value) {
        if (value === undefined || value === null || value === "") {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Checks if the value is not null, not undefined or not empty
     *
     * @param {*} value object value to be checked
     * @returns {boolean} true is value is not empty, null or undefined
     * @memberOf utility
     * @since v1.1
     */
    utility.prototype.isNotEmpty = function (value) {
        return !this.isEmpty(value);
    };

    return utility;
}())();