import { Operator } from '../src';
import { FactValueValidator } from '../src/operator';

describe('Operator', () => {
  describe('constructor()', () => {
    function subject(
      name?: string,
      cb?: (factValue: any, jsonvalue: any) => boolean,
      factValueValidator?: FactValueValidator
    ) {
      return new Operator(name!, cb!, factValueValidator);
    }

    test('adds the operator', () => {
      let operator = subject('startsWithLetter', (factValue, jsonValue) => {
        return factValue[0] === jsonValue;
      });
      expect(operator.name).toBe('startsWithLetter');
      expect(operator.cb).toBeInstanceOf(Function);
    });

    test('operator name', () => {
      expect(() => {
        subject();
      }).toThrowError(/Missing operator name/);
    });

    test('operator definition', () => {
      expect(() => {
        subject('startsWithLetter');
      }).toThrowError(/Missing operator callback/);
    });
  });
});
