import * as deepClone from 'clone';
import { Condition } from './condition';
import { Action } from './action.interface';
import { ToJsonAble } from './to-json-able.interface';

export class RuleResult implements ToJsonAble {
  conditions: Condition;
  event?: Action;
  priority?: string | number | null;
  result: any;

  constructor(conditions: Condition, event?: Action, priority?: string | number | null) {
    this.conditions = deepClone(conditions);
    this.event = deepClone(event);
    this.priority = deepClone(priority);
    this.result = null;
  }

  setResult(result: any) {
    this.result = result;
  }

  toJSON(stringify = true): string | object {
    let props = {
      conditions: this.conditions.toJSON(false),
      event: this.event,
      priority: this.priority,
      result: this.result
    };
    if (stringify) {
      return JSON.stringify(props);
    }
    return props;
  }
}
