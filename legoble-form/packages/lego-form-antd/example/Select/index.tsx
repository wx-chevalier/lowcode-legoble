import * as React from 'react';
import { LegoJsonSchema } from 'lego-form-core';

import { LegoAntdForm } from '../../src/components/LegoAntdForm';

const jsonSchema: LegoJsonSchema = {
  title: 'Select form',
  type: 'object',
  required: ['role'],
  properties: {
    enum: {
      type: 'string',
      title: 'String Enum',
      enum: ['Admin', 'Develop']
    },
    enumOptions: {
      type: 'string',
      title: 'Enum options with custom label and value',
      enum: [
        {
          label: 'A',
          value: 0
        },
        {
          label: 'B',
          value: 1
        }
      ]
    },
    multipleSelect: {
      type: 'string',
      title: 'Multiple select with custom options',
      enum: [
        {
          label: 'A',
          value: 0
        },
        {
          label: 'B',
          value: 1
        }
      ]
    }
  }
};

const uiSchema = {
  multipleSelect: {
    'ui:widget': 'multipleSelect'
  }
};

export default function Select() {
  return (
    <LegoAntdForm
      jsonSchema={jsonSchema}
      uiSchema={uiSchema}
      formData={{ multipleSelect: [0] }}
      onChange={v => {
        console.log(v);
      }}
    />
  );
}
