import { Button } from 'antd';
import cn from 'classnames';
import * as React from 'react';
import { VCForm, VCFormProps } from 'lego-form-core';

import 'antd/dist/antd.less';

import './index.less';
import { VCInputWidget } from '../../widgets/VCInputWidget';

const customWidgets = {
  TextWidget: VCInputWidget
};

const customFields = {};

const prefix = 'vc-antd-form';

export interface VCAntdFormProps extends VCFormProps {}

export function VCAntdForm({
  className,
  fields,
  formData = {},
  widgets = {},

  ...otherProps
}: VCAntdFormProps) {
  const vcFormRef = React.useRef<any>(null);

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
      <VCForm
        {...otherProps}
        defaultSubmitComp={defaultSubmitComp}
        fields={finalFields}
        widgets={finalWidgets}
        ref={($ref: any) => {
          vcFormRef.current = $ref;
        }}
      />
    </section>
  );
}
