import { JSONSchema6, JSONSchema6TypeName } from 'json-schema';
import { UiSchema } from 'react-jsonschema-form';

export type EnumOption =
  | string[]
  | number[]
  | {
      label: string;
      value: string | number | undefined;
    }[]
  | undefined;

export interface LegoMetaSchema {}

/** 自定义的 JsonSchema */
export interface LegoJsonSchema extends JSONSchema6 {
  /** Override origin schema definition */
  type?: JSONSchema6TypeName | JSONSchema6TypeName[];
  enum?: EnumOption;
  properties?: {
    [k: string]: LegoJsonSchema;
  };
}

export interface LegoUiSchema extends UiSchema {
  'ui:disabled'?: boolean;
  'ui:readonly'?: boolean;
  'ui:hidden'?: boolean;

  // 该组件关联的样式
  'ui:style'?: object;

  // 传入的样式类名
  classNames?: string[];
  items?: LegoUiSchema[];
}

export interface LegoFormSchema {
  formCode?: string;
  metaSchema?: LegoMetaSchema;
  jsonSchema: LegoJsonSchema;
  uiSchema: LegoUiSchema;
}
