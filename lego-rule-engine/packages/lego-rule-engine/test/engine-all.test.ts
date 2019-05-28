import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { engineFactory } from '../src';

async function factSenior() {
  return 65;
}

async function factChild() {
  return 10;
}

async function factAdult() {
  return 30;
}

describe('Engine: "all" conditions', () => {
  let engine: Engine;

  describe('supports a single "all" condition', () => {
    let event = {
      type: 'ageTrigger',
      params: {
        demographic: 'under50'
      }
    };
    let conditions = {
      all: [
        {
          fact: 'age',
          operator: 'lessThan',
          value: 50
        }
      ]
    };
    let eventSpy = jest.fn();
    beforeEach(() => {
      eventSpy = jest.fn();
      let rule = ruleFactory({ conditions, event });
      engine = engineFactory();
      engine.addRule(rule);
      engine.on('success', eventSpy);
    });

    test('emits when the condition is met', async () => {
      engine.addFact('age', factChild);
      await engine.run();
      expect(eventSpy.mock.calls[0][0]).toEqual(event);
    });

    test('does not emit when the condition fails', () => {
      engine.addFact('age', factSenior);
      engine.run();
      expect(!eventSpy.mock.calls.length || eventSpy.mock.calls[0][0]).not.toEqual(event);
    });
  });

  describe('supports "any" with multiple conditions', () => {
    let conditions = {
      all: [
        {
          fact: 'age',
          operator: 'lessThan',
          value: 50
        },
        {
          fact: 'age',
          operator: 'greaterThan',
          value: 21
        }
      ]
    };
    let event = {
      type: 'ageTrigger',
      params: {
        demographic: 'adult'
      }
    };
    let eventSpy = jest.fn();
    beforeEach(() => {
      eventSpy = jest.fn();
      let rule = ruleFactory({ conditions, event });
      engine = engineFactory();
      engine.addRule(rule);
      engine.on('success', eventSpy);
    });

    test('emits an event when every condition is met', async () => {
      engine.addFact('age', factAdult);
      await engine.run();
      expect(eventSpy.mock.calls[0][0]).toEqual(event);
    });

    describe('a condition fails', () => {
      test('does not emit when the first condition fails', async () => {
        engine.addFact('age', factChild);
        await engine.run();
        expect(!eventSpy.mock.calls.length || eventSpy.mock.calls[0][0]).not.toEqual(event);
      });

      test('does not emit when the second condition', async () => {
        engine.addFact('age', factSenior);
        await engine.run();
        expect(!eventSpy.mock.calls.length || eventSpy.mock.calls[0][0]).not.toEqual(event);
      });
    });
  });
});
