import { engineFactory, Fact } from '../src';

import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { Almanac } from '../src/almanac';

describe('Engine: custom cache keys', () => {
  let engine: Engine;
  let event = { type: 'early-twenties' };
  let conditions = {
    all: [
      {
        fact: 'demographics',
        params: {
          field: 'age'
        },
        operator: 'lessThanInclusive',
        value: 25
      },
      {
        fact: 'demographics',
        params: {
          field: 'zipCode'
        },
        operator: 'equal',
        value: 80211
      }
    ]
  };

  let eventSpy = jest.fn();
  let demographicDataSpy = jest.fn();
  let demographicSpy = jest.fn();
  beforeEach(() => {
    demographicSpy = jest.fn();
    demographicDataSpy = jest.fn();
    eventSpy = jest.fn();

    let demographicsDataDefinition = async () => {
      demographicDataSpy();
      return {
        age: 20,
        zipCode: 80211
      };
    };

    let demographicsDefinition = async (params: any, almanac: Almanac) => {
      demographicSpy();
      let data = await almanac.factValue('demographic-data');
      return data[params.field];
    };
    let demographicsFact = new Fact('demographics', demographicsDefinition);
    let demographicsDataFact = new Fact('demographic-data', demographicsDataDefinition);

    engine = engineFactory();
    let rule = ruleFactory({ conditions, event });
    engine.addRule(rule);
    engine.addFact(demographicsFact);
    engine.addFact(demographicsDataFact);
    engine.on('success', eventSpy);
  });

  describe('1 rule', () => {
    test('allows a fact to retrieve other fact values', async () => {
      await engine.run();
      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(demographicDataSpy).toHaveBeenCalledTimes(1);
      expect(demographicSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('2 rules with parallel conditions', () => {
    test('calls the fact definition once', async () => {
      let conditions = {
        all: [
          {
            fact: 'demographics',
            params: {
              field: 'age'
            },
            operator: 'greaterThanInclusive',
            value: 20
          }
        ]
      };
      let rule = ruleFactory({ conditions, event });
      engine.addRule(rule);

      await engine.run();
      expect(eventSpy).toHaveBeenCalledTimes(2);
      expect(demographicDataSpy).toHaveBeenCalledTimes(1);
      expect(demographicSpy).toHaveBeenCalledTimes(2);
      expect(demographicDataSpy).toHaveBeenCalledTimes(1);
    });
  });
});
