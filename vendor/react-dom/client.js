import { Fragment, __prepareRender } from 'react';

const setProps = (element, props = {}) => {
  for (const [name, value] of Object.entries(props)) {
    if (name === 'children' || name === 'key' || value === false || value == null) continue;
    if (name === 'className') {
      element.setAttribute('class', value);
    } else if (name.startsWith('on') && typeof value === 'function') {
      element.addEventListener(name.slice(2).toLowerCase(), value);
    } else if (value === true) {
      element.setAttribute(name, '');
    } else {
      element.setAttribute(name, String(value));
    }
  }
};

const appendNode = (parent, node) => {
  if (Array.isArray(node)) {
    node.forEach((child) => appendNode(parent, child));
    return;
  }
  if (node == null || typeof node === 'boolean') return;
  if (typeof node === 'string' || typeof node === 'number') {
    parent.append(document.createTextNode(String(node)));
    return;
  }
  if (typeof node.type === 'function') {
    appendNode(parent, node.type(node.props ?? {}));
    return;
  }
  if (node.type === Fragment) {
    appendNode(parent, node.props?.children ?? []);
    return;
  }
  const element = document.createElement(String(node.type));
  setProps(element, node.props);
  appendNode(element, node.props?.children ?? []);
  parent.append(element);
};

export const createRoot = (container) => ({
  render(app) {
    const rerender = () => {
      __prepareRender(rerender);
      container.textContent = '';
      appendNode(container, app);
    };
    rerender();
  },
});
