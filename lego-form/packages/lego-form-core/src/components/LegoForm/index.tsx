import cn from 'classnames';
import * as React from 'react';
import Form, {
  Widget,
  Field,
  IChangeEvent,
  ArrayFieldTemplateProps,
  FieldTemplateProps,
  ObjectFieldTemplateProps
} from 'react-jsonschema-form';

import './index.less';
import { LegoJsonSchema, LegoUiSchema } from '../../types/schema';
import { compare } from '../../types/validator';
import { mergeFormDataWithDefault } from '../../types/getter';

export interface LegoFormOptions {
  // 对齐位置
  alignType?: 'vertical' | 'inline';
  // 元素布局
  formItemLayout?: {
    labelCol: {
      span: number;
    };
    wrapperCol: {
      span: number;
    };
  };
  // 是否禁用
  disabled?: boolean;
  // 标签类型
  labelType?: 'vertical' | 'inline';
  // 标签位置
  labelAlign?: 'left' | 'right';
  // 是否不显示标签
  noLabel?: boolean;
  // 容器
  popupContainer?: () => JSX.Element;
  itemNumberInRow?: number;
}

export interface LegoFormRef {
  [key: string]: () => void;
}

export interface LegoFormContext extends Partial<LegoFormOptions> {}

export interface LegoFormProps extends LegoFormOptions {
  // schema & template
  fieldTemplate?: React.FunctionComponent<FieldTemplateProps>;
  arrayFieldTemplate?: React.FunctionComponent<ArrayFieldTemplateProps>;
  objectFieldTemplate?: React.FunctionComponent<ObjectFieldTemplateProps>;
  jsonSchema: LegoJsonSchema;
  uiSchema: LegoUiSchema;
  submitComp?: JSX.Element;
  fields?: { [name: string]: Field };
  widgets?: { [name: string]: Widget };

  // jsx
  className?: string;
  children?: JSX.Element;
  formContext?: LegoFormContext;
  formData?: object;
  ref?: ($ref: any) => void;

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
      formContext,

      // schema & template
      fields,
      jsonSchema,
      popupContainer,
      submitComp,
      uiSchema,
      widgets,
      fieldTemplate,
      arrayFieldTemplate,
      objectFieldTemplate,

      // Options
      alignType = 'inline',
      disabled = false,
      labelType = 'inline',
      labelAlign = 'left',
      noLabel = false
    } = this.props;

    const { formData } = this.state;

    return (
      <section
        className={cn({
          [className || '']: className,
          [`${prefix}-container`]: true,

          [`${prefix}-disabled`]: disabled,
          [`${prefix}-noLabel`]: noLabel
        })}
      >
        <Form
          formContext={{ ...formContext, alignType, labelAlign, labelType, popupContainer }}
          formData={formData}
          fields={fields}
          FieldTemplate={fieldTemplate}
          ArrayFieldTemplate={arrayFieldTemplate}
          ObjectFieldTemplate={objectFieldTemplate}
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
