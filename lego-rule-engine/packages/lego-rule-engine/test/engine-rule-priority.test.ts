import { engineFactory } from '../src';
import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';

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

  let factSpy = jest.fn().mockReturnValue(22);
  let eventSpy = jest.fn();

  function setup() {
    factSpy = jest.fn();
    eventSpy = jest.fn();
    engine = engineFactory();
    let over20 = ruleFactory({ conditions, event: collegeSeniorEvent, priority: 50 });
    engine.addRule(over20);
    let determineDrinkingAge = ruleFactory({ conditions, event, priority: 100 });
    engine.addRule(determineDrinkingAge);
    let determineCollegeSenior = ruleFactory({
      conditions,
      event: collegeSeniorEvent,
      priority: 1
    });
    engine.addRule(determineCollegeSenior);
    engine.addFact('age', factSpy);
    engine.on('success', eventSpy);
  }

  test('runs the rules in order of priority', () => {
    setup();
    expect(engine.prioritizedRules).toBeNull();
    engine.prioritizeRules();
    expect(engine.prioritizedRules!.length).toBe(3);
    expect(engine.prioritizedRules![0][0].priority).toBe(100);
    expect(engine.prioritizedRules![1][0].priority).toBe(50);
    expect(engine.prioritizedRules![2][0].priority).toBe(1);
  });

  test('clears re-propriorizes the rules when a new Rule is added', () => {
    engine.prioritizeRules();
    expect(engine.prioritizedRules!.length).toBe(3);
    engine.addRule(ruleFactory());
    expect(engine.prioritizedRules).toBeNull();
  });
});
