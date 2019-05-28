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
    engine.addFact('age', function() {
      throw new Error('problem occurred');
    });
  });

  test('surfaces errors', async () => {
    await expect(engine.run()).rejects.toThrow(/problem occurred/);
  });
});
