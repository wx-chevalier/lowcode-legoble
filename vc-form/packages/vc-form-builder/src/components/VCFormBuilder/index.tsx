import * as Ajv from 'ajv';
import { Switch, Divider, Radio, Input, Icon, Drawer } from 'antd';

import cn from 'classnames';
import produce from 'immer';
import * as React from 'react';

import { VCAntdForm, VCAntdFormProps, VCJsonSchema, VCUiSchema } from 'vc-form-antd';

import 'antd/dist/antd.less';
import 'jsoneditor-react/es/editor.min.css';

import './index.less';
import { MaterialsType, mapTypeToInitialConfig } from '../../materials';
import { randomString } from '../../utils/ds';
import JsonEditor from '../JsonEditor';

const { Button: RadioButton, Group: RadioGroup } = Radio;
const ajv = new Ajv({ allErrors: true, verbose: true });

const prefix = 'vc-form-builder';

export interface VCFormBuilderProps extends VCAntdFormProps {}

export function VCFormBuilder({
  className,
  jsonSchema: parentJsonSchema,
  uiSchema: parentUiSchema,
  ...otherProps
}: VCFormBuilderProps) {
  const [editorMode, setEditorMode] = React.useState('jsonEditor');
  const [platform, setPlatform] = React.useState('pc');
  const [isPreview, togglePreview] = React.useState(false);
  const [isDrawerVisible, setDrawerVisible] = React.useState(false);
  const [jsonSchema, setJsonSchema] = React.useState(parentJsonSchema);
  const [uiSchema, setUiSchema] = React.useState(parentUiSchema);
  const editorRef = React.useRef<HTMLDivElement>();

  const handleJsonSchemaChange = (v: VCJsonSchema) => {
    setJsonSchema(v);
  };

  const handleUiSchemaChange = (v: VCUiSchema) => {
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
                setDrawerVisible(true);
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
                  setEditorMode(e.target.value);
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
            <VCAntdForm jsonSchema={jsonSchema} uiSchema={uiSchema} {...otherProps} />
          </div>
        )}
      </div>
    </section>
  );
}
