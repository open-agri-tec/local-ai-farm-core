import { Fragment, createElement } from './index.js';

export { Fragment };
export const jsx = (type, props, key) => createElement(type, { ...props, key });
export const jsxs = jsx;
