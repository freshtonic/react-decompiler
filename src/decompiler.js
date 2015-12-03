import {isElement as isReact} from 'react-addons-test-utils';
import {html as htmlBeautify} from 'js-beautify';
import stringifyObject from './stringify-object';
import merge from 'object-assign';

const isDefaultValue = (component, prop) =>
  component.props[prop] === component.type.defaultProps[prop];

const relevantProps = (component, stripDefaultValueProps) => {
  if (!stripDefaultValueProps) {
    return component.props;
  } else {
    let props = {};
    Object.keys(component.props).filter(key => !isDefaultValue(component, key)).forEach(key => {
      props[key] = component.props[key];
    });
    return props;
  }
};

const getProps = (component, stripDefaultValueProps=false) =>
  merge(
    merge(
      getAttribute('key', component),
      getAttribute('ref', component)
    ),
    relevantProps(component, stripDefaultValueProps)
  );

const getAttribute = (attribute, component) =>
  component[attribute] ? {[attribute]: component[attribute]} : {};

const getChildren = component => getProps(component).children;

const getPropsKeys = (component, excludePropsWithDefaultValue) =>
  Object.keys(getProps(component, excludePropsWithDefaultValue)).filter(prop => prop !== 'children');

const getComponentName = component =>
  component.type.displayName || component.type.name;

const getComponentType = component =>
  getComponentName(component) || component.type;

const getPropValue = (component, prop) =>
  getProps(component)[prop];

const getFormatedPropValue = (propValue) =>
  typeof propValue === 'string' ? `"${stringifyItem(propValue)}"` : `{${stringifyItem(propValue)}}`;

const getComponentProp = (component, prop) =>
  getFormatedPropValue(getPropValue(component, prop));

const appendStringifiedProp = component => (accumulated, prop) =>
  `${accumulated} ${prop}=${getComponentProp(component, prop)}`;

const stringifyProps = (component, stripDefaultValueProps) =>
  getPropsKeys(component, stripDefaultValueProps).reduce(appendStringifiedProp(component), '');

const stringifyComposedComponent = (component, stripDefaultValueProps) =>
  `<${getComponentType(component)}${stringifyProps(component, stripDefaultValueProps)}>${stringifyItems(getChildren(component), stripDefaultValueProps)}</${getComponentType(component)}>`;

const stringifySimpleComponent = (component, stripDefaultValueProps) =>
  `<${getComponentType(component)}${stringifyProps(component, stripDefaultValueProps)} />`;

const stringifyComponent = (component, stripDefaultValueProps) =>
  getChildren(component) ? stringifyComposedComponent(component, stripDefaultValueProps) : stringifySimpleComponent(component, stripDefaultValueProps);

const stringifyFunction = value =>
  value.toString().replace(/ {[\s\S]*/, '{ ... }')

const stringifyValue = value => {
  switch (typeof value) {
    case 'function': return stringifyFunction(value);
    case 'object': return stringifyObject(value, {indent: ' '}).replace(/\n|  /g, '');
    case 'undefined': return 'undefined';
    default: return value.toString();
  }
}

const stringifyItem = (item, stripDefaultValueProps) =>
  isReact(item) ? stringifyComponent(item, stripDefaultValueProps) : stringifyValue(item);

const stringifyItems = (components, stripDefaultValueProps) =>
  [].concat(components).map(item => stringifyItem(item, stripDefaultValueProps)).join('');

export const decompile = stringifyItems;

export const formatted = (items, stripDefaultValueProps=false) => htmlBeautify(stringifyItems(items, stripDefaultValueProps), { indent_size: 2 });
