/**
 * @Title: util_logger
 * @Author: Ganesh Kumar
 * @Version: 1.0
 * @Since: 1.0
 * @Description: JavaScript logger Utility
 * @Copyright (c) 2016 Ganesh Kumar < ganeshkumar.jothikumar@gmail.com>
 */

_js.log = new (function () {
    'use strict';
    var _logLevel = (dojoConfig && dojoConfig.isDebug) ? _js.constant.LOG_LEVEL.DEBUG : _js.constant.LOG_LEVEL.INFO;

    // constructor
    function Logger() {
    };

    /**
     * Prints log message with trace
     *
     * @param {string} log message to be printed in console
     * @param {string} path optional caller path to be displayed with log message
     * @memberOf Logger
     * @since v1.0
     */
    Logger.prototype.trace = function () {
        if (_logLevel != _js.constant.LOG_LEVEL.TRACE) {
            return;
        }

        // trace might fail in case of callee couldn't be reached
        try {
            console.trace.apply(console, arguments);
        } catch (ex) {
            // ignore
        }
    };

    /**
     * Prints log message in debug
     *
     * @param {string} log message to be printed in console
     * @param {string} path optional caller path to be displayed with log message
     * @memberOf Logger
     * @since v1.0
     */
    Logger.prototype.debug = function () {
        if (_logLevel <= _js.constant.LOG_LEVEL.DEBUG) {
            console.debug.apply(console, arguments);
        }
    };

    /**
     * Prints log message as info
     *
     * @param {string} log message to be printed in console
     * @param {string} path optional caller path to be displayed with log message
     * @memberOf Logger
     * @since v1.0
     */
    Logger.prototype.info = function () {
        if (_logLevel <= _js.constant.LOG_LEVEL.INFO) {
            console.info.apply(console, arguments);
        }
    };

    /**
     * Prints log message as warning
     *
     * @param {string} log message to be printed in console
     * @param {string} path optional caller path to be displayed with log message
     * @memberOf Logger
     * @since v1.0
     */
    Logger.prototype.warn = function () {
        if (_logLevel <= _js.constant.LOG_LEVEL.WARN) {
            console.warn.apply(console, arguments);
        }
    };

    /**
     * Prints log message as error
     *
     * @param {string} log message to be printed in console
     * @param {object} error exception stacktrace or an error object from catch
     * @param {string} path optional caller path to be displayed with log message
     * @memberOf Logger
     * @since v1.0
     */
    Logger.prototype.error = function () {
        try {
            console.error.apply(console, arguments);
        } catch (ex) {
            //do nothing
        }
    };

    /**
     * Captures time between start and end of operation by name and logs the time in debug
     *
     * @param {string} type START/END denotes start or end of an operation
     * @param {string} code code to identify the time between operation
     * @memberOf Logger
     * @since v1.0
     */
    Logger.prototype.time = function (type, code) {
        if (_logLevel > _js.constant.LOG_LEVEL.DEBUG) {
            return;
        }

        type == _js.constant.LOG_TIME_START ? console.time(code) : console.timeEnd(code);
    };

    /**
     * Sets the log level for the application session
     *
     * @param {string} logLevel log level for current session
     * @memberOf Logger
     * @since v1.0
     */
    Logger.prototype.setLevel = function (logLevel) {
        _logLevel = logLevel;
    };

    /**
     * Returns current log level for the application session
     * @memberOf  Logger
     * @since v1.0
     */
    Logger.prototype.getLevel = function () {
        return _logLevel;
    };
    
    return Logger;
}())();