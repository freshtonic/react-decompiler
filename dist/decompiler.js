'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _jsBeautify = require('js-beautify');

var _stringifyObject = require('./stringify-object');

var _stringifyObject2 = _interopRequireDefault(_stringifyObject);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var isDefaultValue = function isDefaultValue(component, prop) {
  return component.props[prop] === component.type.defaultProps[prop];
};

var relevantProps = function relevantProps(component, stripDefaultValueProps) {
  if (!stripDefaultValueProps) {
    return component.props;
  } else {
    var _ret = (function () {
      var props = {};
      Object.keys(component.props).filter(function (key) {
        return !isDefaultValue(component, key);
      }).forEach(function (key) {
        props[key] = component.props[key];
      });
      return {
        v: props
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  }
};

var getProps = function getProps(component) {
  var stripDefaultValueProps = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  return (0, _objectAssign2['default'])((0, _objectAssign2['default'])(getAttribute('key', component), getAttribute('ref', component)), relevantProps(component, stripDefaultValueProps));
};

var getAttribute = function getAttribute(attribute, component) {
  return component[attribute] ? _defineProperty({}, attribute, component[attribute]) : {};
};

var getChildren = function getChildren(component) {
  return getProps(component).children;
};

var getPropsKeys = function getPropsKeys(component, excludePropsWithDefaultValue) {
  return Object.keys(getProps(component, excludePropsWithDefaultValue)).filter(function (prop) {
    return prop !== 'children';
  });
};

var getComponentName = function getComponentName(component) {
  return component.type.displayName || component.type.name;
};

var getComponentType = function getComponentType(component) {
  return getComponentName(component) || component.type;
};

var getPropValue = function getPropValue(component, prop) {
  return getProps(component)[prop];
};

var getFormatedPropValue = function getFormatedPropValue(propValue) {
  return typeof propValue === 'string' ? '"' + stringifyItem(propValue) + '"' : '{' + stringifyItem(propValue) + '}';
};

var getComponentProp = function getComponentProp(component, prop) {
  return getFormatedPropValue(getPropValue(component, prop));
};

var appendStringifiedProp = function appendStringifiedProp(component) {
  return function (accumulated, prop) {
    return accumulated + ' ' + prop + '=' + getComponentProp(component, prop);
  };
};

var stringifyProps = function stringifyProps(component, stripDefaultValueProps) {
  return getPropsKeys(component, stripDefaultValueProps).reduce(appendStringifiedProp(component), '');
};

var stringifyComposedComponent = function stringifyComposedComponent(component, stripDefaultValueProps) {
  return '<' + getComponentType(component) + stringifyProps(component, stripDefaultValueProps) + '>' + stringifyItems(getChildren(component), stripDefaultValueProps) + '</' + getComponentType(component) + '>';
};

var stringifySimpleComponent = function stringifySimpleComponent(component, stripDefaultValueProps) {
  return '<' + getComponentType(component) + stringifyProps(component, stripDefaultValueProps) + ' />';
};

var stringifyComponent = function stringifyComponent(component, stripDefaultValueProps) {
  return getChildren(component) ? stringifyComposedComponent(component, stripDefaultValueProps) : stringifySimpleComponent(component, stripDefaultValueProps);
};

var stringifyFunction = function stringifyFunction(value) {
  return value.toString().replace(/ {[\s\S]*/, '{ ... }');
};

var stringifyValue = function stringifyValue(value) {
  switch (typeof value) {
    case 'function':
      return stringifyFunction(value);
    case 'object':
      return (0, _stringifyObject2['default'])(value, { indent: ' ' }).replace(/\n|  /g, '');
    case 'undefined':
      return 'undefined';
    default:
      return value.toString();
  }
};

var stringifyItem = function stringifyItem(item, stripDefaultValueProps) {
  return (0, _reactAddonsTestUtils.isElement)(item) ? stringifyComponent(item, stripDefaultValueProps) : stringifyValue(item);
};

var stringifyItems = function stringifyItems(components, stripDefaultValueProps) {
  return [].concat(components).map(function (item) {
    return stringifyItem(item, stripDefaultValueProps);
  }).join('');
};

var decompile = stringifyItems;

exports.decompile = decompile;
var formatted = function formatted(items) {
  var stripDefaultValueProps = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  return (0, _jsBeautify.html)(stringifyItems(items, stripDefaultValueProps), { indent_size: 2 });
};
exports.formatted = formatted;
