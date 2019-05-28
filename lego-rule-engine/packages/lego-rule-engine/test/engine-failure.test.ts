import { engineFactory } from '../src';

import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';

describe('Engine: failure', () => {
  let engine: Engine;

  let event = { type: 'generic' };
  let conditions = {
    any: [
      {
        fact: 'age',
        operator: 'greaterThanInclusive',
        value: 21
      }
    ]
  };
  beforeEach(() => {
    engine = engineFactory();
    let determineDrinkingAgeRule = ruleFactory({ conditions, event });
    engine.addRule(determineDrinkingAgeRule);
    engine.addFact('age', 10);
  });

  test('emits an event on a rule failing', async () => {
    let failureSpy = jest.fn();
    engine.on('failure', failureSpy);
    await engine.run();
    expect(failureSpy.mock.calls[0][0]).toEqual(engine.rules[0].event);
  });

  test('does not emit when a rule passes', async () => {
    let failureSpy = jest.fn();
    engine.on('failure', failureSpy);
    engine.addFact('age', 50);
    await engine.run();
    expect(failureSpy).not.toHaveBeenCalledTimes(1);
  });
});
