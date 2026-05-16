let hookValues = [];
let hookIndex = 0;
let renderCallback = () => {};

export const Fragment = Symbol('Fragment');

export const createElement = (type, props, ...children) => ({
  type,
  props: { ...(props ?? {}), children: children.flat() },
});

export const StrictMode = ({ children }) => children;

export const useState = (initialValue) => {
  const currentIndex = hookIndex;
  hookValues[currentIndex] = hookValues[currentIndex] ?? (typeof initialValue === 'function' ? initialValue() : initialValue);
  const setValue = (nextValue) => {
    const currentValue = hookValues[currentIndex];
    hookValues[currentIndex] = typeof nextValue === 'function' ? nextValue(currentValue) : nextValue;
    renderCallback();
  };
  hookIndex += 1;
  return [hookValues[currentIndex], setValue];
};

export const useEffect = (callback) => {
  callback();
};

export const useMemo = (factory) => factory();

export const __prepareRender = (callback) => {
  hookIndex = 0;
  renderCallback = callback;
};
