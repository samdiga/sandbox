/**
 * @Title: util_const
 * @Author: Ganesh Kumar
 * @Version: 1.0
 * @Since: 1.0
 * @Description: Material Coach Constant file
 * @Copyright (c) 2016 Ganesh Kumar < ganeshkumar.jothikumar@gmail.com>
 */


_js.constant = new (function () {
    'use strict';
    function Constant(){};

    // UTILITY Constants
    const LOG_LEVEL = {"TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3, "ERROR": 4};
    const LOG_TIME_START = 'START';
    const LOG_TIME_END = 'END';

    // COLOR Shade Constants
    const SHADE_LEVEL = { "LIGHTER" : "LIGHTER", "LIGHT" : "LIGHT", "MAIN" : "MAIN", "DARK" : "DARK", "DARKER" : "DARKER"};

    // COACH VIEW Constants
    const ERROR_CLASS_NAME = 'has-error';
    const VIEW_VISIBLE_VISIBILITY = {'REQUIRED': 'REQUIRED', 'EDITABLE': 'EDITABLE', 'READONLY': 'READONLY', 'DEFAULT': 'DEFAULT'};
    const VIEW_VISIBILITY = {'REQUIRED': 'REQUIRED', 'EDITABLE': 'EDITABLE', 'READONLY': 'READONLY', 'DEFAULT': 'DEFAULT', 'NONE': 'NONE', 'HIDDEN': 'HIDDEN'};
    const LABEL_VISIBILITY = {'SHOW': 'SHOW', 'HIDE': 'HIDE'};
    const VIEW_SELECTOR = '[data-viewid=":viewId"]';
    const VIEW_SCOPE_SELECTOR = '[data-viewid=":viewId"] > [ng-controller]';
    const EVENT_BOOTSTRAP_COMPLETED = 'BOOTSTRAP_COMPLETED';
    const ATTR_DATA_PROGRESS = 'data-progress';

    const ATTR = {
        DATA_VIEW_ID : 'data-viewid',
        DATA_PROGRESS: 'data-progress',
        DATA_CONFIG: 'data-config',
        DATA_TYPE: 'data-type',
        DATA_BINDING: 'data-binding',
        DATA_BINDING_TYPE: 'data-bindingType'
    };

    const REGEXP = {
        INDEXED_BINDING : /(\[+[a-zA-Z0-9]*\]+)/
    };

    Constant.prototype = {
        LOG_LEVEL: LOG_LEVEL,
        LOG_TIME_START: LOG_TIME_START,
        LOG_TIME_END: LOG_TIME_END,
        ERROR_CLASS_NAME: ERROR_CLASS_NAME,
        VIEW_VISIBILITY: VIEW_VISIBILITY,
        LABEL_VISIBILITY: LABEL_VISIBILITY,
        VIEW_VISIBLE_VISIBILITY: VIEW_VISIBLE_VISIBILITY,
        VIEW_SELECTOR: VIEW_SELECTOR,
        VIEW_SCOPE_SELECTOR: VIEW_SCOPE_SELECTOR,
        EVENT_BOOTSTRAP_COMPLETED: EVENT_BOOTSTRAP_COMPLETED,
        SHADE_LEVEL: SHADE_LEVEL,
        ATTR_DATA_PROGRESS: ATTR_DATA_PROGRESS,
        ATTR: ATTR,
        REGEXP: REGEXP
    };

    return Constant;
}())();