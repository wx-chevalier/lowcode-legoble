import * as React from 'react';
import { LegoJsonSchema } from 'lego-form-core';

import { LegoAntdForm } from '../../src/components/LegoAntdForm';

const jsonSchema: LegoJsonSchema = {
  title: 'A registration form',
  description: 'A simple form example.',
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name',
      default: 'Chuck'
    },
    lastName: {
      type: 'string',
      title: 'Last name'
    },
    age: {
      type: 'integer',
      title: 'Age'
    },
    password: {
      type: 'string',
      title: 'Password',
      minLength: 3
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10
    },
    textarea: {
      type: 'string',
      title: 'Textarea'
    }
  }
};

const uiSchema = {
  firstName: {
    'ui:autofocus': true,
    'ui:emptyValue': ''
  },
  age: {
    'ui:widget': 'updown',
    'ui:title': 'Age of person',
    'ui:description': '(earthian year)'
  },
  password: {
    'ui:widget': 'password',
    'ui:help': 'Hint: Make it strong!'
  },
  telephone: {
    'ui:options': {
      inputType: 'tel'
    }
  },
  textarea: {
    'ui:widget': 'textarea'
  }
};

export default function Simple() {
  return <LegoAntdForm jsonSchema={jsonSchema} uiSchema={uiSchema} />;
}
