import { Switch, Divider, Radio, Input, Icon, Drawer } from 'antd';
import * as Ajv from 'ajv';
import cn from 'classnames';
import produce from 'immer';
import {
  LegoAntdForm,
  LegoAntdFormProps,
  LegoJsonSchema,
  LegoUiSchema,
  LegoFormSchema
} from 'lego-form-antd';
import * as React from 'react';

import 'antd/dist/antd.less';
import 'jsoneditor-react/es/editor.min.css';

import './index.less';
import { MaterialsType, mapTypeToInitialConfig } from '../../materials';
import { randomString } from '../../utils/ds';
import JsonEditor from '../JsonEditor';
import { FormSchemaProvider, useFormSchema } from '../../stores/form-schema/context';

const { Button: RadioButton, Group: RadioGroup } = Radio;
const ajv = new Ajv({ allErrors: true, verbose: true });

const prefix = 'lego-form-builder';

export interface LegoFormBuilderProps extends Partial<LegoAntdFormProps> {
  formSchema: string | LegoFormSchema;
  onFormSchemaChange?: (formSchema: LegoFormSchema) => void;
}

export function LegoFormBuilderComp({
  className,
  formSchema: parentFormSchema,
  onFormSchemaChange = () => {},
  ...otherProps
}: LegoFormBuilderProps) {
  const [state, dispatch] = useFormSchema();
  const { editorMode } = state;

  let formSchema: LegoFormSchema | string = parentFormSchema;

  if (typeof formSchema === 'string') {
    formSchema = JSON.parse(formSchema);
  }

  const { jsonSchema: parentJsonSchema, uiSchema: parentUiSchema } = formSchema as LegoFormSchema;

  const [platform, setPlatform] = React.useState('pc');
  const [isPreview, togglePreview] = React.useState(false);
  const [isDrawerVisible, setDrawerVisible] = React.useState(false);
  const [jsonSchema, setJsonSchema] = React.useState(parentJsonSchema);
  const [uiSchema, setUiSchema] = React.useState(parentUiSchema);
  const editorRef = React.useRef<HTMLDivElement>();

  const handleJsonSchemaChange = (v: LegoJsonSchema) => {
    setJsonSchema(v);
    onFormSchemaChange({
      jsonSchema: v,
      uiSchema
    });
  };

  const handleUiSchemaChange = (v: LegoUiSchema) => {
    setUiSchema(v);
    onFormSchemaChange({
      jsonSchema,
      uiSchema: v
    });
  };

  const handleMaterialAdd = (type: MaterialsType) => {
    const fieldName = randomString(8);
    const res = mapTypeToInitialConfig(type);

    if (!res) {
      return;
    }

    const { initJsonSchema, initUiSchema } = res;

    const nextJsonSchema = produce(jsonSchema, draftJsonSchema => {
      if (!draftJsonSchema.properties) {
        draftJsonSchema.properties = {};
      }

      draftJsonSchema.properties[fieldName] = initJsonSchema;
    });

    const nextUiSchema = produce(uiSchema, draftUiSchema => {
      draftUiSchema[fieldName] = initUiSchema;
    });

    setJsonSchema(nextJsonSchema);
    setUiSchema(nextUiSchema);
  };

  return (
    <section
      className={cn({
        [className || '']: className,
        [`${prefix}-container`]: true
      })}
    >
      <div className={`${prefix}-materials-wrapper`}>
        <div className={`${prefix}-toolbar ${prefix}-materials-toolbar`}>
          <Input disabled={true} value="Anonymous Form" style={{ marginRight: 8 }} />
          <Icon type="edit" style={{ marginRight: 8 }} />
          <RadioGroup
            value={platform}
            onChange={e => {
              setPlatform(e.target.value);
            }}
          >
            <RadioButton value="pc">
              <Icon type="laptop" />
            </RadioButton>
            <RadioButton value="mobile">
              <Icon type="mobile" />
            </RadioButton>
          </RadioGroup>
        </div>
        <div className={`${prefix}-materials`}>
          <div className="title">Materials</div>
          <Divider style={{ margin: 0 }} />
          <div className={`${prefix}-materials-gallery`}>
            <div
              className={`${prefix}-materials-item`}
              onClick={() => {
                handleMaterialAdd('Input');
              }}
            >
              Input
            </div>
            <div
              className={`${prefix}-materials-item`}
              onClick={() => {
                handleMaterialAdd('SingleSelect');
              }}
            >
              Single Select
            </div>
            <div
              className={`${prefix}-materials-item`}
              onClick={() => {
                handleMaterialAdd('Date');
              }}
            >
              Date Picker
            </div>
          </div>
        </div>
      </div>

      <div className={`${prefix}-workbench-wrapper`}>
        <div className={`${prefix}-toolbar`}>
          <div className="left" />
          <div className="middle">
            {!isPreview && (
              <RadioGroup
                value={editorMode}
                onChange={e => {
                  dispatch({
                    type: 'changeEditorMode',
                    value: e.target.value
                  });
                }}
              >
                <RadioButton value="jsonEditor">JSON Editor</RadioButton>
                <RadioButton disabled={true} value="visualEditor">
                  Visual Editor
                </RadioButton>
              </RadioGroup>
            )}
          </div>
          <div className="right">
            <Switch
              checked={isPreview}
              checkedChildren="Edit"
              unCheckedChildren="Preview"
              onChange={(c: boolean) => {
                togglePreview(c);
              }}
            />
          </div>
        </div>
        {!isPreview && (
          <div className={`${prefix}-editor`}>
            <div
              className={`${prefix}-editor-json`}
              ref={$ref => {
                editorRef.current = $ref!;
              }}
            >
              <div className={`${prefix}-editor-jsonschema`}>
                <JsonEditor
                  ajv={ajv}
                  allowedModes={['tree', 'code', 'form', 'view']}
                  mode="code"
                  value={jsonSchema}
                  onChange={handleJsonSchemaChange}
                />
              </div>
              <div className={`${prefix}-editor-uischema`}>
                <JsonEditor
                  ajv={ajv}
                  allowedModes={['tree', 'code', 'form', 'view']}
                  mode="code"
                  value={uiSchema}
                  onChange={handleUiSchemaChange}
                />
              </div>
            </div>
            <Drawer visible={isDrawerVisible} />
          </div>
        )}
        {isPreview && (
          <div className={`${prefix}-preview`}>
            <LegoAntdForm jsonSchema={jsonSchema} uiSchema={uiSchema} {...otherProps} />
          </div>
        )}
      </div>
    </section>
  );
}

export const LegoFormBuilder = (props: LegoFormBuilderProps) => (
  <FormSchemaProvider>
    <LegoFormBuilderComp {...props} />
  </FormSchemaProvider>
);
