import { Engine, EngineOptions } from './engine';
import { Fact } from './fact';
import { Rule } from './rule';
import { Operator } from './operator';
import { Almanac } from './almanac';

export { Fact, Rule, Operator, Engine, Almanac };
export function engineFactory(rules?: Rule[], options?: EngineOptions) {
  return new Engine(rules, options);
}
