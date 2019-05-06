import { Switch, Divider, Radio, Input, Icon, Drawer } from 'antd';
import * as Ajv from 'ajv';
import cn from 'classnames';
import produce from 'immer';
import { LegoAntdForm, LegoAntdFormProps, LegoJsonSchema, LegoUiSchema } from 'lego-form-antd';
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

export interface LegoFormBuilderProps extends LegoAntdFormProps {}

export function LegoFormBuilderComp({
  className,
  jsonSchema: parentJsonSchema,
  uiSchema: parentUiSchema,
  ...otherProps
}: LegoFormBuilderProps) {
  const [state, dispatch] = useFormSchema();
  const { editorMode } = state;

  const [platform, setPlatform] = React.useState('pc');
  const [isPreview, togglePreview] = React.useState(false);
  const [isDrawerVisible, setDrawerVisible] = React.useState(false);
  const [jsonSchema, setJsonSchema] = React.useState(parentJsonSchema);
  const [uiSchema, setUiSchema] = React.useState(parentUiSchema);
  const editorRef = React.useRef<HTMLDivElement>();

  const handleJsonSchemaChange = (v: LegoJsonSchema) => {
    setJsonSchema(v);
  };

  const handleUiSchemaChange = (v: LegoUiSchema) => {
    setUiSchema(v);
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
          <Input disabled={true} value="匿名表单" style={{ marginRight: 8 }} />
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
          <div className="title">物料</div>
          <Divider style={{ margin: 0 }} />
          <div className={`${prefix}-materials-gallery`}>
            <div
              className={`${prefix}-materials-item`}
              onClick={() => {
                handleMaterialAdd('Input');
              }}
            >
              单行文本框
            </div>
            <div
              className={`${prefix}-materials-item`}
              onClick={() => {
                handleMaterialAdd('SingleSelect');
              }}
            >
              单选
            </div>
            <div className={`${prefix}-materials-item`}>日期选择器</div>
            <div className={`${prefix}-materials-item`}>时间选择器</div>
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
                <RadioButton value="jsonEditor">JSON 编辑</RadioButton>
                <RadioButton disabled={true} value="visualEditor">
                  可视化编辑
                </RadioButton>
              </RadioGroup>
            )}
          </div>
          <div className="right">
            <Switch
              checked={isPreview}
              checkedChildren="编辑"
              unCheckedChildren="预览"
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
