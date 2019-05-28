import { Action } from '../../src/action.interface';
import { Rule } from '../../src/rule';

export const ruleFactory = (options?: {
  conditions: any;
  event: Action;
  priority?: number | string;
}) => {
  const optionsScoped = options || {};
  return {
    priority: (optionsScoped as any).priority || 1,
    conditions: (optionsScoped as any).conditions || {
      all: [
        {
          fact: 'age',
          operator: 'lessThan',
          value: 45
        },
        {
          fact: 'pointBalance',
          operator: 'greaterThanInclusive',
          value: 1000
        }
      ]
    },
    event: (optionsScoped as any).event || {
      type: 'pointCapReached',
      params: {
        currency: 'points',
        pointCap: 1000
      }
    }
  } as Rule;
};
