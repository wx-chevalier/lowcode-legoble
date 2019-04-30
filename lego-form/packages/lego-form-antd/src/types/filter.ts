import { ValidateResult } from '../widgets/LegoWidget';

/** 过滤掉 react-json-schema 中的属性 */
export function filterJsonSchemaOptions(options: object) {
  const onlyOptions = [
    'autofocus',
    'autosize',
    'disabled',
    'emptyValue',
    'enum',
    'help',
    'inputType',
    'placeholder',
    'readonly',
    'showAllOption'
  ];

  const filteredOptions = { ...options };

  onlyOptions.forEach(option => {
    if (filteredOptions.hasOwnProperty(option)) {
      delete filteredOptions[option];
    }
  });

  return filteredOptions;
}

/** 提取出错误信息 */
export function filterValidateMessage(errorType?: string, validate?: [ValidateResult]) {
  if (!errorType || !validate) {
    return '';
  }

  let errorMessage = '';
  validate.forEach(v => {
    if (v.type === errorType) {
      errorMessage = v.message;
    }
  });
  return errorMessage;
}
