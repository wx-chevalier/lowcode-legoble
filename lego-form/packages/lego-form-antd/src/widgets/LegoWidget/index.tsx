import cn from 'classnames';
import * as React from 'react';
import { WidgetProps } from 'react-jsonschema-form';

import './index.less';
import { filterValidateMessage } from '../../types/filter';

export interface ValidateResult {
  type: string;
  message: string;
}

export interface LegoWidgetOptions {
  _errorType: string;
  validate: [ValidateResult];
}

export interface LegoWidgetProps extends WidgetProps {
  options: LegoWidgetOptions;
  children?: JSX.Element;
}

export const LegoWidget = ({ options, children }: LegoWidgetProps) => {
  const { _errorType, validate } = options;

  // 提取出错误信息
  const errorMessage = filterValidateMessage(_errorType, validate);

  return (
    <section
      className={cn({
        'lego-form-widget': true,
        'lego-form-widget-has-error': _errorType !== ''
      })}
    >
      {children}
      <div className="ant-form-explain">{errorMessage}</div>
    </section>
  );
};
