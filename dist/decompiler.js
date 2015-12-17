'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _jsBeautify = require('js-beautify');

var _stringifyObject = require('./stringify-object');

var _stringifyObject2 = _interopRequireDefault(_stringifyObject);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var Decompiler = (function () {
  function Decompiler(options) {
    _classCallCheck(this, Decompiler);

    this.skipPropsWithNonDefaultValues = !!options.skipPropsWithNonDefaultValues;
  }

  _createClass(Decompiler, [{
    key: 'filteredProps',
    value: function filteredProps(component) {
      var _this = this;

      if (!this.skipPropsWithNonDefaultValues) {
        return component.props;
      } else {
        var _ret = (function () {
          var props = {};
          Object.keys(component.props).filter(function (key) {
            return !_this.isDefaultValue(component, key);
          }).forEach(function (key) {
            props[key] = component.props[key];
          });
          return {
            v: props
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
    }
  }, {
    key: 'isDefaultValue',
    value: function isDefaultValue(component, prop) {
      return component.type.defaultProps && component.props[prop] === component.type.defaultProps[prop];
    }
  }, {
    key: 'getProps',
    value: function getProps(component) {
      return (0, _objectAssign2['default'])((0, _objectAssign2['default'])(this.getAttribute('key', component), this.getAttribute('ref', component)), this.filteredProps(component));
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(attribute, component) {
      return component[attribute] ? _defineProperty({}, attribute, component[attribute]) : {};
    }
  }, {
    key: 'getChildren',
    value: function getChildren(component) {
      return this.getProps(component).children;
    }
  }, {
    key: 'getPropsKeys',
    value: function getPropsKeys(component) {
      return Object.keys(this.getProps(component)).filter(function (prop) {
        return prop !== 'children';
      });
    }
  }, {
    key: 'getComponentName',
    value: function getComponentName(component) {
      return component.type.displayName || component.type.name;
    }
  }, {
    key: 'getComponentType',
    value: function getComponentType(component) {
      return this.getComponentName(component) || component.type;
    }
  }, {
    key: 'getPropValue',
    value: function getPropValue(component, prop) {
      return this.getProps(component)[prop];
    }
  }, {
    key: 'getFormatedPropValue',
    value: function getFormatedPropValue(propValue) {
      return typeof propValue === 'string' ? '"' + this.stringifyItem(propValue) + '"' : '{' + this.stringifyItem(propValue) + '}';
    }
  }, {
    key: 'getComponentProp',
    value: function getComponentProp(component, prop) {
      return this.getFormatedPropValue(this.getPropValue(component, prop));
    }
  }, {
    key: 'appendStringifiedProp',
    value: function appendStringifiedProp(component) {
      var _this2 = this;

      return function (accumulated, prop) {
        return accumulated + ' ' + prop + '=' + _this2.getComponentProp(component, prop);
      };
    }
  }, {
    key: 'stringifyProps',
    value: function stringifyProps(component) {
      return this.getPropsKeys(component).reduce(this.appendStringifiedProp(component), '');
    }
  }, {
    key: 'stringifyComposedComponent',
    value: function stringifyComposedComponent(component) {
      return '<' + this.getComponentType(component) + this.stringifyProps(component) + '>' + this.stringifyItems(this.getChildren(component)) + '</' + this.getComponentType(component) + '>';
    }
  }, {
    key: 'stringifySimpleComponent',
    value: function stringifySimpleComponent(component) {
      return '<' + this.getComponentType(component) + this.stringifyProps(component) + ' />';
    }
  }, {
    key: 'stringifyComponent',
    value: function stringifyComponent(component) {
      return this.getChildren(component) ? this.stringifyComposedComponent(component) : this.stringifySimpleComponent(component);
    }
  }, {
    key: 'stringifyFunction',
    value: function stringifyFunction(value) {
      return value.toString().replace(/ {[\s\S]*/, '{ ... }');
    }
  }, {
    key: 'stringifyValue',
    value: function stringifyValue(value) {
      switch (typeof value) {
        case 'function':
          return this.stringifyFunction(value);
        case 'object':
          return (0, _stringifyObject2['default'])(value, { indent: ' ' }).replace(/\n|  /g, '');
        case 'undefined':
          return 'undefined';
        default:
          return value.toString();
      }
    }
  }, {
    key: 'stringifyItem',
    value: function stringifyItem(item) {
      return (0, _reactAddonsTestUtils.isElement)(item) ? this.stringifyComponent(item) : this.stringifyValue(item);
    }
  }, {
    key: 'stringifyItems',
    value: function stringifyItems(components) {
      var _this3 = this;

      return [].concat(components).map(function (item) {
        return _this3.stringifyItem(item);
      }).join('');
    }
  }]);

  return Decompiler;
})();

var decompile = function decompile(components) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Decompiler(options).stringifyItems(components);
};

exports.decompile = decompile;
var formatted = function formatted(components) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _jsBeautify.html)(new Decompiler(options).stringifyItems(components), { indent_size: 2 });
};
exports.formatted = formatted;
