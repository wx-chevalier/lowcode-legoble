import { Button } from 'antd';
import cn from 'classnames';
import * as React from 'react';
import { LegoForm, LegoFormProps } from 'lego-form-core';

import 'antd/dist/antd.less';

import './index.less';
import { LegoInputWidget } from '../../widgets/LegoInputWidget';

const customWidgets = {
  TextWidget: LegoInputWidget
};

const customFields = {};

const prefix = 'lego-antd-form';

export interface LegoAntdFormProps extends LegoFormProps {}

export function LegoAntdForm({
  className,
  fields,
  formData = {},
  widgets = {},

  ...otherProps
}: LegoAntdFormProps) {
  const legoFormRef = React.useRef<any>(null);

  const defaultSubmitComp = (
    <Button className={`${prefix}-submit-comp`} type="primary" htmlType="submit">
      提交
    </Button>
  );

  const finalWidgets = { ...customWidgets, ...widgets };
  const finalFields = { ...customFields, ...fields };

  return (
    <section
      className={cn({
        [className || '']: className,
        'lego-form-widget': true
      })}
    >
      <LegoForm
        {...otherProps}
        submitComp={defaultSubmitComp}
        fields={finalFields}
        widgets={finalWidgets}
        ref={($ref: any) => {
          legoFormRef.current = $ref;
        }}
      />
    </section>
  );
}
