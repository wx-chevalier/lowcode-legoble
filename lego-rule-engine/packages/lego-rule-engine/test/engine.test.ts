import { ruleFactory } from './support/rule-factory';
import { Engine } from '../src/engine';
import { Rule } from '../src/rule';
import { Fact } from '../src/fact';
import { Operator } from '../src/operator';
import { engineFactory } from '../src';

describe('Engine', () => {
  let engine: Engine;
  beforeEach(() => {
    engine = engineFactory();
  });

  test('has methods for managing facts and rules, and running itself', () => {
    expect(engine).toHaveProperty('addRule');
    expect(engine).toHaveProperty('removeRule');
    expect(engine).toHaveProperty('addOperator');
    expect(engine).toHaveProperty('removeOperator');
    expect(engine).toHaveProperty('addFact');
    expect(engine).toHaveProperty('removeFact');
    expect(engine).toHaveProperty('run');
    expect(engine).toHaveProperty('stop');
  });

  describe('constructor', () => {
    test('initializes with the default state', () => {
      expect(engine.status).toBe('READY');
      expect(engine.rules.length).toBe(0);
      expect(engine.operators.size).toBe(10);
    });

    test('can be initialized with rules', () => {
      let rules = [ruleFactory(), ruleFactory(), ruleFactory()];
      engine = engineFactory(rules);
      expect(engine.rules.length).toBe(rules.length);
    });
  });

  describe('stop()', () => {
    test('changes the status to "FINISHED"', () => {
      expect(engine.stop().status).toBe('FINISHED');
    });
  });

  describe('addRule()', () => {
    describe('rule instance', () => {
      test('adds the rule', () => {
        let rule = new Rule(ruleFactory() as any);
        expect(engine.rules.length).toBe(0);
        engine.addRule(rule);
        expect(engine.rules.length).toBe(1);
        expect(engine.rules).toContain(rule);
      });
    });

    describe('required fields', () => {
      test('.conditions', () => {
        let rule = ruleFactory();
        delete rule.conditions;
        expect(() => {
          engine.addRule(rule);
        }).toThrowError(/Engine: addRule\(\) argument requires "conditions" property/);
      });

      test('.event', () => {
        let rule = ruleFactory();
        delete rule.event;
        expect(() => {
          engine.addRule(rule);
        }).toThrowError(/Engine: addRule\(\) argument requires "event" property/);
      });
    });
  });

  describe('removeRule()', () => {
    describe('rule instance', () => {
      test('removes the rule', () => {
        let rule = new Rule(ruleFactory() as any);
        engine.addRule(rule);
        expect(engine.rules.length).toBe(1);
        engine.removeRule(rule);
        expect(engine.rules.length).toBe(0);
      });
    });

    describe('required fields', () => {
      test('.conditions', () => {
        expect(() => {
          engine.removeRule([] as any);
        }).toThrowError(/Engine: removeRule\(\) rule must be a instance of Rule/);
      });
    });

    test('can only remove added rules', () => {
      expect(engine.rules.length).toBe(0);
      let rule = new Rule(ruleFactory() as any);
      const isRemoved = engine.removeRule(rule);
      expect(isRemoved).toBe(false);
    });
  });

  describe('addOperator()', () => {
    test('adds the operator', () => {
      expect(engine.operators.size).toBe(10);
      engine.addOperator('startsWithLetter', (factValue, jsonValue) => {
        return factValue[0] === jsonValue;
      });
      expect(engine.operators.size).toBe(11);
      expect(engine.operators.get('startsWithLetter')).toBeDefined();
      expect(engine.operators.get('startsWithLetter')).toBeInstanceOf(Operator);
    });

    test('accepts an operator instance', () => {
      expect(engine.operators.size).toBe(10);
      let op = new Operator('my-operator', _ => true);
      engine.addOperator(op);
      expect(engine.operators.size).toBe(11);
      expect(engine.operators.get('my-operator')).toBe(op);
    });
  });

  describe('removeOperator()', () => {
    test('removes the operator', () => {
      expect(engine.operators.size).toBe(10);
      engine.addOperator('startsWithLetter', (factValue, jsonValue) => {
        return factValue[0] === jsonValue;
      });
      expect(engine.operators.size).toBe(11);
      engine.removeOperator('startsWithLetter');
      expect(engine.operators.size).toBe(10);
    });

    test('can only remove added operators', () => {
      expect(engine.operators.size).toBe(10);
      const isRemoved = engine.removeOperator('nonExisting');
      expect(isRemoved).toBe(false);
    });
  });

  describe('addFact()', () => {
    const FACT_NAME = 'FACT_NAME';
    const FACT_VALUE = 'FACT_VALUE';

    function assertFact(engine: Engine) {
      expect(engine.facts.size).toBe(1);
      expect(engine.facts.has(FACT_NAME)).toBe(true);
    }

    test('allows a constant fact', () => {
      engine.addFact(FACT_NAME, FACT_VALUE);
      assertFact(engine);
      expect(engine.facts.get(FACT_NAME)!.value).toBe(FACT_VALUE);
    });

    test('allows options to be passed', () => {
      let options = { cache: false };
      engine.addFact(FACT_NAME, FACT_VALUE, options);
      assertFact(engine);
      expect(engine.facts.get(FACT_NAME)!.value).toBe(FACT_VALUE);
      expect(engine.facts.get(FACT_NAME)!.options).toEqual(options);
    });

    test('allows a lamba fact with no options', () => {
      engine.addFact(FACT_NAME, async (params: any, engine: any) => {
        return FACT_VALUE;
      });
      assertFact(engine);
      expect(engine.facts.get(FACT_NAME)!.value).toBeUndefined();
    });

    test('allows a lamba fact with options', () => {
      let options = { cache: false };
      engine.addFact(
        FACT_NAME,
        async (params: any, engine: any) => {
          return FACT_VALUE;
        },
        options
      );
      assertFact(engine);
      expect(engine.facts.get(FACT_NAME)!.options).toEqual(options);
      expect(engine.facts.get(FACT_NAME)!.value).toBeUndefined();
    });

    test('allows a fact instance', () => {
      let options = { cache: false };
      let fact = new Fact(FACT_NAME, 50, options);
      engine.addFact(fact);
      assertFact(engine);
      expect(engine.facts.get(FACT_NAME)).toBeDefined();
      expect(engine.facts.get(FACT_NAME)!.options).toEqual(options);
    });
  });

  describe('removeFact()', () => {
    test('removes a Fact', () => {
      expect(engine.facts.size).toBe(0);
      let fact = new Fact('newFact', 50, { cache: false });
      engine.addFact(fact);
      expect(engine.facts.size).toBe(1);
      engine.removeFact('newFact');
      expect(engine.facts.size).toBe(0);
    });

    test('can only remove added facts', () => {
      expect(engine.facts.size).toBe(0);
      const isRemoved = engine.removeFact('newFact');
      expect(isRemoved).toBe(false);
    });
  });

  describe('run()', () => {
    beforeEach(() => {
      let conditions = {
        all: [
          {
            fact: 'age',
            operator: 'greaterThanInclusive',
            value: 18
          }
        ]
      };
      let event = { type: 'generic' };
      let rule = ruleFactory({ conditions, event });
      engine.addRule(rule);
      engine.addFact('age', 20);
    });

    test('changes the status to "RUNNING"', () => {
      let eventSpy = jest.fn();
      engine.on('success', (event, almanac) => {
        eventSpy();
        expect(engine.status).toBe('RUNNING');
      });
      return engine.run();
    });

    test('changes status to FINISHED once complete', async () => {
      expect(engine.status).toBe('READY');
      await engine.run();
      expect(engine.status).toBe('FINISHED');
    });
  });
});
