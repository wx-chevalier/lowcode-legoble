import { Operator } from './operator';

export const defaultOperators: Operator[] = [];
defaultOperators.push(new Operator('equal', (a: any, b: any) => a === b));
defaultOperators.push(new Operator('notEqual', (a: any, b: any) => a !== b));
defaultOperators.push(new Operator('in', (a: any, b: any) => b.indexOf(a) > -1));
defaultOperators.push(new Operator('notIn', (a: any, b: any) => b.indexOf(a) === -1));

defaultOperators.push(
  new Operator('contains', (a: any, b: any) => a.indexOf(b) > -1, Array.isArray)
);
defaultOperators.push(
  new Operator('doesNotContain', (a: any, b: any) => a.indexOf(b) === -1, Array.isArray)
);

function numberValidator(factValue: string) {
  return Number.parseFloat(factValue).toString() !== 'NaN';
}
defaultOperators.push(new Operator('lessThan', (a: any, b: any) => a < b, numberValidator));
defaultOperators.push(
  new Operator('lessThanInclusive', (a: any, b: any) => a <= b, numberValidator)
);
defaultOperators.push(new Operator('greaterThan', (a: any, b: any) => a > b, numberValidator));
defaultOperators.push(
  new Operator('greaterThanInclusive', (a: any, b: any) => a >= b, numberValidator)
);
