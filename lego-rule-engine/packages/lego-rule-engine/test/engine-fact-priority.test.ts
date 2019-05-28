import { engineFactory } from '../src';

import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { ConditionConstructorOptions } from '../src/condition';

describe('Engine: fact priority', () => {
  let engine: Engine;
  let event = { type: 'adult-human-admins' };

  let eventSpy = jest.fn();
  let failureSpy = jest.fn();
  let ageStub = jest.fn();
  let segmentStub = jest.fn();
  let accountTypeStub = jest.fn();

  function setup(conditions: ConditionConstructorOptions) {
    ageStub = jest.fn();
    segmentStub = jest.fn();
    accountTypeStub = jest.fn();
    eventSpy = jest.fn();
    failureSpy = jest.fn();

    engine = engineFactory();
    let rule = ruleFactory({ conditions, event });
    engine.addRule(rule);
    engine.addFact('age', ageStub, { priority: 100 });
    engine.addFact('segment', segmentStub, { priority: 50 });
    engine.addFact('accountType', accountTypeStub, { priority: 25 });
    engine.on('success', eventSpy);
    engine.on('failure', failureSpy);
  }

  describe('all conditions', () => {
    let allCondition = {
      all: [
        {
          fact: 'age',
          operator: 'greaterThanInclusive',
          value: 18
        },
        {
          fact: 'segment',
          operator: 'equal',
          value: 'human'
        },
        {
          fact: 'accountType',
          operator: 'equal',
          value: 'admin'
        }
      ]
    };

    test('stops on the first fact to fail, part 1', async () => {
      setup(allCondition);
      ageStub.mockReturnValue(10); // fail
      await engine.run();
      expect(failureSpy).toHaveBeenCalled();
      expect(eventSpy).not.toHaveBeenCalled();
      expect(ageStub).toHaveBeenCalledTimes(1);
      expect(segmentStub).not.toHaveBeenCalled();
      expect(accountTypeStub).not.toHaveBeenCalled();
    });

    test('stops on the first fact to fail, part 2', async () => {
      setup(allCondition);
      ageStub.mockReturnValue(20); // pass
      segmentStub.mockReturnValue('android'); // fail
      await engine.run();
      expect(failureSpy).toHaveBeenCalled();
      expect(eventSpy).not.toHaveBeenCalled();
      expect(ageStub).toHaveBeenCalledTimes(1);
      expect(segmentStub).toHaveBeenCalledTimes(1);
      expect(accountTypeStub).not.toHaveBeenCalled();
    });

    describe('sub-conditions', () => {
      let allSubCondition = {
        all: [
          {
            fact: 'age',
            operator: 'greaterThanInclusive',
            value: 18
          },
          {
            all: [
              {
                fact: 'segment',
                operator: 'equal',
                value: 'human'
              },
              {
                fact: 'accountType',
                operator: 'equal',
                value: 'admin'
              }
            ]
          }
        ]
      };

      test('stops after the first sub-condition fact fails', async () => {
        setup(allSubCondition);
        ageStub.mockReturnValue(20); // pass
        segmentStub.mockReturnValue('android'); // fail
        await engine.run();
        expect(failureSpy).toHaveBeenCalled();
        expect(eventSpy).not.toHaveBeenCalled();
        expect(ageStub).toHaveBeenCalledTimes(1);
        expect(segmentStub).toHaveBeenCalledTimes(1);
        expect(accountTypeStub).not.toHaveBeenCalled();
      });
    });
  });

  describe('any conditions', () => {
    let anyCondition = {
      any: [
        {
          fact: 'age',
          operator: 'greaterThanInclusive',
          value: 18
        },
        {
          fact: 'segment',
          operator: 'equal',
          value: 'human'
        },
        {
          fact: 'accountType',
          operator: 'equal',
          value: 'admin'
        }
      ]
    };
    test('complete on the first fact to succeed, part 1', async () => {
      setup(anyCondition);
      ageStub.mockReturnValue(20); // succeed
      await engine.run();
      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(failureSpy).not.toHaveBeenCalled();
      expect(ageStub).toHaveBeenCalledTimes(1);
      expect(segmentStub).not.toHaveBeenCalled();
      expect(accountTypeStub).not.toHaveBeenCalled();
    });

    test('short circuits on the first fact to fail, part 2', async () => {
      setup(anyCondition);
      ageStub.mockReturnValue(10); // fail
      segmentStub.mockReturnValue('human'); // pass
      await engine.run();
      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(failureSpy).not.toHaveBeenCalled();
      expect(ageStub).toHaveBeenCalledTimes(1);
      expect(segmentStub).toHaveBeenCalledTimes(1);
      expect(accountTypeStub).not.toHaveBeenCalled();
    });

    describe('sub-conditions', () => {
      let anySubCondition = {
        all: [
          {
            fact: 'age',
            operator: 'greaterThanInclusive',
            value: 18
          },
          {
            any: [
              {
                fact: 'segment',
                operator: 'equal',
                value: 'human'
              },
              {
                fact: 'accountType',
                operator: 'equal',
                value: 'admin'
              }
            ]
          }
        ]
      };

      test('stops after the first sub-condition fact succeeds', async () => {
        setup(anySubCondition);
        ageStub.mockReturnValue(20); // success
        segmentStub.mockReturnValue('human'); // success
        await engine.run();
        expect(failureSpy).not.toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalled();
        expect(ageStub).toHaveBeenCalledTimes(1);
        expect(segmentStub).toHaveBeenCalledTimes(1);
        expect(accountTypeStub).not.toHaveBeenCalled();
      });
    });
  });
});
