declare module 'selectn' {
  function selectn<V>(path: string | string[], object?: object): Function | V | undefined;
  export = selectn;
}
