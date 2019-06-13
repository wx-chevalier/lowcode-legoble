import { Almanac } from '../src/almanac';

import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { engineFactory } from '../src';

describe('Engine: event', () => {
  let engine: Engine;

  let event = {
    type: 'setDrinkingFlag',
    params: {
      canOrderDrinks: true
    }
  };
  /**
   * sets up a simple 'any' rule with 2 conditions
   */
  function simpleSetup() {
    let conditions = {
      any: [
        {
          fact: 'age',
          operator: 'greaterThanInclusive',
          value: 21
        },
        {
          fact: 'qualified',
          operator: 'equal',
          value: true
        }
      ]
    };
    engine = engineFactory();
    let ruleOptions = { conditions, event, priority: 100 };
    let determineDrinkingAgeRule = ruleFactory(ruleOptions);
    engine.addRule(determineDrinkingAgeRule);
    // age will succeed because 21 >= 21
    engine.addFact('age', 21);
    // set 'qualified' to fail. rule will succeed because of 'any'
    engine.addFact('qualified', false);
  }

  /**
   * sets up a complex rule with nested conditions
   */
  function advancedSetup() {
    let conditions = {
      any: [
        {
          fact: 'age',
          operator: 'greaterThanInclusive',
          value: 21
        },
        {
          fact: 'qualified',
          operator: 'equal',
          value: true
        },
        {
          all: [
            {
              fact: 'zipCode',
              operator: 'in',
              value: [80211, 80403]
            },
            {
              fact: 'gender',
              operator: 'notEqual',
              value: 'female'
            }
          ]
        }
      ]
    };
    engine = engineFactory();
    let ruleOptions = { conditions, event, priority: 100 };
    let determineDrinkingAgeRule = ruleFactory(ruleOptions);
    engine.addRule(determineDrinkingAgeRule);
    // rule will succeed because of 'any'
    engine.addFact('age', 10); // age fails
    engine.addFact('qualified', false); // qualified fails.
    engine.addFact('zipCode', 80403); // zipCode succeeds
    engine.addFact('gender', 'male'); // gender succeeds
  }

  describe('engine events: simple', () => {
    beforeEach(() => simpleSetup());

    test('"success" passes the event, almanac, and results', async () => {
      let failureSpy = jest.fn();
      let successSpy = jest.fn();
      engine.on('success', function(e, almanac, ruleResult) {
        expect(e).toEqual(event);
        expect(almanac).toBeInstanceOf(Almanac);
        expect(ruleResult.result).toBe(true);
        expect(ruleResult.conditions.any[0].result).toBe(true);
        expect(ruleResult.conditions.any[0].factResult).toBe(21);
        expect(ruleResult.conditions.any[1].result).toBe(false);
        expect(ruleResult.conditions.any[1].factResult).toBe(false);
        successSpy();
      });
      engine.on('failure', failureSpy);
      await engine.run();
      expect(failureSpy.mock.calls.length).toBe(0);
      expect(successSpy.mock.calls.length).toBe(1);
    });

    test('"event.type" passes the event parameters, almanac, and results', async () => {
      let failureSpy = jest.fn();
      let successSpy = jest.fn();
      engine.on(event.type, function(params: any, almanac: any, ruleResult) {
        expect(params).toEqual(event.params);
        expect(almanac).toBeInstanceOf(Almanac);
        expect(ruleResult.result).toBe(true);
        expect(ruleResult.conditions.any[0].result).toBe(true);
        expect(ruleResult.conditions.any[0].factResult).toBe(21);
        expect(ruleResult.conditions.any[1].result).toBe(false);
        expect(ruleResult.conditions.any[1].factResult).toBe(false);
        successSpy();
      });
      engine.on('failure', failureSpy);
      await engine.run();
      expect(failureSpy.mock.calls.length).toBe(0);
      expect(successSpy.mock.calls.length).toBe(1);
    });

    test('"failure" passes the event, almanac, and results', async () => {
      let AGE = 10;
      let failureSpy = jest.fn();
      let successSpy = jest.fn();
      engine.on('failure', function(e, almanac, ruleResult) {
        expect(e).toEqual(event);
        expect(almanac).toBeInstanceOf(Almanac);
        expect(ruleResult.result).toBe(false);
        expect(ruleResult.conditions.any[0].result).toBe(false);
        expect(ruleResult.conditions.any[0].factResult).toBe(AGE);
        expect(ruleResult.conditions.any[1].result).toBe(false);
        expect(ruleResult.conditions.any[1].factResult).toBe(false);
        failureSpy();
      });
      engine.on('success', successSpy);
      engine.addFact('age', AGE); // age fails
      await engine.run();
      expect(failureSpy.mock.calls.length).toBe(1);
      expect(successSpy.mock.calls.length).toBe(0);
    });

    test('allows facts to be added by the event handler, affecting subsequent rules', () => {
      let drinkOrderParams = { wine: 'merlot', quantity: 2 };
      let drinkOrderEvent = {
        type: 'offerDrink',
        params: drinkOrderParams
      };
      let drinkOrderConditions = {
        any: [
          {
            fact: 'canOrderDrinks',
            operator: 'equal',
            value: true
          }
        ]
      };
      let drinkOrderRule = ruleFactory({
        conditions: drinkOrderConditions,
        event: drinkOrderEvent,
        priority: 1
      });
      engine.addRule(drinkOrderRule);
      return new Promise((resolve, reject) => {
        engine.on('success', function(event, almanac, ruleResult) {
          switch (event.type) {
            case 'setDrinkingFlag':
              almanac.addRuntimeFact('canOrderDrinks', event.params.canOrderDrinks);
              break;
            case 'offerDrink':
              expect(event.params).toEqual(drinkOrderParams);
              break;
            default:
              reject(new Error('default case not expected'));
          }
        });
        engine
          .run()
          .then(resolve)
          .catch(reject);
      });
    });
  });

  describe('engine events: advanced', () => {
    beforeEach(() => advancedSetup());

    test('"success" passes the event, almanac, and results', async () => {
      let failureSpy = jest.fn();
      let successSpy = jest.fn();
      engine.on('success', function(e, almanac, ruleResult) {
        expect(e).toEqual(event);
        expect(almanac).toBeInstanceOf(Almanac);
        expect(ruleResult.result).toBe(true);
        expect(ruleResult.conditions.any[0].result).toBe(false);
        expect(ruleResult.conditions.any[0].factResult).toBe(10);
        expect(ruleResult.conditions.any[1].result).toBe(false);
        expect(ruleResult.conditions.any[1].factResult).toBe(false);
        expect(ruleResult.conditions.any[2].result).toBe(true);
        expect(ruleResult.conditions.any[2].all[0].result).toBe(true);
        expect(ruleResult.conditions.any[2].all[0].factResult).toBe(80403);
        expect(ruleResult.conditions.any[2].all[1].result).toBe(true);
        expect(ruleResult.conditions.any[2].all[1].factResult).toBe('male');
        successSpy();
      });
      engine.on('failure', failureSpy);
      await engine.run();
      expect(failureSpy.mock.calls.length).toBe(0);
      expect(successSpy.mock.calls.length).toBe(1);
    });

    test('"failure" passes the event, almanac, and results', async () => {
      let ZIP_CODE = 99992;
      let GENDER = 'female';
      let failureSpy = jest.fn();
      let successSpy = jest.fn();
      engine.on('failure', function(e, almanac, ruleResult) {
        expect(e).toEqual(event);
        expect(almanac).toBeInstanceOf(Almanac);
        expect(ruleResult.result).toBe(false);
        expect(ruleResult.conditions.any[0].result).toBe(false);
        expect(ruleResult.conditions.any[0].factResult).toBe(10);
        expect(ruleResult.conditions.any[1].result).toBe(false);
        expect(ruleResult.conditions.any[1].factResult).toBe(false);
        expect(ruleResult.conditions.any[2].result).toBe(false);
        expect(ruleResult.conditions.any[2].all[0].result).toBe(false);
        expect(ruleResult.conditions.any[2].all[0].factResult).toBe(ZIP_CODE);
        expect(ruleResult.conditions.any[2].all[1].result).toBe(false);
        expect(ruleResult.conditions.any[2].all[1].factResult).toBe(GENDER);
        failureSpy();
      });
      engine.on('success', successSpy);
      engine.addFact('zipCode', ZIP_CODE); // zipCode fails
      engine.addFact('gender', GENDER); // gender fails
      await engine.run();
      expect(failureSpy.mock.calls.length).toBe(1);
      expect(successSpy.mock.calls.length).toBe(0);
    });
  });

  describe('rule events: simple', () => {
    beforeEach(() => simpleSetup());

    test('the rule result is a _copy_ of the rule`s conditions, and unaffected by mutation', async () => {
      let rule = engine.rules[0];
      let firstPass;
      rule.on('success', function(e, almanac, ruleResult) {
        firstPass = ruleResult;
        delete ruleResult.conditions.any; // subsequently modify the conditions in this rule result
      });
      await engine.run();

      // run the engine again, now that ruleResult.conditions was modified
      let secondPass;
      rule.on('success', function(e, almanac, ruleResult) {
        secondPass = ruleResult;
      });
      await engine.run();

      expect(firstPass).toEqual(secondPass); // second pass was unaffected by first pass
    });

    test('on-success, it passes the event type and params', async () => {
      let failureSpy = jest.fn();
      let successSpy = jest.fn();
      let rule = engine.rules[0];
      rule.on('success', function(e, almanac, ruleResult) {
        expect(e).toEqual(event);
        expect(almanac).toBeInstanceOf(Almanac);
        expect(failureSpy.mock.calls.length).toBe(0);
        expect(ruleResult.result).toBe(true);
        expect(ruleResult.conditions.any[0].result).toBe(true);
        expect(ruleResult.conditions.any[0].factResult).toBe(21);
        expect(ruleResult.conditions.any[1].result).toBe(false);
        expect(ruleResult.conditions.any[1].factResult).toBe(false);
        successSpy();
      });
      rule.on('failure', failureSpy);
      await engine.run();
      expect(successSpy.mock.calls.length).toBe(1);
      expect(failureSpy.mock.calls.length).toBe(0);
    });

    test('on-failure, it passes the event type and params', async () => {
      let AGE = 10;
      let successSpy = jest.fn();
      let failureSpy = jest.fn();
      let rule = engine.rules[0];
      rule.on('failure', function(e, almanac, ruleResult) {
        expect(e).toEqual(event);
        expect(almanac).toBeInstanceOf(Almanac);
        expect(successSpy.mock.calls.length).toBe(0);
        expect(ruleResult.result).toBe(false);
        expect(ruleResult.conditions.any[0].result).toBe(false);
        expect(ruleResult.conditions.any[0].factResult).toBe(AGE);
        expect(ruleResult.conditions.any[1].result).toBe(false);
        expect(ruleResult.conditions.any[1].factResult).toBe(false);
        failureSpy();
      });
      rule.on('success', successSpy);
      // both conditions will fail
      engine.addFact('age', AGE);
      await engine.run();
      expect(failureSpy.mock.calls.length).toBe(1);
      expect(successSpy.mock.calls.length).toBe(0);
    });
  });

  describe('rule events: json serializing', () => {
    beforeEach(() => simpleSetup());
    test('serializes properties', async () => {
      let successSpy = jest.fn();
      let rule = engine.rules[0];
      rule.on('success', successSpy);
      await engine.run();
      let ruleResult = successSpy.mock.calls[0][2];
      let expected =
        '{"conditions":{"priority":1,"any":[{"operator":"greaterThanInclusive","value":21,"fact":"age","factResult":21,"result":true},{"operator":"equal","value":true,"fact":"qualified","factResult":false,"result":false}]},"event":{"type":"setDrinkingFlag","params":{"canOrderDrinks":true}},"priority":100,"result":true}';
      expect(JSON.stringify(ruleResult)).toBe(expected);
    });
  });
});
