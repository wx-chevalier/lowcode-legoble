import { Select } from 'antd';
import * as React from 'react';

import './index.less';
import { LegoWidget, LegoWidgetProps } from '../LegoWidget';
import { filterJsonSchemaOptions } from '../../types/filter';
import { isValidArray } from '../../types/validator';

const { Option } = Select;
const prefix = 'lego-single-select-widget';

export interface LegoSingleSelectWidgetProps extends LegoWidgetProps {}

export const LegoSingleSelectWidget = (props: LegoSingleSelectWidgetProps) => {
  const {
    autofocus = false,
    disabled = false,
    id,
    placeholder = '',
    schema,
    value,
    options,
    onChange
  } = props;

  const [innerValue, setInnerValue] = React.useState(value === '' ? undefined : value);

  const otherOptions = filterJsonSchemaOptions(options);

  let { enumOptions = [] } = options;

  if (schema.enum && isValidArray(schema.enum)) {
    if (typeof schema.enum[0] === 'object') {
      enumOptions = schema.enum as any;
    } else {
      enumOptions = (schema.enum as string[]).map(e => ({
        label: e,
        value: e
      }));
    }
  }

  const handleChange = (newValue: string | number) => {
    setInnerValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <LegoWidget {...props}>
      <div className={prefix}>
        <Select
          id={id}
          value={innerValue}
          allowClear={true}
          autoFocus={autofocus}
          disabled={disabled}
          showSearch={true}
          placeholder={placeholder}
          optionFilterProp="children"
          optionLabelProp="title"
          {...otherOptions}
          onChange={handleChange}
        >
          {enumOptions.map((option, index) => (
            <Option key={index} title={option.label} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    </LegoWidget>
  );
};
