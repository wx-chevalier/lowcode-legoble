import { JSONSchema6 } from 'json-schema';
import { UiSchema } from 'react-jsonschema-form';

/** 自定义的 JsonSchema */
export interface LegoJsonSchema extends JSONSchema6 {}

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

export interface VCSchema {
  formCode?: string;
  jsonSchema: LegoJsonSchema;
  uiSchame: UiSchema;
}
