import { Button } from 'antd';
import cn from 'classnames';
import * as React from 'react';
import { LegoForm, LegoFormProps } from 'lego-form-core';

import 'antd/dist/antd.less';

import './index.less';
import { LegoInputWidget } from '../../widgets/LegoInputWidget';
import { LegoSingleSelectWidget } from '../../widgets/LegoSingleSelectWidget';
import { LegoMultipleSelectWidget } from '../../widgets/LegoMultipleSelectWidget/index';
import { LegoTextareaWidget } from '../../widgets/LegoTextareaWidget';
import { LegoDatePicker } from '../../widgets/LegoDatePicker/index';

const customWidgets = {
  DateWidget: LegoDatePicker,
  TextWidget: LegoInputWidget,
  TextareaWidget: LegoTextareaWidget,
  SelectWidget: LegoSingleSelectWidget,
  multipleSelect: LegoMultipleSelectWidget
};

const customFields = {};

const prefix = 'lego-antd-form';

export interface LegoAntdFormProps extends LegoFormProps {}

export function LegoAntdForm({
  className,
  fields,
  formData = {},
  widgets = {},
  fieldTemplate,
  arrayFieldTemplate,
  objectFieldTemplate,

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
        fieldTemplate={fieldTemplate}
        arrayFieldTemplate={arrayFieldTemplate}
        objectFieldTemplate={objectFieldTemplate}
        formData={formData}
        fields={finalFields}
        widgets={finalWidgets}
        submitComp={defaultSubmitComp}
        ref={($ref: any) => {
          legoFormRef.current = $ref;
        }}
      />
    </section>
  );
}
