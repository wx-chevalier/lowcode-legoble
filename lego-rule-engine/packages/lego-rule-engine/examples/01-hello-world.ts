/*
 * This is the hello-world example from the README.
 *
 * Usage:
 *   ts-node ./examples/01-hello-world.ts
 *
 * For detailed output:
 *   DEBUG=json-rules-engine node ./examples/01-hello-world.ts
 */

import { Rule } from '../src/rule';
import { Engine } from '../src/engine';

require('colors');

/**
 * Setup a new engine
 */
let engine = new Engine();

/**
 * Create a rule
 */
let rule = new Rule({
  // define the 'conditions' for when "hello world" should display
  conditions: {
    all: [
      {
        fact: 'displayMessage',
        operator: 'equal',
        value: true
      }
    ]
  },
  // define the 'event' that will fire when the condition evaluates truthy
  event: {
    type: 'message',
    params: {
      data: 'hello-world!'
    }
  }
});

// add rule to engine
engine.addRule(rule);

/**
 * Define a 'displayMessage' as a constant value
 * Fact values do NOT need to be known at engine runtime; see the
 * 03-dynamic-facts.js example for how to pull in data asynchronously during runtime
 */
let facts = { displayMessage: false };

// run the engine
engine
  .run(facts)
  .then(triggeredEvents => {
    // engine returns a list of events with truthy conditions
    triggeredEvents.map(event => console.log(event.params.data.green));
  })
  .catch(console.log);

/*
 * OUTPUT:
 *
 * hello-world!
 */
