import { LegoUiSchema, LegoJsonSchema } from 'lego-form-antd';
import { JSONSchema6TypeName } from 'json-schema';

export type MaterialsType = 'Input' | 'SingleSelect' | 'Date';

export function mapTypeToInitialConfig(
  type: MaterialsType
): {
  initJsonSchema: LegoJsonSchema;
  initUiSchema?: LegoUiSchema;
} {
  switch (type) {
    case 'Input':
      return {
        initJsonSchema: {
          type: 'string' as JSONSchema6TypeName,
          title: 'default title',
          default: 'default value '
        },
        initUiSchema: {
          'ui:widget': 'text'
        }
      };
    case 'SingleSelect':
      return {
        initJsonSchema: {
          type: 'string' as JSONSchema6TypeName,
          title: 'default title',
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
      };
    case 'Date':
      return {
        initJsonSchema: {
          type: 'string' as JSONSchema6TypeName,
          title: 'default title',
          format: 'date'
        }
      };

    default:
      return {
        initJsonSchema: {
          type: 'string' as JSONSchema6TypeName
        }
      };
  }
}
