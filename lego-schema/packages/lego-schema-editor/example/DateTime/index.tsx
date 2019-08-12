import * as React from 'react';
import { LegoJsonSchema } from 'lego-form-core';

import { LegoAntdForm } from '../../src/components/LegoAntdForm';

const jsonSchema: LegoJsonSchema = {
  title: 'DateTime form',
  type: 'object',
  required: ['date'],
  properties: {
    date: {
      type: 'string',
      title: 'Date Field',
      format: 'date'
    },
    month: {
      type: 'string',
      title: 'Month Field',
      format: 'month'
    }
  }
};

const uiSchema = {
  date: {
    'ui:widget': 'date',
    'ui:options': {
      placeholder: 'Please select date',
      format: 'YYYY-MM-DD'
    }
  },
  month: {
    'ui:widget': 'date',
    'ui:options': {
      placeholder: 'Please select month',
      format: 'YYYY-MM'
    }
  }
};

export default function DateTime() {
  return <LegoAntdForm jsonSchema={jsonSchema} uiSchema={uiSchema} />;
}
