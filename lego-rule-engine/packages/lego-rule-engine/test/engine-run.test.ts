import { engineFactory } from '../src';

import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { Rule } from '../src/rule';

describe('Engine: run', () => {
  let engine: Engine;
  let rule: Rule;
  let rule2: Rule;

  let event = { type: 'generic' };
  let condition21 = {
    any: [
      {
        fact: 'age',
        operator: 'greaterThanInclusive',
        value: 21
      }
    ]
  };
  let condition75 = {
    any: [
      {
        fact: 'age',
        operator: 'greaterThanInclusive',
        value: 75
      }
    ]
  };
  let eventSpy = jest.fn();

  beforeEach(() => {
    eventSpy = jest.fn();
    engine = engineFactory();
    rule = ruleFactory({ conditions: condition21, event });
    engine.addRule(rule);
    rule2 = ruleFactory({ conditions: condition75, event });
    engine.addRule(rule2);
    engine.on('success', eventSpy);
  });

  describe('independent runs', () => {
    test('treats each run() independently', async () => {
      await Promise.all([50, 10, 12, 30, 14, 15, 25].map(age => engine.run({ age })));
      expect(eventSpy).toHaveBeenCalledTimes(3);
    });

    test('allows runtime facts to override engine facts for a single run()', async () => {
      engine.addFact('age', 30);

      await engine.run({ age: 85 }); // override 'age' with runtime fact
      expect(eventSpy.mock.calls.length === 2);

      eventSpy = jest.fn();
      await engine.run(); // no runtime fact; revert to age: 30
      expect(eventSpy.mock.calls.length === 1);

      eventSpy = jest.fn();
      await engine.run({ age: 2 }); // override 'age' with runtime fact
      expect(eventSpy.mock.calls.length).toBe(0);
    });
  });

  describe('returns', () => {
    test('activated events', () => {
      return engine.run({ age: 30 }).then((results: any) => {
        expect(results.length).toBe(1);
        expect(results).toContainEqual(rule.event);
      });
    });

    test('multiple activated events', () => {
      return engine.run({ age: 90 }).then((results: any) => {
        expect(results.length).toBe(2);
        expect(results).toContainEqual(rule.event);
        expect(results).toContainEqual(rule2.event);
      });
    });

    test('does not include unactived triggers', () => {
      return engine.run({ age: 10 }).then((results: any) => {
        expect(results.length).toBe(0);
      });
    });
  });
});
