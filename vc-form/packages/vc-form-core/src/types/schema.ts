import { JSONSchema6 } from 'json-schema';
import { UiSchema } from 'react-jsonschema-form';

/** 自定义的 JsonSchema */
export interface VCJsonSchema extends JSONSchema6 {
  formCode?: string;
}

export interface VCUiSchema extends UiSchema {
  'ui:disabled'?: boolean;
  'ui:readonly'?: boolean;
  items?: VCUiSchema[];
}
