import { Condition } from '../src/condition';
import { defaultOperators } from '../src/engine-default-operators';
import { Almanac } from '../src/almanac';
import { Fact } from '../src/fact';
import { conditionFactory } from './support/condition-factory';

let operators = new Map();
defaultOperators.forEach(o => operators.set(o.name, o));

function condition(): {
  all: { id: string; fact: string; operator: string; value: number; path: string }[];
} {
  return {
    all: [
      {
        id: '6ed20017-375f-40c9-a1d2-6d7e0f4733c5',
        fact: 'team_participation',
        operator: 'equal',
        value: 50,
        path: '.metrics[0].forum-posts'
      }
    ]
  };
}

describe('Condition', () => {
  describe('constructor', () => {
    test('fact conditions have properties', () => {
      let properties = condition();
      let subject = new Condition(properties.all[0] as any);
      expect(subject).toHaveProperty('fact');
      expect(subject).toHaveProperty('operator');
      expect(subject).toHaveProperty('value');
      expect(subject).toHaveProperty('path');
    });

    test('boolean conditions have properties', () => {
      let properties = condition();
      let subject = new Condition(properties);
      expect(subject).toHaveProperty('operator');
      expect(subject).toHaveProperty('priority');
      expect(subject.priority).toBe(1);
    });
  });

  describe('toJSON', () => {
    test('converts the condition into a json string', () => {
      let properties = conditionFactory({
        fact: 'age',
        value: {
          fact: 'weight',
          params: {
            unit: 'lbs'
          },
          path: '.value'
        }
      });
      let condition = new Condition(properties as any);
      let json = condition.toJSON();
      expect(json).toBe(
        '{"operator":"equal","value":{"fact":"weight","params":{"unit":"lbs"},"path":".value"},"fact":"age"}'
      );
    });
  });

  describe('evaluate', () => {
    let conditionBase = conditionFactory({
      fact: 'age',
      value: 50
    });
    let condition: Condition;
    let almanac: Almanac;
    function setup(options?: any, factValue?: any) {
      if (typeof factValue === 'undefined') factValue = 1;
      let properties = Object.assign({}, conditionBase, options);
      condition = new Condition(properties);
      let fact = new Fact(conditionBase.fact, factValue);
      almanac = new Almanac(new Map([[fact.id, fact]]));
    }

    describe('validations', () => {
      beforeEach(() => setup());
      test('throws when missing an almanac', () => {
        return expect(condition.evaluate(undefined as any, operators)).rejects.toThrow(
          'almanac required'
        );
      });
      test('throws when missing operators', () => {
        return expect(condition.evaluate(almanac, undefined as any)).rejects.toThrow(
          'operatorMap required'
        );
      });
      test('throws when run against a boolean operator', () => {
        condition.all = [];
        return expect(condition.evaluate(almanac, operators)).rejects.toThrow(
          'Cannot evaluate() a boolean condition'
        );
      });
    });

    test('evaluates "equal"', async () => {
      setup({ operator: 'equal' }, 50);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
      setup({ operator: 'equal' }, 5);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
    });

    test('evaluates "notEqual"', async () => {
      setup({ operator: 'notEqual' }, 50);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
      setup({ operator: 'notEqual' }, 5);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
    });

    test('evaluates "in"', async () => {
      setup({ operator: 'in', value: [5, 10, 15, 20] }, 15);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
      setup({ operator: 'in', value: [5, 10, 15, 20] }, 99);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
    });

    test('evaluates "contains"', async () => {
      setup({ operator: 'contains', value: 10 }, [5, 10, 15]);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
      setup({ operator: 'contains', value: 10 }, [1, 2, 3]);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
    });

    test('evaluates "doesNotContain"', async () => {
      setup({ operator: 'doesNotContain', value: 10 }, [5, 10, 15]);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
      setup({ operator: 'doesNotContain', value: 10 }, [1, 2, 3]);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
    });

    test('evaluates "notIn"', async () => {
      setup({ operator: 'notIn', value: [5, 10, 15, 20] }, 15);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
      setup({ operator: 'notIn', value: [5, 10, 15, 20] }, 99);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
    });

    test('evaluates "lessThan"', async () => {
      setup({ operator: 'lessThan' }, 49);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
      setup({ operator: 'lessThan' }, 50);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
      setup({ operator: 'lessThan' }, 51);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
    });

    test('evaluates "lessThanInclusive"', async () => {
      setup({ operator: 'lessThanInclusive' }, 49);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
      setup({ operator: 'lessThanInclusive' }, 50);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
      setup({ operator: 'lessThanInclusive' }, 51);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
    });

    test('evaluates "greaterThan"', async () => {
      setup({ operator: 'greaterThan' }, 51);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
      setup({ operator: 'greaterThan' }, 49);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
      setup({ operator: 'greaterThan' }, 50);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
    });

    test('evaluates "greaterThanInclusive"', async () => {
      setup({ operator: 'greaterThanInclusive' }, 51);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
      setup({ operator: 'greaterThanInclusive' }, 50);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);
      setup({ operator: 'greaterThanInclusive' }, 49);
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
    });

    describe('invalid comparisonValues', () => {
      test('returns false when using contains or doesNotContain with a non-array', async () => {
        setup({ operator: 'contains' }, null);
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
        setup({ operator: 'doesNotContain' }, null);
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
      });

      test('returns false when using comparison operators with null', async () => {
        setup({ operator: 'lessThan' }, null);
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
        setup({ operator: 'lessThanInclusive' }, null);
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
        setup({ operator: 'greaterThan' }, null);
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
        setup({ operator: 'greaterThanInclusive' }, null);
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
      });

      test('returns false when using comparison operators with non-numbers', async () => {
        setup({ operator: 'lessThan' }, 'non-number');
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
        setup({ operator: 'lessThan' }, null);
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
        setup({ operator: 'lessThan' }, []);
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
        setup({ operator: 'lessThan' }, {});
        expect((await condition.evaluate(almanac, operators)).result).toBe(false);
      });
    });
  });

  describe('objects', () => {
    test('extracts the object property values using its "path" property', async () => {
      let condition = new Condition({
        operator: 'equal',
        path: '[0].id',
        fact: 'age',
        value: 50
      } as any);
      let ageFact = new Fact('age', [{ id: 50 }, { id: 60 }]);
      let facts = new Map([[ageFact.id, ageFact]]);
      let almanac = new Almanac(facts);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);

      condition.value = 100; // negative case
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
    });

    test('ignores "path" when non-objects are returned by the fact', async () => {
      let ageFact = new Fact('age', 50);
      let facts = new Map([[ageFact.id, ageFact]]);
      let almanac = new Almanac(facts);

      let condition = new Condition({
        operator: 'equal',
        path: '[0].id',
        fact: 'age',
        value: 50
      } as any);
      expect((await condition.evaluate(almanac, operators)).result).toBe(true);

      condition.value = 100; // negative case
      expect((await condition.evaluate(almanac, operators)).result).toBe(false);
    });
  });

  describe('boolean operators', () => {
    test('throws if not not an array', () => {
      let conditions = condition();
      conditions.all = { foo: true } as any;
      expect(() => new Condition(conditions)).toThrowError(/"all" must be an array/);
    });
  });

  describe('atomic facts', () => {
    test('throws if no options are provided', () => {
      expect(() => new (Condition as any)()).toThrowError(
        /Condition: constructor options required/
      );
    });

    test('throws for a missing "operator"', () => {
      let conditions = condition();
      delete conditions.all[0].operator;
      expect(() => new Condition(conditions)).toThrowError(
        /Condition: constructor "operator" property required/
      );
    });

    test('throws for a missing "fact"', () => {
      let conditions = condition();
      delete conditions.all[0].fact;
      expect(() => new Condition(conditions)).toThrowError(
        /Condition: constructor "fact" property required/
      );
    });

    test('throws for a missing "value"', () => {
      let conditions = condition();
      delete conditions.all[0].value;
      expect(() => new Condition(conditions)).toThrowError(
        /Condition: constructor "value" property required/
      );
    });
  });

  describe('complex conditions', () => {
    function complexCondition() {
      return {
        all: [
          {
            fact: 'age',
            operator: 'lessThan',
            value: 45
          },
          {
            fact: 'pointBalance',
            operator: 'greaterThanInclusive',
            value: 1000
          },
          {
            any: [
              {
                fact: 'gender',
                operator: 'equal',
                value: 'female'
              },
              {
                fact: 'income',
                operator: 'greaterThanInclusive',
                value: 50000
              }
            ]
          }
        ]
      };
    }
    test('recursively parses nested conditions', () => {
      expect(() => new Condition(complexCondition())).not.toThrowError();
    });

    test('throws if a nested condition is invalid', () => {
      let conditions = complexCondition();
      delete conditions.all[2].any![0].fact;
      expect(() => new Condition(conditions)).toThrowError(
        /Condition: constructor "fact" property required/
      );
    });
  });
});
