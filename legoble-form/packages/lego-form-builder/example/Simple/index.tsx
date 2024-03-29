import * as React from 'react';
import { LegoJsonSchema } from 'lego-form-antd';

import { LegoFormBuilder } from '../../src/components/LegoFormBuilder';

const jsonSchema: LegoJsonSchema = {
  title: 'Form title',
  description: 'Form desc',
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
    bio: {
      type: 'string',
      title: 'Bio'
    },
    role: {
      type: 'string',
      title: 'Role',
      enum: ['Admin', 'Develop']
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
    }
  }
};

const uiSchema = {
  firstName: {
    'ui:widget': 'text',
    'ui:autofocus': true,
    'ui:emptyValue': ''
  },
  age: {
    'ui:widget': 'updown',
    'ui:title': 'Age of person',
    'ui:description': '(earthian year)'
  },
  bio: {
    'ui:widget': 'textarea'
  },
  password: {
    'ui:widget': 'password',
    'ui:help': 'Hint: Make it strong!'
  },
  date: {
    'ui:widget': 'alt-datetime'
  },
  telephone: {
    'ui:options': {
      inputType: 'tel'
    }
  }
};

export default function Simple() {
  return (
    <LegoFormBuilder
      formSchema={{ jsonSchema, uiSchema }}
      onFormSchemaChange={schema => {
        console.log(schema);
      }}
    />
  );
}
