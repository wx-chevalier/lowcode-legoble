import { engineFactory } from '../src';

import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { ConditionConstructorOptions } from '../src/condition';

describe('Engine: fact to fact comparison', () => {
  let engine: Engine;
  let eventSpy = jest.fn();

  function setup(conditions: ConditionConstructorOptions) {
    let event = { type: 'success-event' };
    eventSpy = jest.fn();
    engine = engineFactory();
    let rule = ruleFactory({ conditions, event });
    engine.addRule(rule);
    engine.on('success', eventSpy);
  }

  describe('constant facts', () => {
    let constantCondition = {
      all: [
        {
          fact: 'height',
          operator: 'lessThanInclusive',
          value: {
            fact: 'width'
          }
        }
      ]
    };
    test('allows a fact to retrieve other fact values', async () => {
      setup(constantCondition);
      await engine.run({ height: 1, width: 2 });
      expect(eventSpy).toHaveBeenCalledTimes(1);

      eventSpy = jest.fn();

      await engine.run({ height: 2, width: 1 }); // negative case
      expect(eventSpy.mock.calls.length).toBe(0);
    });
  });

  describe('rules with parameterized conditions', () => {
    let paramsCondition = {
      all: [
        {
          fact: 'widthMultiplier',
          params: {
            multiplier: 2
          },
          operator: 'equal',
          value: {
            fact: 'heightMultiplier',
            params: {
              multiplier: 4
            }
          }
        }
      ]
    };
    test('honors the params', async () => {
      setup(paramsCondition);
      engine.addFact('heightMultiplier', async (params: any, almanac: any) => {
        let height = await almanac.factValue('height');
        return params.multiplier * height;
      });
      engine.addFact('widthMultiplier', async (params: any, almanac: any) => {
        let width = await almanac.factValue('width');
        return params.multiplier * width;
      });
      await engine.run({ height: 5, width: 10 });
      expect(eventSpy).toHaveBeenCalledTimes(1);

      eventSpy = jest.fn();

      await engine.run({ height: 5, width: 9 }); // negative case
      expect(eventSpy.mock.calls.length).toBe(0);
    });
  });

  describe('rules with parameterized conditions and path values', () => {
    let pathCondition = {
      all: [
        {
          fact: 'widthMultiplier',
          params: {
            multiplier: 2
          },
          path: '.feet',
          operator: 'equal',
          value: {
            fact: 'heightMultiplier',
            params: {
              multiplier: 4
            },
            path: '.meters'
          }
        }
      ]
    };
    test('honors the path', async () => {
      setup(pathCondition);
      engine.addFact('heightMultiplier', async (params: any, almanac: any) => {
        let height = await almanac.factValue('height');
        return { meters: params.multiplier * height };
      });
      engine.addFact('widthMultiplier', async (params: any, almanac: any) => {
        let width = await almanac.factValue('width');
        return { feet: params.multiplier * width };
      });
      await engine.run({ height: 5, width: 10 });
      expect(eventSpy).toHaveBeenCalledTimes(1);

      eventSpy = jest.fn();

      await engine.run({ height: 5, width: 9 }); // negative case
      expect(eventSpy.mock.calls.length).toBe(0);
    });
  });
});
