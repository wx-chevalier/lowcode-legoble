import { LegoUiSchema, LegoJsonSchema } from 'lego-form-antd';
import { JSONSchema6TypeName } from 'json-schema';

export type MaterialsType = 'Input' | 'SingleSelect';

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

    default:
      return {
        initJsonSchema: {
          type: 'string' as JSONSchema6TypeName
        }
      };
  }
}
