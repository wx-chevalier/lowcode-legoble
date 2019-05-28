import { engineFactory } from '../src';
import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { FactOptions } from '../src/fact';

describe('Engine: cache', () => {
  let engine: Engine;

  let event = { type: 'setDrinkingFlag' };
  let collegeSeniorEvent = { type: 'isCollegeSenior' };
  let conditions = {
    any: [
      {
        fact: 'age',
        operator: 'greaterThanInclusive',
        value: 21
      }
    ]
  };

  let factSpy = jest.fn();
  let eventSpy = jest.fn();
  let ageFact = () => {
    factSpy();
    return 22;
  };

  function setup(factOptions: FactOptions) {
    factSpy = jest.fn();
    eventSpy = jest.fn();
    engine = engineFactory();
    let determineDrinkingAge = ruleFactory({ conditions, event, priority: 100 });
    engine.addRule(determineDrinkingAge);
    let determineCollegeSenior = ruleFactory({
      conditions,
      event: collegeSeniorEvent,
      priority: 1
    });
    engine.addRule(determineCollegeSenior);
    let over20 = ruleFactory({ conditions, event: collegeSeniorEvent, priority: 50 });
    engine.addRule(over20);
    engine.addFact('age', ageFact, factOptions);
    engine.on('success', eventSpy);
  }

  test('loads facts once and caches the results for future use', async () => {
    setup({ cache: true });
    await engine.run();
    expect(eventSpy).toHaveBeenCalledTimes(3);
    expect(factSpy).toHaveBeenCalledTimes(1);
  });

  test('allows caching to be turned off', async () => {
    setup({ cache: false });
    await engine.run();
    expect(eventSpy).toHaveBeenCalledTimes(3);
    expect(factSpy).toHaveBeenCalledTimes(3);
  });
});
