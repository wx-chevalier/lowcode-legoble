import { Input } from 'antd';
import cn from 'classnames';
import * as React from 'react';

import './index.less';
import { LegoWidgetProps } from '../LegoWidget';
import { filterValidateMessage, filterJsonSchemaOptions } from '../../types/filter';

export interface LegoInputWidgetProps extends LegoWidgetProps {}

export const LegoInputWidget = ({
  schema,
  autofocus = false,
  disabled = false,
  placeholder = '',
  value,
  options,
  readonly = false,
  onChange
}: LegoInputWidgetProps) => {
  const [innerValue, setInnerValue] = React.useState(value);

  const { _errorType, validate } = options;

  // 提取出错误信息
  const errorMessage = filterValidateMessage(_errorType, validate);
  const otherOptions = filterJsonSchemaOptions(options);

  const { minLength = 0, maxLength = Infinity } = schema;

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    setInnerValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div
      className={cn({
        'lego-form-widget': true,
        'lego-form-widget-has-error': _errorType !== ''
      })}
    >
      <Input
        autoFocus={autofocus}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        readOnly={readonly}
        value={innerValue}
        {...otherOptions}
        onChange={handleChange}
      />
      <div className="ant-form-explain">{errorMessage}</div>
    </div>
  );
};
