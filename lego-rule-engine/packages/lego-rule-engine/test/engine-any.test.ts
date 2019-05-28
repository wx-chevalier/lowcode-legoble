import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { engineFactory } from '../src';

describe('Engine: "any" conditions', () => {
  let engine: Engine;

  describe('supports a single "any" condition', () => {
    let event = {
      type: 'ageTrigger',
      params: {
        demographic: 'under50'
      }
    };
    let conditions = {
      any: [
        {
          fact: 'age',
          operator: 'lessThan',
          value: 50
        }
      ]
    };
    let eventSpy = jest.fn();
    let ageSpy = jest.fn();
    beforeEach(() => {
      eventSpy = jest.fn();
      let rule = ruleFactory({ conditions, event });
      engine = engineFactory();
      engine.addRule(rule);
      engine.addFact('age', ageSpy);
      engine.on('success', eventSpy);
    });

    test('emits when the condition is met', async () => {
      ageSpy.mockReturnValue(10);
      await engine.run();
      expect(eventSpy.mock.calls[0][0]).toEqual(event);
    });

    test('does not emit when the condition fails', () => {
      ageSpy.mockReturnValue(75);
      engine.run();
      expect(!eventSpy.mock.calls.length || eventSpy.mock.calls[0][0]).not.toEqual(event);
    });
  });

  describe('supports "any" with multiple conditions', () => {
    let conditions = {
      any: [
        {
          fact: 'age',
          operator: 'lessThan',
          value: 50
        },
        {
          fact: 'segment',
          operator: 'equal',
          value: 'european'
        }
      ]
    };
    let event = {
      type: 'ageTrigger',
      params: {
        demographic: 'under50'
      }
    };
    let eventSpy = jest.fn();
    let ageSpy = jest.fn();
    let segmentSpy = jest.fn();
    beforeEach(() => {
      eventSpy = jest.fn();
      ageSpy = jest.fn();
      segmentSpy = jest.fn();
      let rule = ruleFactory({ conditions, event });
      engine = engineFactory();
      engine.addRule(rule);
      engine.addFact('segment', segmentSpy);
      engine.addFact('age', ageSpy);
      engine.on('success', eventSpy);
    });

    test('emits an event when any condition is met', async () => {
      segmentSpy.mockReturnValue('north-american');
      ageSpy.mockReturnValue(25);
      await engine.run();
      expect(eventSpy.mock.calls[0][0]).toEqual(event);

      segmentSpy.mockReturnValue('european');
      ageSpy.mockReturnValue(100);
      await engine.run();
      expect(eventSpy.mock.calls[0][0]).toEqual(event);
    });

    test('does not emit when all conditions fail', async () => {
      segmentSpy.mockReturnValue('north-american');
      ageSpy.mockReturnValue(100);
      await engine.run();
      expect(!eventSpy.mock.calls.length || eventSpy.mock.calls[0][0]).not.toEqual(event);
    });
  });
});
