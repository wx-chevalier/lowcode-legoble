import { Input } from 'antd';
import * as React from 'react';

import './index.less';
import { LegoWidget, LegoWidgetProps } from '../LegoWidget';
import { filterJsonSchemaOptions } from '../../types/filter';

export interface LegoInputWidgetProps extends LegoWidgetProps {}

export const LegoInputWidget = (props: LegoInputWidgetProps) => {
  const {
    schema,
    autofocus = false,
    disabled = false,
    placeholder = '',
    value,
    options,
    readonly = false,
    onChange
  } = props;

  const [innerValue, setInnerValue] = React.useState(value);

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
    <LegoWidget {...props}>
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
    </LegoWidget>
  );
};
