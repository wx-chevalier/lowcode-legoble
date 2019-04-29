import cn from 'classnames';
import * as React from 'react';
import { WidgetProps } from 'react-jsonschema-form';

import './index.less';

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
}

export const LegoWidget = () => {
  return (
    <section
      className={cn({
        'lego-form-widget': true
      })}
    />
  );
};
