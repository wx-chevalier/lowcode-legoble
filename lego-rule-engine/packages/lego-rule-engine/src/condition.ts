import * as debug0 from 'debug';

const debug = debug0('json-rules-engine');
const isObjectLike = require('lodash.isobjectlike');
import { Almanac } from './almanac';
import { Operator } from './operator';
import { ToJsonAble } from './to-json-able.interface';

export interface ICouldHavePriority {
  priority?: number | string;
}

// TODO-Tom: convert to interface wherein the properties all and
// any are both optional. This convention doesn't work as desired currently.
export interface ConditionConstructorOptions extends ICouldHavePriority {
  all?: (ConditionConstructorOptions | BaseCondition)[];
  any?: (ConditionConstructorOptions | BaseCondition)[];
}

export interface BaseCondition extends ICouldHavePriority {
  value: any;
  fact: string;
  operator: string;
  factResult?: any;
  result?: boolean;
  params?: object;
  path?: string;
  any?: BaseCondition[];
  all?: BaseCondition[];
}

export class Condition implements ICouldHavePriority, ToJsonAble {
  priority?: number | string;
  value: any;
  fact: any;
  factResult?: any;
  result?: boolean;
  params?: object;
  path?: string;
  operator?: 'all' | 'any';
  all?: BaseCondition[];
  any?: BaseCondition[];

  constructor(properties: ConditionConstructorOptions) {
    if (!properties) {
      throw new Error('Condition: constructor options required');
    }

    let booleanOperator: 'all' | 'any' | undefined = Condition.booleanOperator(properties);

    Object.assign(this, properties);

    if (Condition.booleanOperatorIsAllOrAny(booleanOperator)) {
      let subConditions = properties[booleanOperator];

      if (!(subConditions instanceof Array)) {
        throw new Error(`"${booleanOperator}" must be an array`);
      }

      this.operator = booleanOperator;

      // boolean conditions always have a priority; default 1
      this.priority = parseInt(properties.priority as string, 10) || 1;
      (this as any)[booleanOperator] = subConditions.map(c => {
        return new Condition(c);
      });
    } else {
      if (!properties.hasOwnProperty('fact'))
        throw new Error('Condition: constructor "fact" property required');
      if (!properties.hasOwnProperty('operator'))
        throw new Error('Condition: constructor "operator" property required');
      if (!properties.hasOwnProperty('value'))
        throw new Error('Condition: constructor "value" property required');

      // a non-boolean condition does not have a priority by default. this allows
      // priority to be dictated by the fact definition
      if (properties.hasOwnProperty('priority')) {
        properties.priority = parseInt(properties.priority as string, 10);
      }
    }
  }

  /**
   * Returns the boolean operator for the condition
   * If the condition is not a boolean condition, the result will be 'undefined'
   * @return {'all' | 'any'}
   */
  static booleanOperator(condition: ConditionConstructorOptions): 'all' | 'any' | undefined {
    if (condition.hasOwnProperty('any')) {
      return 'any';
    } else if (condition.hasOwnProperty('all')) {
      return 'all';
    }

    return undefined;
  }

  static booleanOperatorIsAllOrAny(
    booleanOperator: 'all' | 'any' | undefined
  ): booleanOperator is 'all' | 'any' {
    return booleanOperator === 'all' || booleanOperator === 'any';
  }

  /**
   * Converts the condition into a json-friendly structure
   * @param   {Boolean} stringify - whether to return as a json string
   * @returns {string,object} json string or json-friendly object
   */
  toJSON(stringify = true): string | BaseCondition {
    let props: BaseCondition = {} as BaseCondition;

    if (this.priority) {
      props.priority = this.priority;
    }

    let oper = Condition.booleanOperator(this as any);

    if (oper) {
      props[oper] = (this as any)[oper].map((c: Condition) => c.toJSON(stringify));
    } else {
      props.operator = this.operator as string;
      props.value = this.value;
      props.fact = this.fact;

      if (this.factResult !== undefined) {
        props.factResult = this.factResult;
      }

      if (this.result !== undefined) {
        props.result = this.result;
      }

      if (this.params) {
        props.params = this.params;
      }

      if (this.path) {
        props.path = this.path;
      }
    }
    if (stringify) {
      return JSON.stringify(props);
    }
    return props;
  }

  /**
   * Takes the fact result and compares it to the condition 'value', using the operator
   *   LHS                      OPER       RHS
   * <fact + params + path>  <operator>  <value>
   *
   * @param   {Almanac} almanac
   * @param   {Map} operatorMap - map of available operators, keyed by operator name
   * @returns {Boolean} - evaluation result
   */
  evaluate(
    almanac: Almanac,
    operatorMap: Map<string, Operator>
  ): Promise<{
    result: boolean;
    leftHandSideValue: any;
    rightHandSideValue: any;
    operator: 'all' | 'any';
  }> {
    if (!almanac) return Promise.reject(new Error('almanac required'));
    if (!operatorMap) return Promise.reject(new Error('operatorMap required'));
    if (this.isBooleanOperator())
      return Promise.reject(new Error('Cannot evaluate() a boolean condition'));

    let op = this.operator ? operatorMap.get(this.operator) : null;
    if (!op) {
      return Promise.reject(new Error(`Unknown operator: ${this.operator}`));
    }

    return Promise.all([
      this.getValue(almanac),
      almanac.factValue(this.fact, this.params, this.path)
    ]).then(([rightHandSideValue, leftHandSideValue]) => {
      const result: boolean = op!.evaluate(leftHandSideValue, rightHandSideValue);

      debug(
        `condition::evaluate <${leftHandSideValue} ${
          this.operator
        } ${rightHandSideValue}?> (${result})`
      );

      return { result, leftHandSideValue, rightHandSideValue, operator: this.operator! };
    });
  }

  /**
   * Returns the condition's boolean operator
   * Instance version of Condition.isBooleanOperator
   * @returns {string,undefined} - 'any', 'all', or undefined (if not a boolean condition)
   */
  booleanOperator() {
    return Condition.booleanOperator(this as any);
  }

  /**
   * Whether the operator is boolean ('all', 'any')
   * @returns {Boolean}
   */
  isBooleanOperator() {
    return Condition.booleanOperator(this as any) !== undefined;
  }

  /**
   * Interprets .value as either a primitive, or if a fact, retrieves the fact value
   */
  private getValue(almanac: Almanac) {
    let value = this.value;
    if (isObjectLike(value) && value.hasOwnProperty('fact')) {
      // value: { fact: 'xyz' }
      return almanac.factValue(value.fact, value.params, value.path);
    }
    return Promise.resolve(value);
  }
}
