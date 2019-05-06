import cn from 'classnames';
import * as React from 'react';
import { WidgetProps } from 'react-jsonschema-form';
import { LegoJsonSchema } from 'lego-form-core';

import './index.css';
import { filterValidateMessage } from '../../types/filter';

export interface ValidateResult {
  type: string;
  message: string;
}

// 在 ui:options 中自定义的数据
export interface LegoWidgetOptions {
  // field options
  placeholder: string;

  // view options
  autosize: { minRows: number; maxRows: number };
  autoFocus: boolean;
  readOnly: boolean;
  showAllOption: boolean;

  // Injected fields
  validate: [ValidateResult];
  _errorType: string;
}

const prefix = 'lego-form-widget';

export interface LegoWidgetProps extends WidgetProps {
  children?: JSX.Element;

  options: LegoWidgetOptions;
  schema: LegoJsonSchema;
}

export const LegoWidget = ({ options, children }: LegoWidgetProps) => {
  const { _errorType = '', validate } = options;

  // 提取出错误信息
  const errorMessage = filterValidateMessage(_errorType, validate);

  return (
    <section
      className={cn({
        [prefix]: true,
        [`${prefix}--has-error`]: _errorType !== ''
      })}
    >
      {children}
      <div className="ant-form-explain">{errorMessage}</div>
    </section>
  );
};
