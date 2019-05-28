import { engineFactory } from '../src';
import { ruleFactory } from './support/rule-factory';
import { BaseCondition } from '../src/condition';

async function dictionary(params: any) {
  let words = ['coffee', 'Aardvark', 'moose', 'ladder', 'antelope'];
  return words[params.wordIndex];
}

describe('Engine: operator', () => {
  let event = {
    type: 'operatorTrigger'
  };
  let baseConditions: BaseCondition = {
    any: [
      {
        fact: 'dictionary',
        operator: 'startsWithLetter',
        value: 'a',
        params: {
          wordIndex: null
        }
      }
    ]
  } as any;
  let eventSpy = jest.fn();

  function setup(conditions = baseConditions) {
    eventSpy = jest.fn();
    let engine = engineFactory();
    let rule = ruleFactory({ conditions, event });
    engine.addRule(rule);
    engine.addOperator('startsWithLetter', (factValue, jsonValue) => {
      if (!factValue.length) return false;
      return factValue[0].toLowerCase() === jsonValue.toLowerCase();
    });
    engine.addFact('dictionary', dictionary);
    engine.on('success', eventSpy);
    return engine;
  }

  describe('evaluation', () => {
    test('emits when the condition is met', async () => {
      let conditions = Object.assign({}, baseConditions);
      (conditions.any![0].params as any).wordIndex = 1;
      let engine = setup();
      await engine.run();
      expect(eventSpy.mock.calls[0][0]).toEqual(event);
    });

    test('does not emit when the condition fails', async () => {
      let conditions = Object.assign({}, baseConditions);
      (conditions.any![0].params as any).wordIndex = 0;
      let engine = setup();
      await engine.run();
      expect(!eventSpy.mock.calls.length || eventSpy.mock.calls[0][0]).not.toEqual(event);
    });

    test('throws when it encounters an unregistered operator', async () => {
      let conditions = Object.assign({}, baseConditions);
      conditions.any![0].operator = 'unknown-operator';
      let engine = setup();
      await expect(engine.run()).rejects.toThrow('Unknown operator: unknown-operator');
    });
  });
});
