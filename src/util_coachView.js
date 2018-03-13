/**
 * @Title: util_coachView
 * @Author: Ganesh Kumar
 * @Version: 1.0
 * @Since: 1.0
 * @Description: JavaScript Utility for Coach view functions
 * @Copyright (c) 2016 Ganesh Kumar < ganeshkumar.jothikumar@gmail.com>
 */

_js.view = new (function () {
    'use strict';
    function View() {
    }

    var _viewPathSeparator = ">"; // private const variable to hold view path separator

    var _value; // temp variable to hold any value
    var _arr; // temp variable to hold arrays
    var _arrLen; // temp variable for array length
    var _element; // temp variable to hold dom element
    var _scope; // temp variable to hold coach view scope
    var _visibility; //temp variable to save visibility
    var _className; // temp variable to hold class name

    /*****************************************************************************************************************/
    /**************************************         Private Methods                ***********************************/
    /*****************************************************************************************************************/

    /**
     * IBM BPM Coach View Helper object.
     * @typedef {(object)} CoachViewHelper
     */

    /**
     * IBM BPM Coach View object.
     * @typedef {(object)} CoachView
     */

    /**
     * AngularJS scope object.
     * @typedef {(object)} ngScope
     */

    /**
     * Finds the HTML Element of Coach View by given view path. View path can be at high level, it need not follow a chain of parent to grand child.
     * example: View1>View2>View3>View4 cab be mentioned as View1>View4 provided View1 is the top level Coach View in this chain
     * @memberOf _js.view
     * @since v1.0
     * @param {string} viewPath path that uniquely identifies a Coach View.
     * @returns {Element} returns an HTML Element of coach view
     * @private
     */
    var _findViewElement = function (viewPath) {
        if (typeof viewPath != "string") {
            _js.log.trace("Error finding view, view path has to be of type string.\nPlease mention view path as 'View1>View2' or 'View1'.\nRead documentation for more examples.");
            return null;
        }

        if (!viewPath) {
            _js.log.trace("Error finding view, view path is not available.\nPlease mention view path as 'View1>View2' or 'View1'.\nRead documentation for more examples.");
            return null;
        }

        _element = null;
        _arr = viewPath.split(_viewPathSeparator);
        _arrLen = _arr ? _arr.length : 0;
        for (var index = 0; index < _arrLen; index++) {
            _element = _js.find(_js.constant.VIEW_SELECTOR.replace(":viewId", _arr[index]), _element);
        }

        return _element;
    };

    /**
     * Finds the HTML Element of Angular JS scope for a Coach View by given view path. View path can be at high level, it need not follow a chain of parent to grand child.
     * example: View1>View2>View3>View4 cab be mentioned as View1>View4 provided View1 is the top level Coach View in this chain
     * @memberOf _js.view
     * @since v1.0
     * @param {string} viewPath path that uniquely identifies a Coach View.
     * @returns {Element} returns an HTML Element of coach view
     * @private
     */
    var _findViewScopeElement = function (viewPath) {
        if (typeof viewPath != "string") {
            _js.log.trace("Error finding view, view path has to be of type string.\nPlease mention view path as 'View1>View2' or 'View1'.\nRead documentation for more examples.");
            return null;
        }

        if (!viewPath) {
            _js.log.trace("Error finding view, view path is not available.\nPlease mention view path as 'View1>View2' or 'View1'.\nRead documentation for more examples.");
            return null;
        }

        _element = null;
        _arr = viewPath.split(_viewPathSeparator);
        _arrLen = _arr ? _arr.length : 0;
        for (var index = 0; index < _arrLen; index++) {
            _element = _js.find(_js.constant.VIEW_SCOPE_SELECTOR.replace(":viewId", _arr[index]), _element);
        }

        return _element;
    };

    /**
     * Sets value to the binding object of coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {object} value object value for the coach view
     * @private
     */
    var _setValue = function (viewPath, value) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            if (!_hasBinding(_scope)) {
                _js.log.warn("The coach view you are trying to set binding value does not have a variable binding. Please bind a variable for coach view: " + viewPath);
                return;
            }

            _scope.context.binding.set('value', value);
        } catch (ex) {
            _js.log.error("Error setting binding value for Coach View: %s", viewPath, ex);
            throw ex;
        }
    };

    /**
     * Gets value of the binding object of coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @returns {object} object value for the coach view
     * @private
     */
    var _getValue = function (viewPath) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            if (_hasBinding(_scope)) {
                return _scope.context.binding.get("value");
            }
        } catch (ex) {
            _js.log.error("Error fetching binding value for Coach View: %s", viewPath, ex);
            throw ex;
        }
    };

    /**
     * Sets config option value to the coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} optionName name of the configuration option
     * @param {object} optionValue config option value for the coach view
     * @private
     */
    var _setOption = function (viewPath, optionName, optionValue) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            if (!_hasOption(_scope, optionName)) {
                // creates a dummy configuration param and assigns value
                _createOption(_scope, optionName, optionValue);
                return;
            }

            _scope.context.options[optionName].set('value', optionValue);
        } catch (ex) {
            _js.log.error("Error setting configuration option value for Coach View: %s, for option: %s", viewPath, optionName, ex);
            throw ex;
        }
    };

    /**
     * Gets config option value of coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} optionName name of the configuration option
     * @param {string} defaultOption default option value to be returned if configuration is not available
     * @returns {object} object config option value for the coach view
     * @private
     */
    var _getOption = function (viewPath, optionName, defaultOption) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            if (_hasOption(_scope, optionName)) {
                return _scope.context.options[optionName].get('value');
            }

            return defaultOption;
        } catch (ex) {
            _js.log.error("Error fetching configuration option value for Coach View: %s, for option: %s", viewPath, optionName, ex);
            throw ex;
        }
    };

    /**
     * Checks if the coach view has a binding object associated with it
     * @memberOf _js.view
     * @since v1.0
     * @param {CoachView/ngScope} scope scope of the coach view
     * @returns {boolean} returns true if binding object is available, false otherwise
     * @private
     */
    var _hasBinding = function (scope) {
        try {
            return _js.isNotEmpty(scope) && _js.isNotEmpty(scope.context)
                && _js.isNotEmpty(scope.context.binding) && _js.isNotEmpty(scope.context.binding.set);
        } catch (ex) {
            _js.log.error("Error checking binding value for Coach View", ex);
            throw ex;
        }
    };

    /**
     * Checks if the coach view has a configuration with given name associated with it
     * @memberOf _js.view
     * @since v1.0
     * @param {CoachView/ngScope} scope scope of the coach view
     * @param {string} optionName name of the configuration option
     * @returns {boolean} returns true if configuration object is available, false otherwise
     * @private
     */
    var _hasOption = function (scope, optionName) {
        try {
            return _js.isNotEmpty(scope) && _js.isNotEmpty(scope.context) && _js.isNotEmpty(scope.context.options)
                && _js.isNotEmpty(scope.context.options[optionName]) &&
                _js.isNotEmpty(scope.context.options[optionName].set);
        } catch (ex) {
            _js.log.error("Error checking configuration option value for Coach View", ex);
            throw ex;
        }
    };

    /**
     * Creates a dummy config option with given value. This is to help scenarios where an option does not have
     * binding to configuration, yet user would like to assign value at runtime
     * @memberOf _js.view
     * @since v1.0
     * @param {CoachView/ngScope} scope scope of the coach view
     * @param {string} optionName name of the configuration option
     * @param {object} value config option value for the coach view
     * @private
     */
    var _createOption = function (scope, optionName, value) {
        try {
            //TODO: Product Dependency
            if (_js.isNotEmpty(scope) && _js.isNotEmpty(scope.context) && _js.isNotEmpty(scope.context.options)
                && _js.isNotEmpty(scope.context.options._metadata) && _js.isNotEmpty(scope.context.options._metadata.label)
                && _js.isNotEmpty(scope.context.options._metadata.label.staticOptionStr)) {

                // creating a staticOptionStr something similar to "config.<configId>.<optionName>" based on "config.<configId>._metadata.label"
                _arr = scope.context.options._metadata.label.staticOptionStr.split('.');
                _arr.splice(2);
                _arr.push(optionName);

                // create option object and save to coach view
                scope.context.options[optionName] = _createBindingObject(_arr.join('.'), value);
                scope.context.options[optionName].staticOptionStr = _arr.join('.');
                scope.context.options[optionName].set('value', value);
            }
        } catch (ex) {
            _js.log.error("Error creating configuration option value for Coach View", ex);
            throw ex;
        }
    };

    /**
     * Internal BPM function recoded for flexibility. Based on IBM BPM 8.5.6
     * @memberOf _js.view
     * @since v1.0
     * @param {string} objectString static option string used internally by BPM
     * @param {object} value config option value for the coach view
     * @returns {object} object binding object created for coach view
     * @private
     */
    var _createBindingObject = function (objectString, value) {
        try {
            //TODO: Product Dependency
            return {
                get: function (property) {
                    return ( (property == "value") ? this.boundObject.get(this.property) : null );
                },
                set: function (property, value) {
                    if (property == "value") {
                        this.boundObject.set("value", value);
                    }
                },
                property: "value",
                boundObject: new com.ibm.bpm.coach.Stateful({
                    value: value
                }, objectString)
            };
        } catch (ex) {
            _js.log.error("Error creating configuration object for Coach View", ex);
            throw ex;
        }
    };

    /**
     * Checks if the coach view has a meta option with given name associated with it
     * @memberOf _js.view
     * @since v1.0
     * @param {CoachView/ngScope} scope scope of the coach view
     * @param {string} optionName name of the configuration option
     * @returns {boolean} returns true if configuration object is available, false otherwise
     * @private
     */
    var _hasOptionMeta = function (scope, optionName) {
        try {
            return _js.isNotEmpty(scope) && _js.isNotEmpty(_scope.context) && _js.isNotEmpty(_scope.context.options)
                && _js.isNotEmpty(_scope.context.options._metadata[optionName]) &&
                _js.isNotEmpty(scope.context.options._metadata[optionName].set);
        } catch (ex) {
            _js.log.error("Error checking meta option value for Coach View", ex);
            throw ex;
        }
    };

    /**
     * Sets the value of the specified meta option
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} optionName the name of the meta option
     * @param {object} optionValue meta option value for the coach view
     * @private
     */
    var _setOptionMeta = function (viewPath, optionName, optionValue) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            if (_hasOptionMeta(_scope, optionName)) {
                _scope.context.options._metadata[optionName].set("value", optionValue);
            }
        } catch (ex) {
            _js.log.error("Error setting option metadata value for Coach View: %s, option: %s", viewPath, optionName, ex);
            throw ex;
        }
    };

    /**
     * Gets the value of the specified meta option or <code>defaultValue</code>
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} optionName the name of the meta option to retrieve
     * @param {string} [defaultValue] defaultValue the default value of the meta option to be returned if the option is not available
     * @returns {string} the value of the specified meta option or <code>defaultValue</code> if the meta option is not available.
     */
    var _getOptionMeta = function (viewPath, optionName, defaultValue) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            if (_hasOptionMeta(_scope, optionName)) {
                return _scope.context.options._metadata[optionName].get("value");
            }
            return defaultValue;
        } catch (ex) {
            _js.log.error("Error fetching option metadata value for Coach View: %s, for metadata: %s", viewPath, optionName, ex);
            throw ex;
        }
    };

    /**
     * Gets the value of the specified meta option or <code>defaultValue</code>
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} [defaultVisibility] defaultVisibility the default visibility to be returned if the visibility is not available
     * @returns {string} the value of the visibility or <code>defaultVisibility</code> if the visibility is not available.
     * @private
     */
    var _getVisibility = function (viewPath, defaultVisibility) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            _visibility = _getOptionMeta(_scope, "visibility", defaultVisibility);
            if (_visibility === "DEFAULT") {
                _visibility = _scope.context.getInheritedVisibility();
            }

            if (_scope.context.element.className.indexOf("CoachView_hidden") > 0) {
                _visibility = _js.constant.VIEW_VISIBILITY.HIDDEN;
            }

            return _visibility;
        } catch (ex) {
            _js.log.error("Error fetching visibility for Coach View: %s", viewPath, ex);
            throw ex;
        }
    };

    /**
     * Sets the class name for coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} className class name to be added to coach view
     * @private
     */
    var _setClass = function (viewPath, className) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            _scope.context.element.className += " " + className;
        } catch (ex) {
            _js.log.error("Error adding class for Coach View: %s", viewPath, ex);
            throw ex;
        }
    };

    /**
     * Gets the class name for coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @returns {string|*} className class names of the coach view
     * @private
     */
    var _getClass = function (viewPath) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            return _scope.context.element.className;
        } catch (ex) {
            _js.log.error("Error fetching class names for Coach View: %s", viewPath, ex);
            throw ex;
        }
    };

    /**
     * Validates if the current coach view has valid value or any error exists
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @returns {boolean|*} true if there are no error and has a valid value. false otherwise
     * @private
     */
    var _isValid = function (viewPath) {
        try {
            _scope = typeof viewPath === "string" ? _js.view.findScope(viewPath) : viewPath;
            return _scope.isValid ? _scope.isValid() : _scope.context.element.firstElementChild.className.indexOf(_js.constant.ERROR_CLASS_NAME) >= 0;
        } catch (ex) {
            _js.log.error("Error checking if valid Coach View: %s", viewPath, ex);
            throw ex;
        }
    };

    var _setTabIndex = function (viewId, tabIndex) {

    };

    var _getTabIndex = function (viewId) {

    };

    var _setFlexPoint = function (viewId, flexPoint) {

    };

    var _getFlexPoint = function (viewId) {

    };

    var _setDeviceConfig = function (viewId, config) {

    };

    var _getDeviceConfig = function (viewId) {

    };

    /*****************************************************************************************************************/
    /**************************************         Public Methods                ************************************/
    /*****************************************************************************************************************/

    /**
     * Finds the nearest coach view dom element id by traversing through parent views from current view.
     * This method is used when we are not sure of the view hierarchy, in case of a well know hierarchical
     * coach view structure, please user "findView"
     * @memberOf _js.view
     * @since v1.1
     * @param {CoachView} currentView an instance of the coach view
     * @param {string} viewId view id that uniquely identifies a Coach View
     * @returns {string | undefined} dom element id of the nearest view | undefined when not found
     */
    View.prototype.findNearestViewDomIdById = function (currentView, viewId) {
        var _viewElementList = _js.findAll(_js.constant.VIEW_SELECTOR.replace(':viewId', viewId));

        // add render error when table view is not found
        if (_js.isEmpty(_viewElementList) || _viewElementList.length == 0) {
            return;
        }

        // return first item from the node list
        if (_viewElementList.length == 1) {
            return _viewElementList[0].id;
        }

        // in case of multiple views with same view id, find the closest one by
        // traversing the parent tree
        var _viewElement, _parentView = currentView;
        for (; _parentView && _parentView.context; _parentView = _parentView.context.parentView()) {
            if (!_parentView || !_parentView.context) {
                return;
            }

            _viewElement = _js.find(_js.constant.VIEW_SELECTOR.replace(":viewId", viewId), _parentView.context.element);
            if (_viewElement) {
                break;
            }
        }

        return _viewElement.id;
    };

    /**
     * Finds the nearest coach view instance by traversing through parent views from current view.
     * This method is used when we are not sure of the view hierarchy, in case of a well know hierarchical
     * coach view structure, please user "findView"
     * @memberOf _js.view
     * @since v1.1
     * @param {CoachView} currentView an instance of the coach view
     * @param {string} viewId view id that uniquely identifies a Coach View
     * @returns {CoachView | undefined} an instance of the coach view | undefined when not found
     */
    View.prototype.findNearestViewById = function (currentView, viewId) {
        try {
            // find the nearest coach view dom element id
            _value = this.findNearestViewDomIdById(currentView, viewId);

            return com_ibm_bpm_global.coachView.byDomId(_value); //TODO: Product Dependency
        } catch (ex) {
            _js.log.error("Error finding Nearest Coach View for view id: %s", viewId, ex);
            throw ex;
        }
    };

    /**
     * Finds the Coach View class by given view path. View path can be at high level, it need not follow a chain of parent to grand child.
     * example: View1>View2>View3>View4 cab be mentioned as View1>View4 provided View1 is the top level Coach View in this chain
     * @memberOf _js.view
     * @since v1.0
     * @param {string} viewPath path that uniquely identifies a Coach View
     * @returns {CoachView} returns an instance of the coach view
     */
    View.prototype.findView = function (viewPath) {
        try {
            _element = _findViewElement(viewPath);

            // BPM refers coach view by actual coach view dom element id
            // set parent to the control element as coach view element
            _element = _element.classList.contains('CoachView') ? _element : (_js.isNotEmpty(_element.parentElement) ? _element.parentElement : _element);

            return com_ibm_bpm_global.coachView.byDomId(_element.id); //TODO: Product Dependency
        } catch (ex) {
            _js.log.error("Error finding Coach View for view path: %s", viewPath, ex);
            throw ex;
        }
    };

    /**
     * Finds the scope of a angularJS based vby given view path. View path can be at high level, it need not follow a chain of parent to grand child.
     * example: View1>View2>View3>View4 cab be mentioned as View1>View4 provided View1 is the top level Coach View in this chain
     * @memberOf _js.view
     * @since v1.0
     * @param {string} viewPath path that uniquely identifies a Coach View
     * @returns {ngScope} returns controller scope of the coach view
     */
    View.prototype.findScope = function (viewPath) {
        try {
            _element = _findViewScopeElement(viewPath);
            return angular.element(_element).scope() || this.findView(viewPath);
        } catch (ex) {
            _js.log.error("Error finding View scope for view path: %s", viewPath, ex);
            throw ex;
        }
    };

    /**
     * Gets/Sets value of the binding object of coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {object} value object value for the coach view
     * @returns {object} object value for the coach view
     */
    View.prototype.value = function (viewPath, value) {
        if (_js.isNotEmpty(value)) {
            _setValue(viewPath, value);
        } else {
            return _getValue(viewPath);
        }
    };

    /**
     * Gets/Sets value of the config option object of coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} optionName name of the configuration option
     * @param {object} value configuration option value for the coach view
     * @param {string} [defaultOption] - default option value to be returned if configuration is not available, used only fot get
     * @returns {object} object config option value for the coach view
     */
    View.prototype.option = function (viewPath, optionName, value, defaultOption) {
        if (_js.isNotEmpty(value)) {
            _setOption(viewPath, optionName, value);
        } else {
            return _getOption(viewPath, optionName, defaultOption);
        }
    };

    /**
     * Gets/Sets visibility of coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} value visibility value for the coach view. valid values are REQUIRED, EDITABLE, READONLY, NONE, DEFAULT, HIDDEN
     * @param {string} defaultVisibility default visibility value to be returned if visibility is not available, used only fot get
     * @returns {string} visibility of the coach view
     */
    View.prototype.visibility = function (viewPath, value, defaultVisibility) {
        if (_js.isNotEmpty(value)) {
            if (!_js.constant.VIEW_VISIBILITY[value]) {
                _js.log.error("Invalid visibility value: %s for coach view: %s. Valid values are REQUIRED, EDITABLE, READONLY, NONE, DEFAULT, HIDDEN", value, viewPath);
                throw "Invalid visibility value: " + value;
            }

            // set only valid visibility value
            _setOptionMeta(viewPath, "visibility", value);
        } else {
            return _getVisibility(viewPath, defaultVisibility);
        }
    };

    /**
     * Checks if the coach view is visible to end user in browser
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @returns {boolean} returns true if visible in browser irrespective of disabled or editable, false otherwise
     */
    View.prototype.isVisible = function (viewPath) {
        _visibility = _getVisibility(viewPath);
        if (_js.isNotEmpty(_js.constant.VIEW_VISIBLE_VISIBILITY[_visibility])) {
            return false; // HIDDEN or NONE
        }

        return true;
    };

    /**
     * Sets display as true for coach view and displays the coach view in browser
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     */
    View.prototype.show = function (viewPath) {
        try {
            _scope = typeof viewPath === "string" ? this.findScope(viewPath) : viewPath;
            _scope.context.setDisplay(true);
        } catch (ex) {
            _js.log.error("Error setting display(show) for Coach View: %s", viewPath, ex);
            throw ex;
        }
    };

    /**
     * Sets display as false for coach view and hides the coach view in browser
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     */
    View.prototype.hide = function (viewPath) {
        try {
            _scope = typeof viewPath === "string" ? this.findScope(viewPath) : viewPath;
            _scope.context.setDisplay(false);
        } catch (ex) {
            _js.log.error("Error setting display(hide) for Coach View: %s", viewPath, ex);
            throw ex;
        }
    };

    /**
     * Gets/Sets label for coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} label label to be set for coach view
     * @returns {string} label of the coach view, only for get
     */
    View.prototype.label = function (viewPath, label) {
        if (label != null && label != undefined && label != "") {
            _setOptionMeta(viewPath, "label", label);
        } else {
            return _getOptionMeta(viewPath, "label");
        }
    };

    /**
     * Gets/Sets label visibility of coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} value label visibility for the coach view. valid values are REQUIRED, EDITABLE, READONLY, NONE, DEFAULT, HIDDEN
     * @param {string} defaultVisibility default label visibility value to be returned if label visibility is not available, used only fot get
     * @returns {string} label visibility of the coach view only for get
     */
    View.prototype.labelVisibility = function (viewPath, value, defaultVisibility) {
        if (value != null && value != undefined && value != "") {
            if (!_js.constant.LABEL_VISIBILITY[value]) {
                _js.log.error("Invalid label visibility value: %s for coach view: %s. Valid values are SHOW and HIDE", value, viewPath);
                throw "Invalid label visibility value: " + value;
            }

            // set only valid visibility value
            _setOptionMeta(viewPath, "labelVisibility", value);
        } else {
            return _getOptionMeta(viewPath, "labelVisibility", defaultVisibility);
        }
    };

    /**
     * Checks if the coach view is enabled for end user to edit in browser
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @returns {boolean} returns true if editable in browser, false otherwise
     */
    View.prototype.isEnabled = function (viewPath) {
        _visibility = _getVisibility(viewPath);
        if (!_js.constant.VIEW_VISIBLE_VISIBILITY[_visibility]) {
            return false; // HIDDEN or NONE
        }

        return _visiblity != "READONLY";
    };

    /**
     * Gets/Sets class name of coach view
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} className class name for the coach view.
     * @returns {string|*} class name for the coach view.
     */
    View.prototype.className = function (viewPath, className) {
        if (className != null && className != undefined && className != "") {
            _setClass(viewPath, className);
        } else {
            return _getClass(viewPath);
        }
    };

    /**
     * Checks if coach view has given class name
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @param {string} className class name for the coach view.
     * @returns {boolean|*} true if class name exists. false otherwise
     */
    View.prototype.hasClass = function (viewPath, className) {
        _className = _getClass(viewPath);
        return !!(_className && _className.indexOf(className) >= 0);
    };

    /**
     * Validates if the current coach view has valid value or any error exists
     * @memberOf _js.view
     * @since v1.0
     * @param {string|CoachView|ngScope} viewPath path that uniquely identifies a Coach View. Optionally an instance of coach view or ngScope can be passed
     * @returns {boolean|*} true if there are no error and has a valid value. false otherwise
     */
    View.prototype.isValid = function (viewPath) {
        return _isValid(viewPath);
    };

    /**
     * Gets the angular controller name for coach view
     *
     * @memberOf _js.view
     * @since v1.1
     * @param {CoachView|ngScope|Element} view An instance of coach view or ngScope or Coach View Element
     * @returns {string} name of the angular controller for coach view
     */
    View.prototype.getControllerName = function (view) {
        try {
            if (_js.isEmpty(view)) {
                return undefined;
            }

            if (_js.isNotEmpty(view.context)) {
                view = view.context.element;
            }

            view = _js.find("[ng-controller]", view);
            return _js.attr(view, "ng-controller");
        } catch (ex) {
            _js.log.error("Error finding controller name for view: %s", view, ex);
            throw ex;
        }
    };

    View.prototype.setMessage = function (viewPath, messageData) {
        _js.log.debug("Functionality under construction");
    };

    View.prototype.uID = function (viewPath) {
        _js.log.debug("Functionality under construction");
    };

    View.prototype.tabIndex = function (viewPath) {
        _js.log.debug("Functionality under construction");
    };

    View.prototype.deviceConfig = function (viewPath) {
        _js.log.debug("Functionality under construction");
    };

    View.prototype.flexPoint = function (viewPath) {
        _js.log.debug("Functionality under construction");
    };

    return View;
}())();