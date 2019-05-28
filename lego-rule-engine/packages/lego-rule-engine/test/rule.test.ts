import { Engine } from '../src/engine';
import { Rule } from '../src/rule';

import { conditionFactory } from './support/condition-factory';
import { Condition } from '../src/condition';

describe('Rule', () => {
  let rule = new (Rule as any)();
  let conditionBase = conditionFactory({
    fact: 'age',
    value: 50
  });

  describe('constructor()', () => {
    test('can be initialized with priority, conditions, and event', () => {
      let condition = {
        all: [Object.assign({}, conditionBase)]
      } as Condition;
      condition.operator = 'all';
      condition.priority = 25;
      let opts = {
        priority: 50,
        conditions: condition,
        event: {
          type: 'awesome'
        }
      };
      let rule = new Rule(opts);
      expect(rule.priority).toEqual(opts.priority);
      expect(rule.conditions).toEqual(opts.conditions);
      expect(rule.event).toEqual(opts.event);
    });

    test('it can be initialized with a json string', () => {
      let condition = {
        all: [Object.assign({}, conditionBase)]
      } as Condition;
      condition.operator = 'all';
      condition.priority = 25;
      let opts = {
        priority: 50,
        conditions: condition,
        event: {
          type: 'awesome'
        }
      };
      let json = JSON.stringify(opts);
      let rule = new Rule(json);
      expect(rule.priority).toEqual(opts.priority);
      expect(rule.conditions).toEqual(opts.conditions);
      expect(rule.event).toEqual(opts.event);
    });
  });

  describe('event emissions', () => {
    test('can emit', () => {
      let rule = new (Rule as any)();
      let successSpy = jest.fn();
      rule.on('test', successSpy);
      rule.emit('test');
      expect(successSpy.mock.calls.length).toBe(1);
    });

    test('can be initialized with an onSuccess option', done => {
      let event = { type: 'test' };
      let onSuccess = function(e: any) {
        expect(e).toBe(event);
        done();
      };
      let rule = new Rule({ onSuccess } as any);
      rule.emit('success', event);
    });

    test('can be initialized with an onFailure option', done => {
      let event = { type: 'test' };
      let onFailure = function(e: any) {
        expect(e).toBe(event);
        done();
      };
      let rule = new Rule({ onFailure } as any);
      rule.emit('failure', event);
    });
  });

  describe('setEvent()', () => {
    test('throws if no argument provided', () => {
      expect(() => rule.setEvent()).toThrowError(/Rule: setEvent\(\) requires event object/);
    });

    test('throws if argument is missing "type" property', () => {
      expect(() => rule.setEvent({})).toThrowError(
        /Rule: setEvent\(\) requires event object with "type" property/
      );
    });
  });

  describe('setConditions()', () => {
    describe('validations', () => {
      test('throws an exception for invalid root conditions', () => {
        expect(rule.setConditions.bind(rule, { foo: true })).toThrowError(
          /"conditions" root must contain a single instance of "all" or "any"/
        );
      });
    });
  });

  describe('setPriority', () => {
    test('defaults to a priority of 1', () => {
      expect(rule.priority).toBe(1);
    });

    test('allows a priority to be set', () => {
      rule.setPriority(10);
      expect(rule.priority).toBe(10);
    });

    test('errors if priority is less than 0', () => {
      expect(rule.setPriority.bind(null, 0)).toThrowError(/greater than zero/);
    });
  });

  describe('priotizeConditions()', () => {
    let conditions = [
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
      },
      {
        fact: 'state',
        operator: 'equal',
        value: 'admin'
      }
    ];

    test('orders based on priority', async () => {
      let engine = new Engine();
      engine.addFact(
        'state',
        async () => {
          /**/
        },
        { priority: 500 }
      );
      engine.addFact(
        'segment',
        async () => {
          /**/
        },
        { priority: 50 }
      );
      engine.addFact(
        'accountType',
        async () => {
          /**/
        },
        { priority: 25 }
      );
      engine.addFact(
        'age',
        async () => {
          /**/
        },
        { priority: 100 }
      );
      let rule = new (Rule as any)();
      rule.setEngine(engine);

      let prioritizedConditions = rule.prioritizeConditions(conditions);
      expect(prioritizedConditions.length).toBe(4);
      expect(prioritizedConditions[0][0].fact).toBe('state');
      expect(prioritizedConditions[1][0].fact).toBe('age');
      expect(prioritizedConditions[2][0].fact).toBe('segment');
      expect(prioritizedConditions[3][0].fact).toBe('accountType');
    });
  });

  describe('evaluate()', () => {
    test('evalutes truthy when there are no conditions', async () => {
      let eventSpy = jest.fn();
      let engine = new Engine();
      let rule = new (Rule as any)();
      rule.setConditions({
        all: []
      });
      engine.addRule(rule);
      engine.on('success', eventSpy);
      await engine.run();
      expect(eventSpy.mock.calls.length === 1);
    });
  });

  describe('toJSON() and fromJSON()', () => {
    let priority = 50;
    let event = {
      type: 'to-json!',
      params: { id: 1 }
    };
    let conditions = {
      priority: 1,
      all: [
        {
          value: 10,
          operator: 'equals',
          fact: 'user',
          params: {
            foo: true
          },
          path: '.id'
        }
      ]
    };
    let rule: Rule;
    beforeEach(() => {
      rule = new (Rule as any)();
      rule.setConditions(conditions);
      rule.setPriority(priority);
      rule.setEvent(event);
    });

    test('serializes itself', () => {
      let json = rule.toJSON(false) as any;
      expect(Object.keys(json).length).toBe(3);
      expect(json.conditions).toEqual(conditions);
      expect(json.priority).toEqual(priority);
      expect(json.event).toEqual(event);
    });

    test('serializes itself as json', () => {
      let jsonString = rule.toJSON() as string;
      expect(typeof jsonString).toBe('string');
      let json = JSON.parse(jsonString);
      expect(Object.keys(json).length).toBe(3);
      expect(json.conditions).toEqual(conditions);
      expect(json.priority).toEqual(priority);
      expect(json.event).toEqual(event);
    });

    test('rehydrates itself using a JSON string', () => {
      let jsonString = rule.toJSON() as string;
      expect(typeof jsonString).toBe('string');
      let hydratedRule = new Rule(jsonString);
      expect(hydratedRule.conditions).toEqual(rule.conditions);
      expect(hydratedRule.priority).toEqual(rule.priority);
      expect(hydratedRule.event).toEqual(rule.event);
    });

    test('rehydrates itself using an object from JSON.parse()', () => {
      let jsonString = rule.toJSON() as string;
      expect(typeof jsonString).toBe('string');
      let json = JSON.parse(jsonString);
      let hydratedRule = new Rule(json);
      expect(hydratedRule.conditions).toEqual(rule.conditions);
      expect(hydratedRule.priority).toEqual(rule.priority);
      expect(hydratedRule.event).toEqual(rule.event);
    });
  });
});
