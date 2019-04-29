import cn from 'classnames';
import * as React from 'react';
import Form, { Widget, Field, IChangeEvent } from 'react-jsonschema-form';

import './index.less';
import { LegoJsonSchema, LegoUiSchema } from '../../types/schema';
import { compare } from '../../types/validator';
import { mergeFormDataWithDefault } from '../../types/getter';

export interface LegoFormOptions {
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

export interface LegoFormRef {
  [key: string]: () => void;
}

export interface LegoFormProps extends LegoFormOptions {
  className?: string;
  children?: JSX.Element;
  formContext?: object;
  formData?: object;
  fields?: { [name: string]: Field };
  jsonSchema: LegoJsonSchema;
  ref?: ($ref: any) => void;
  popupContainer?: () => JSX.Element;
  submitComp?: JSX.Element;
  uiSchema: LegoUiSchema;
  widgets?: { [name: string]: Widget };

  onChange?: (formData: object) => void;
  onError?: () => void;
  onValidate?: (formData: object) => void;
  onSubmit?: (formData: object) => void;
}

export interface LegoFormState {
  isDirty: boolean;
  formData: object;
}

const prefix = 'lego-form';

export class LegoForm extends React.PureComponent<LegoFormProps, LegoFormState> {
  static defaultProps = {
    formContext: {},
    formData: {},
    widgets: {}
  };

  state = { isDirty: false, formData: this.props.formData || {} };

  componentWillReceiveProps(nextProps: LegoFormProps) {
    const { formData = {} } = nextProps;

    if (formData !== this.props.formData) {
      this.setState({
        formData
      });
    }
  }

  componentDidMount() {}

  handleSubmit = () => {
    const { jsonSchema, onSubmit } = this.props;
    const { formData } = this.state;

    if (onSubmit) {
      onSubmit(mergeFormDataWithDefault(jsonSchema, formData));
    }
  };

  handleChange = (e: IChangeEvent<object>) => {
    const { onChange } = this.props;
    const { formData, isDirty } = this.state;

    if (!isDirty) {
      this.setState({
        isDirty: true
      });
    }

    const currentFormData = e.formData;
    let changedFieldName = '';

    Object.keys(currentFormData).forEach(fieldName => {
      if (!compare(currentFormData[fieldName], formData[fieldName])) {
        changedFieldName = fieldName;
      }
    });

    if (!changedFieldName) {
      return;
    }

    // 执行表单校验，TODO

    // 重新设置数据
    this.setState({
      formData: currentFormData
    });

    // 触发外部变化
    if (onChange) {
      onChange(currentFormData);
    }
  };

  render() {
    const {
      className,
      children,
      fields,
      formContext,
      jsonSchema,
      popupContainer,
      submitComp,
      uiSchema,
      widgets,

      // Options
      alignType = 'inline',
      disabled = false,
      labelType = 'inline',
      labelAlign = 'left',
      readOnly = false,
      noLabel = false
    } = this.props;

    const { formData } = this.state;

    return (
      <section
        className={cn({
          [className || '']: className,
          [`${prefix}-container`]: true,

          [`${prefix}-disabled`]: disabled,
          [`${prefix}-read-only`]: readOnly,
          [`${prefix}-no-label`]: noLabel
        })}
      >
        <Form
          formContext={{ ...formContext, alignType, labelAlign, labelType, popupContainer }}
          formData={formData}
          fields={fields}
          noHtml5Validate={true}
          noValidate={true}
          schema={jsonSchema}
          showErrorList={false}
          uiSchema={uiSchema}
          widgets={widgets}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        >
          {children || submitComp}
        </Form>
      </section>
    );
  }
}
