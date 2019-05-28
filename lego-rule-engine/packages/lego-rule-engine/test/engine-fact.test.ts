import { engineFactory } from '../src';
import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { ConditionConstructorOptions } from '../src/condition';

const CHILD = 14;
const ADULT = 75;

async function eligibilityField(params: any) {
  if (params.field === 'age') {
    if (params.eligibilityId === 1) {
      return CHILD;
    }
    return ADULT;
  }
}

async function eligibilityData(params: any) {
  let address = {
    street: '123 Fake Street',
    state: {
      abbreviation: 'CO',
      name: 'Colorado'
    },
    zip: '80403',
    'dot.property': 'dot-property-value',
    occupantHistory: [{ name: 'Joe', year: 2011 }, { name: 'Jane', year: 2013 }]
  };
  if (params.eligibilityId === 1) {
    return { age: CHILD, address };
  }
  return { age: ADULT, address };
}

describe('Engine: fact evaluation', () => {
  let engine: Engine;
  let event = {
    type: 'ageTrigger',
    params: {
      demographic: 'under50'
    }
  };

  function baseConditions(): any {
    return {
      any: [
        {
          fact: 'eligibilityField',
          operator: 'lessThan',
          params: {
            eligibilityId: 1,
            field: 'age'
          },
          value: 50
        }
      ]
    };
  }

  let successSpy = jest.fn();
  let failureSpy = jest.fn();
  beforeEach(() => {
    successSpy = jest.fn();
    failureSpy = jest.fn();
  });

  function setup(conditions = baseConditions(), engineOptions = {}) {
    engine = engineFactory([], engineOptions);
    let rule = ruleFactory({ conditions, event });
    engine.addRule(rule);
    engine.addFact('eligibilityField', eligibilityField);
    engine.addFact('eligibilityData', eligibilityData);
    engine.on('success', successSpy);
    engine.on('failure', failureSpy);
  }

  describe('options', () => {
    describe('options.allowUndefinedFacts', () => {
      test('throws when fact is undefined by default', async () => {
        let conditions = Object.assign({}, baseConditions());
        conditions.any.push({
          fact: 'undefined-fact',
          operator: 'equal',
          value: true
        });
        setup(conditions);
        return expect(engine.run()).rejects.toThrow(/Undefined fact: undefined-fact/);
      });

      describe('treats undefined facts as falsey when allowUndefinedFacts is set', () => {
        test('emits "success" when the condition succeeds', async () => {
          let conditions = Object.assign({}, baseConditions());
          conditions.any.push({
            fact: 'undefined-fact',
            operator: 'equal',
            value: true
          });
          setup(conditions, { allowUndefinedFacts: true });
          await engine.run();
          expect(successSpy.mock.calls.length);
          expect(!successSpy.mock.calls.length);
        });

        test('emits "failure" when the condition fails', async () => {
          let conditions = Object.assign({}, baseConditions());
          conditions.any.push({
            fact: 'undefined-fact',
            operator: 'equal',
            value: true
          });
          conditions.any[0].params.eligibilityId = 2;
          setup(conditions, { allowUndefinedFacts: true });
          await engine.run();
          expect(!successSpy.mock.calls.length);
          expect(failureSpy.mock.calls.length);
        });
      });
    });
  });

  describe('params', () => {
    test('emits when the condition is met', async () => {
      setup();
      await engine.run();
      expect(successSpy.mock.calls[0][0]).toEqual(event);
    });

    test('does not emit when the condition fails', async () => {
      let conditions = Object.assign({}, baseConditions());
      conditions.any[0].params.eligibilityId = 2;
      setup(conditions);
      await engine.run();
      expect(!successSpy.mock.calls.length);
    });
  });

  describe('path', () => {
    function conditions(): ConditionConstructorOptions {
      return {
        any: [
          {
            fact: 'eligibilityData',
            operator: 'lessThan',
            path: '.age',
            params: {
              eligibilityId: 1
            },
            value: 50
          }
        ]
      };
    }

    test('emits when the condition is met', async () => {
      setup(conditions());
      await engine.run();
      expect(successSpy.mock.calls[0][0]).toEqual(event);
    });

    test('does not emit when the condition fails', async () => {
      let failureCondition = conditions();
      (failureCondition as any).any[0].params.eligibilityId = 2;
      setup(failureCondition);
      await engine.run();
      expect(!successSpy.mock.calls.length);
    });

    describe('complex paths', () => {
      test('correctly interprets "path" when dynamic facts return objects', async () => {
        let complexCondition = conditions();
        (complexCondition as any).any[0].path = '.address.occupantHistory[0].year';
        (complexCondition as any).any[0].value = 2011;
        (complexCondition as any).any[0].operator = 'equal';
        setup(complexCondition);
        await engine.run();
        expect(successSpy.mock.calls[0][0]).toEqual(event);
      });

      test('correctly interprets "path" when target object properties have dots', async () => {
        let complexCondition = conditions();
        (complexCondition as any).any[0].path = ['address', 'dot.property'];
        (complexCondition as any).any[0].value = 'dot-property-value';
        (complexCondition as any).any[0].operator = 'equal';
        setup(complexCondition);
        await engine.run();
        expect(successSpy.mock.calls[0][0]).toEqual(event);
      });

      test('correctly interprets "path" with runtime fact objects', async () => {
        let fact = { x: { y: 1 }, a: 2 };
        let conditions = {
          all: [
            {
              fact: 'x',
              path: '.y',
              operator: 'equal',
              value: 1
            }
          ]
        };
        let event = {
          type: 'runtimeEvent'
        };

        engine = engineFactory([]);
        let rule = ruleFactory({ conditions, event });
        engine.addRule(rule);
        engine.on('success', successSpy);
        engine.on('failure', failureSpy);
        await engine.run(fact);
        expect(successSpy.mock.calls[0][0]).toEqual(event);
        expect(!failureSpy.mock.calls.length || failureSpy.mock.calls[0][0]).not.toEqual(event);
      });
    });

    test('does not emit when complex object paths fail the condition', async () => {
      let complexCondition = conditions();
      (complexCondition as any).any[0].path = '.address.occupantHistory[0].year';
      (complexCondition as any).any[0].value = 2010;
      (complexCondition as any).any[0].operator = 'equal';
      setup(complexCondition);
      await engine.run();
      expect(!successSpy.mock.calls.length || successSpy.mock.calls[0][0]).not.toEqual(event);
    });

    test('treats invalid object paths as undefined', async () => {
      let complexCondition = conditions();
      (complexCondition as any).any[0].path = '.invalid.object[99].path';
      (complexCondition as any).any[0].value = undefined;
      (complexCondition as any).any[0].operator = 'equal';
      setup(complexCondition);
      await engine.run();
      expect(successSpy.mock.calls[0][0]).toEqual(event);
    });

    test('ignores "path" when facts return non-objects', async () => {
      setup(conditions());
      let eligibilityData = async () => {
        return CHILD;
      };
      engine.addFact('eligibilityData', eligibilityData);
      await engine.run();
      expect(successSpy.mock.calls[0][0]).toEqual(event);
    });
  });

  describe('promises', () => {
    test('works with asynchronous evaluations', async () => {
      setup();
      let eligibilityField = function() {
        return new Promise((resolve, reject) => {
          setImmediate(() => {
            resolve(30);
          });
        });
      };
      engine.addFact('eligibilityField', eligibilityField);
      await engine.run();
      expect(successSpy.mock.calls.length);
    });
  });

  describe('synchronous functions', () => {
    test('works with synchronous, non-promise evaluations that are truthy', async () => {
      setup();
      let eligibilityField = function() {
        return 20;
      };
      engine.addFact('eligibilityField', eligibilityField);
      await engine.run();
      expect(successSpy.mock.calls.length);
    });

    test('works with synchronous, non-promise evaluations that are falsey', async () => {
      setup();
      let eligibilityField = function() {
        return 100;
      };
      engine.addFact('eligibilityField', eligibilityField);
      await engine.run();
      expect(!successSpy.mock.calls.length);
    });
  });
});
