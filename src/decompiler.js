import {isElement as isReact} from 'react-addons-test-utils';
import {html as htmlBeautify} from 'js-beautify';
import stringifyObject from './stringify-object';
import merge from 'object-assign';

  
class Decompiler {
  constructor(options) {
    this.skipPropsWithNonDefaultValues =
      !!options.skipPropsWithNonDefaultValues;
  }

  filteredProps(component) {
    if (!this.skipPropsWithNonDefaultValues) {
      return component.props;
    } else {
      let props = {};
      Object.keys(component.props).
        filter(key => !this.isDefaultValue(component, key)).
          forEach(key => { props[key] = component.props[key]; });
      return props;
    }
  }

  isDefaultValue(component, prop) {
    return component.type.defaultProps &&
      component.props[prop] === component.type.defaultProps[prop];
  }

  getProps(component) {
    return merge(
      merge(
        this.getAttribute('key', component),
        this.getAttribute('ref', component)
      ),
      this.filteredProps(component)
    )
  }

  getAttribute(attribute, component) {
    return component[attribute] ? {[attribute]: component[attribute]} : {};
  }

  getChildren(component) {
    return this.getProps(component).children;
  }

  getPropsKeys(component) {
    return Object.keys(this.getProps(component)).filter(prop => prop !== 'children');
  }

  getComponentName(component) {
    return component.type.displayName || component.type.name;
  }

  getComponentType(component) {
    return this.getComponentName(component) || component.type;
  }

  getPropValue(component, prop) {
    return this.getProps(component)[prop];
  }

  getFormatedPropValue(propValue) {
    return typeof propValue === 'string' ? `"${this.stringifyItem(propValue)}"` : `{${this.stringifyItem(propValue)}}`;
  }

  getComponentProp(component, prop) {
    return this.getFormatedPropValue(this.getPropValue(component, prop));
  }

  appendStringifiedProp(component) {
    return (accumulated, prop) =>
      `${accumulated} ${prop}=${this.getComponentProp(component, prop)}`;
  }

  stringifyProps(component) {
    return this.getPropsKeys(component).reduce(this.appendStringifiedProp(component), '');
  }

  stringifyComposedComponent(component) {
    return `<${this.getComponentType(component)}${this.stringifyProps(component)}>${this.stringifyItems(this.getChildren(component))}</${this.getComponentType(component)}>`;
  }

  stringifySimpleComponent(component) {
    return `<${this.getComponentType(component)}${this.stringifyProps(component)} />`;
  }

  stringifyComponent(component) {
    return this.getChildren(component) ? this.stringifyComposedComponent(component) : this.stringifySimpleComponent(component);
  }

  stringifyFunction(value) {
    return value.toString().replace(/ {[\s\S]*/, '{ ... }');
  }

  stringifyValue(value) {
    switch (typeof value) {
      case 'function': return this.stringifyFunction(value);
      case 'object': return stringifyObject(value, {indent: ' '}).replace(/\n|  /g, '');
      case 'undefined': return 'undefined';
      default: return value.toString();
    }
  }

  stringifyItem(item) {
    return isReact(item) ? this.stringifyComponent(item) : this.stringifyValue(item);
  }

  stringifyItems(components) {
    return [].concat(components).map((item) => this.stringifyItem(item)).join('');
  }
}

export const decompile = function(components, options={}) {
  return (new Decompiler(options)).stringifyItems(components);
};

export const formatted = function(components, options={}) {
  return htmlBeautify((new Decompiler(options)).stringifyItems(components), { indent_size: 2 });
};

