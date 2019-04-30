import { DatePicker } from 'antd';
import * as React from 'react';
import * as moment from 'moment';

import './index.less';
import { LegoWidget, LegoWidgetProps } from '../LegoWidget';
import { filterJsonSchemaOptions } from '../../types/filter';

const { MonthPicker } = DatePicker;
const prefix = 'lego-date-picker';

export interface LegoDatePickerProps extends LegoWidgetProps {}

export const LegoDatePicker = (props: LegoDatePickerProps) => {
  const { schema, disabled = false, value, options, onChange } = props;
  const { format = 'date' } = schema;

  const dateFormat = format === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM';

  const [innerValue, setInnerValue] = React.useState(
    value && value !== '' ? moment(value, dateFormat) : undefined
  );

  const { placeholder } = options;
  const otherOptions = filterJsonSchemaOptions(options);

  const handleChange = (date: moment.Moment, dateStr: string) => {
    setInnerValue(date);
    if (onChange) {
      onChange(dateStr);
    }
  };

  const Comp = format === 'date' ? DatePicker : MonthPicker;

  return (
    <LegoWidget {...props}>
      <div className={prefix}>
        <Comp
          disabled={disabled}
          placeholder={placeholder}
          value={innerValue}
          onChange={handleChange}
          {...otherOptions}
        />
      </div>
    </LegoWidget>
  );
};
