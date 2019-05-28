import { engineFactory } from '../src';
import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { FactOptions } from '../src/fact';

describe('Engine', () => {
  let engine: Engine;
  let event = { type: 'early-twenties' };
  let conditions = {
    all: [
      {
        fact: 'age',
        operator: 'lessThanInclusive',
        value: 25
      },
      {
        fact: 'age',
        operator: 'greaterThanInclusive',
        value: 20
      },
      {
        fact: 'age',
        operator: 'notIn',
        value: [21, 22]
      }
    ]
  };

  let eventSpy = jest.fn();
  let factSpy = jest.fn();

  function setup(factOptions?: FactOptions) {
    factSpy = jest.fn();
    eventSpy = jest.fn();

    let factDefinition = () => {
      factSpy();
      return 24;
    };

    engine = engineFactory();
    let rule = ruleFactory({ conditions, event });
    engine.addRule(rule);
    engine.addFact('age', factDefinition, factOptions);
    engine.on('success', eventSpy);
  }

  describe('1 rule with parallel conditions', () => {
    test('calls the fact definition once for each condition if caching is off', async () => {
      setup({ cache: false });
      await engine.run();
      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(factSpy).toHaveBeenCalledTimes(3);
    });

    test('calls the fact definition once', async () => {
      setup();
      await engine.run();
      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(factSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('2 rules with parallel conditions', () => {
    test('calls the fact definition once', async () => {
      setup();
      let conditions = {
        all: [
          {
            fact: 'age',
            operator: 'notIn',
            value: [21, 22]
          }
        ]
      };
      let rule = ruleFactory({ conditions, event });
      engine.addRule(rule);

      await engine.run();
      expect(eventSpy).toHaveBeenCalledTimes(2);
      expect(factSpy).toHaveBeenCalledTimes(1);
    });
  });
});
