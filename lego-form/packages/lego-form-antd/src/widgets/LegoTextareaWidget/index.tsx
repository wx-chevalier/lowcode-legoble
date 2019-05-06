import { Input } from 'antd';

import * as React from 'react';

import './index.css';
import { LegoWidget, LegoWidgetProps } from '../LegoWidget';
import { filterJsonSchemaOptions } from '../../types/filter';

const { TextArea } = Input;

export interface LegoTextareaWidgetProps extends LegoWidgetProps {}

const prefix = 'lego-textarea-widget';

export const LegoTextareaWidget = (props: LegoTextareaWidgetProps) => {
  const {
    disabled = false,
    placeholder = '',
    value,
    options,

    onChange
  } = props;

  const [innerValue, setInnerValue] = React.useState(value);

  const { autoFocus = false, readOnly = false } = options;

  const otherOptions = filterJsonSchemaOptions(options);

  const { autosize = { minRows: 2, maxRows: 5 } } = options;

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
        <TextArea
          autoFocus={autoFocus}
          autosize={autosize}
          disabled={disabled}
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
