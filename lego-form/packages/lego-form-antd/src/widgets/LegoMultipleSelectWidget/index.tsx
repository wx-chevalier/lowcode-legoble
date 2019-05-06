import { Select } from 'antd';
import * as React from 'react';

import './index.css';
import { LegoWidget, LegoWidgetProps } from '../LegoWidget';
import { filterJsonSchemaOptions } from '../../types/filter';
import { isValidArray } from 'lego-form-antd/src/types/validator';

const { Option } = Select;
const prefix = 'lego-multiple-select-widget';

export interface LegoMultipleSelectWidgetProps extends LegoWidgetProps {}

export const LegoMultipleSelectWidget = (props: LegoMultipleSelectWidgetProps) => {
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

  const [innerValue, setInnerValue] = React.useState(value === '' ? [] : value);

  const otherOptions = filterJsonSchemaOptions(options);

  let enumOptions: {
    label: string;
    value: string | number | undefined;
  }[] = [];

  if (schema.enum && isValidArray(schema.enum)) {
    if (typeof schema.enum[0] === 'object') {
      enumOptions = schema.enum as {
        label: string;
        value: string | number | undefined;
      }[];
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
          mode="multiple"
          // showAllOption={showAllOption}
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
