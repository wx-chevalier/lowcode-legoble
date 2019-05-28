import { Engine, engineFactory, Fact, Rule } from '../src';
import { ruleFactory } from './support/rule-factory';

describe('Engine: custom properties', () => {
  let engine: Engine;
  let event = { type: 'generic' };

  describe('all conditions', () => {
    test('preserves custom properties set on fact', () => {
      engine = engineFactory();
      let fact = new Fact('age', 12);
      (fact as any).customId = 'uuid';
      engine.addFact(fact);
      expect(engine.facts.get('age')).toHaveProperty('customId');
      expect((engine.facts.get('age') as any).customId).toBe((fact as any).customId);
    });

    describe('conditions', () => {
      test('preserves custom properties set on boolean conditions', () => {
        engine = engineFactory();
        let conditions = {
          customId: 'uuid1',
          all: [
            {
              fact: 'age',
              operator: 'greaterThanInclusive',
              value: 18
            }
          ]
        };
        let rule = ruleFactory({ conditions, event });
        engine.addRule(rule);
        expect(engine.rules[0].conditions).toHaveProperty('customId');
      });

      test('preserves custom properties set on regular conditions', () => {
        engine = engineFactory();
        let conditions = {
          all: [
            {
              customId: 'uuid',
              fact: 'age',
              operator: 'greaterThanInclusive',
              value: 18
            }
          ]
        };
        let rule = ruleFactory({ conditions, event });
        engine.addRule(rule);
        expect(engine.rules[0].conditions!['all']![0]).toHaveProperty('customId');
        expect((engine.rules[0].conditions!['all']![0] as any).customId).toBe('uuid');
      });
    });

    test('preserves custom properties set on regular conditions', () => {
      engine = engineFactory();
      let rule = new (Rule as any)();
      let ruleProperties = ruleFactory();
      rule
        .setPriority(ruleProperties.priority)
        .setConditions(ruleProperties.conditions)
        .setEvent(ruleProperties.event);
      rule.customId = 'uuid';
      engine.addRule(rule);
      expect(engine.rules[0]).toHaveProperty('customId');
      expect((engine.rules[0] as any).customId).toBe('uuid');
    });
  });
});
