import { Row, Col, Tooltip, Button, Icon } from 'antd';
import cn from 'classnames';
import * as React from 'react';
import { ArrayFieldTemplateProps } from 'react-jsonschema-form';

import { LegoWidgetOptions } from '../../widgets/LegoWidget/index';
import { filterValidateMessage } from '../../types/filter';

import './index.less';

const prefix = 'lego-array-field';

export const LegoArrayFieldTemplate: React.FunctionComponent<ArrayFieldTemplateProps> = (
  props: ArrayFieldTemplateProps
) => {
  const { className, canAdd, uiSchema, items = [] } = props;

  const options = uiSchema['ui:options'] as LegoWidgetOptions;
  const { _errorType = '', validate } = options;
  // 提取出错误信息
  const errorMessage = filterValidateMessage(_errorType, validate);

  return (
    <section
      className={cn({
        [prefix]: true,
        [className]: true,
        [`${prefix}--has-error`]: _errorType !== ''
      })}
    >
      {items.map(item => {
        return (
          <div className={cn({ [`${prefix}-item`]: true })} key={item.index}>
            <div>{item.children}</div>
            <div className={`${prefix}-item-buttons`}>
              {item.hasMoveDown && (
                <Button
                  size="small"
                  type="default"
                  onClick={item.onReorderClick(item.index, item.index + 1)}
                >
                  <Icon type="arrow-down" />
                </Button>
              )}
              {item.hasMoveUp && (
                <Button
                  size="small"
                  type="default"
                  onClick={item.onReorderClick(item.index, item.index - 1)}
                >
                  <Icon type="arrow-up" />
                </Button>
              )}
              {props.items.length > 1 && (
                <Button size="small" type="default" onClick={item.onDropIndexClick(item.index)}>
                  <Icon type="close" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
      {canAdd && (
        <div className={`${prefix}-bottom`}>
          <Button size="small" type="primary" onClick={props.onAddClick}>
            <Icon type="plus" />
          </Button>
        </div>
      )}
      <div className="ant-form-explain">{errorMessage}</div>
    </section>
  );
};
