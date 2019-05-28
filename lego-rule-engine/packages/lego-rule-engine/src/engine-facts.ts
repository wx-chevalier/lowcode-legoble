import { Action } from './action.interface';

let SuccessEventFact = function() {
  let successTriggers: Action[] = [];
  return (params: { event?: Action } = {}) => {
    if (params.event) {
      successTriggers.push(params.event);
    }
    return successTriggers;
  };
};

export { SuccessEventFact };
