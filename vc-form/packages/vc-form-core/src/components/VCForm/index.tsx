import cn from 'classnames';
import * as React from 'react';
import Form, { Widget, Field, ISubmitEvent, IChangeEvent } from 'react-jsonschema-form';

import * as styles from './index.less';
import { VCJsonSchema, VCUiSchema } from '../../types/schema';

export interface VCFormOptions {
  // 对齐位置
  alignType?: 'vertical' | 'inline';
  // 是否禁用
  disabled?: boolean;
  // 标签类型
  labelType?: 'vertical' | 'inline';
  // 标签位置
  labelAlign?: 'left' | 'right';
  // 是否只读
  readOnly?: boolean;
  // 是否不显示标签
  noLabel?: boolean;
}

export interface VCFormRef {
  [key: string]: () => void;
}

export interface VCFormProps extends VCFormOptions {
  className?: string;
  formContext?: object;
  formData?: object;
  fields?: { [name: string]: Field };
  jsonSchema: VCJsonSchema;
  uiSchema: VCUiSchema;
  widgets?: { [name: string]: Widget };

  onChange?: () => {};
  onError?: () => {};
  onSubmit?: () => {};
}

export interface VCFormState {}

export function VCForm<T>({
  className,
  fields,
  formContext = {},
  formData = {},
  jsonSchema,
  uiSchema,
  widgets = {},

  // Options
  alignType = 'inline',
  disabled = false,
  labelType = 'inline',
  labelAlign = 'left',
  readOnly = false,
  noLabel = false,

  onChange,
  onError,
  onSubmit
}: VCFormProps) {
  const [isDirty, setIsDirty] = React.useState(false);
  const [innerFormData, setInnerFormData] = React.useState(formData);
  const ref = React.useRef<{ focus: () => void }>();

  const handleSubmit = (e: ISubmitEvent<object>) => {};

  /** 响应输入数据变化 */
  const handleChange = (e: IChangeEvent<object>) => {
    if (!isDirty) {
      setIsDirty(isDirty);
    }

    const currentFormData = e.formData;

    console.log(currentFormData);
  };

  React.useImperativeHandle(ref, () => ({
    focus: () => {}
  }));

  // 当外部 Props 状态变化后，更新数据
  React.useEffect(() => {
    setInnerFormData(formData);
  }, [formData]);

  return (
    <section
      className={cn({
        [className || '']: className,
        [styles.container]: true,

        [styles.disabled]: disabled,
        [styles.readOnly]: readOnly,
        [styles.noLabel]: noLabel
      })}
    >
      <Form
        formData={innerFormData}
        fields={fields}
        noValidate={true}
        schema={jsonSchema}
        showErrorList={false}
        uiSchema={uiSchema}
        widgets={widgets}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default React.forwardRef(VCForm);
