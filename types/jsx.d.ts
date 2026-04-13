// Provide a minimal global JSX namespace so upstream TS sources
// (e.g. packages that ship .ts sources) can reference `JSX`.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
