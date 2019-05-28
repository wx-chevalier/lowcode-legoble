export class UndefinedFactError extends Error {
  code: string;

  constructor(...props: any[]) {
    super(...props);
    this.code = 'UNDEFINED_FACT';
  }
}
