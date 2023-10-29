import { Input } from 'antd';
import * as React from 'react';

import './index.css';
import { LegoWidget, LegoWidgetProps } from '../LegoWidget';
import { filterJsonSchemaOptions } from '../../types/filter';

export interface LegoInputWidgetProps extends LegoWidgetProps {}

const prefix = 'lego-input-widget';

export const LegoInputWidget = (props: LegoInputWidgetProps) => {
  const { schema, disabled = false, value, options, onChange } = props;

  const [innerValue, setInnerValue] = React.useState(value);

  const { autoFocus, placeholder, readOnly } = options;
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
      <div className={prefix}>
        <Input
          autoFocus={autoFocus}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          readOnly={readOnly}
          value={innerValue}
          {...otherOptions}
          onChange={handleChange}
        />
      </div>
    </LegoWidget>
  );
};
