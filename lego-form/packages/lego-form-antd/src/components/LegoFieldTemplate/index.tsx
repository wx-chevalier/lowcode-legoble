import { Row, Col, Tooltip } from 'antd';
import cn from 'classnames';
import * as React from 'react';
import { FieldTemplateProps } from 'react-jsonschema-form';
import { LegoFormContext } from 'lego-form-core';

import './index.less';

const prefix = 'lego-field';
const idPrefix = 'root';

export const LegoFieldTemplate: React.FunctionComponent<FieldTemplateProps> = (
  props: FieldTemplateProps
) => {
  const {
    id,
    classNames,
    label,
    required,
    hidden,
    description,
    children,
    rawHelp,
    formContext,
    schema,
    uiSchema
  } = props;

  const code = id.slice(idPrefix.length + 1);
  const {
    labelType = 'inline',
    alignType = 'vertical',
    labelAlign = 'left',
    formItemLayout: { labelCol: { span: labelCol }, wrapperCol: { span: wrapperCol } } = {
      labelCol: { span: 6 },
      wrapperCol: { span: 6 }
    },
    itemNumberInRow = 2
  } = formContext as LegoFormContext;
  const isCheckbox = schema.type === 'boolean' && typeof uiSchema['ui:widget'] === 'undefined';

  const itemClassNames = cn({
    [`${prefix}-item`]: true,
    [`${prefix}-item--hidden`]: hidden
  });

  const itemLabelClassNames = cn({
    [`${prefix}-item-label`]: true,
    [`${prefix}-item-label--required`]: required
  });

  let inner;
  const isValidLabel = typeof label === 'string' && label !== '' && label !== code;

  // 当 Schema 类型为 object，说明直接渲染子元素
  if (schema.type === 'object') {
    inner = <div className={`${prefix}-root`}>{children}</div>;
  } else if (!isValidLabel) {
    inner = (
      <div className={itemClassNames}>
        {description}
        {children}
        <div
          className={`${prefix}-help`}
          dangerouslySetInnerHTML={{
            __html: rawHelp
          }}
        />
      </div>
    );
  } else if (labelType === 'inline') {
    // 判断是否存在有效的 label
    inner = (
      <div
        className={itemClassNames}
        style={
          alignType === 'vertical'
            ? {}
            : {
                display: 'inline-block',
                width: Math.floor(100 / itemNumberInRow) + '%'
              }
        }
      >
        <Row type="flex" align="top">
          <Col
            span={labelCol}
            style={{
              textAlign: labelAlign,
              visibility: isCheckbox ? 'hidden' : 'visible',
              maxHeight: isCheckbox ? '20px' : 'auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: '40px'
            }}
          >
            <Tooltip title={label}>
              <label htmlFor={id} className={itemLabelClassNames}>
                {label}
              </label>
            </Tooltip>
          </Col>
          <Col span={wrapperCol}>
            {description}
            {children}
            <div
              className={`${prefix}-help`}
              dangerouslySetInnerHTML={{
                __html: rawHelp
              }}
            />
          </Col>
        </Row>
      </div>
    );
  } else {
    inner = (
      <div className={itemClassNames}>
        <Tooltip title={label}>
          <label htmlFor={id} className={itemLabelClassNames}>
            {label}
          </label>
        </Tooltip>
        {description}
        {children}{' '}
        <div
          className={`${prefix}-help`}
          dangerouslySetInnerHTML={{
            __html: rawHelp
          }}
        />
      </div>
    );
  }

  return (
    <section
      className={cn(
        prefix,
        classNames,
        labelType === 'inline' ? `${prefix}-inline` : `${prefix}-vertical`
      )}
    >
      {inner}
    </section>
  );
};
