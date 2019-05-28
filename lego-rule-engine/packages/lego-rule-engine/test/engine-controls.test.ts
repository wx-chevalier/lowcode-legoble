import { engineFactory } from '../src';
import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { ConditionConstructorOptions } from '../src/condition';

describe('Engine: fact priority', () => {
  let engine: Engine;
  let event = { type: 'adult-human-admins' };

  let eventSpy = jest.fn();
  let ageStub = jest.fn();
  let segmentStub = jest.fn();

  function setup() {
    eventSpy = jest.fn();
    ageStub = jest.fn();
    segmentStub = jest.fn();
    engine = engineFactory();

    let conditions: ConditionConstructorOptions = {
      any: [
        {
          fact: 'age',
          operator: 'greaterThanInclusive',
          value: 18
        }
      ]
    };
    let rule = ruleFactory({ conditions, event, priority: 100 });
    engine.addRule(rule);

    conditions = {
      any: [
        {
          fact: 'segment',
          operator: 'equal',
          value: 'human'
        }
      ]
    };
    rule = ruleFactory({ conditions, event });
    engine.addRule(rule);

    engine.addFact('age', ageStub, { priority: 100 });
    engine.addFact('segment', segmentStub, { priority: 50 });
  }

  describe('stop()', () => {
    test('stops the rules from executing', async () => {
      setup();
      ageStub.mockReturnValue(20); // success
      engine.on('success', event => {
        eventSpy();
        engine.stop();
      });
      await engine.run();
      expect(eventSpy.mock.calls.length).toBe(1);
      expect(ageStub.mock.calls.length).toBe(1);
      expect(segmentStub.mock.calls.length).toBe(0);
    });
  });
});
