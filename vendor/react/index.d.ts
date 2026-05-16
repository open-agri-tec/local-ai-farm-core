export type ReactNode = unknown;
export type FormEvent<T = Element> = Event & { currentTarget: T };
export const Fragment: unique symbol;
export function createElement(type: unknown, props?: Record<string, unknown> | null, ...children: unknown[]): unknown;
export function StrictMode(props: { children?: ReactNode }): unknown;
export function useState<T>(initialValue: T | (() => T)): [T, (nextValue: T | ((current: T) => T)) => void];
export function useEffect(callback: () => void | (() => void), dependencies?: unknown[]): void;
export function useMemo<T>(factory: () => T, dependencies?: unknown[]): T;


declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}
