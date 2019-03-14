# vc-form

vc-form 是动态表单解决方案，借鉴了著名的 [json-schema-form]()，其设计与理论归纳在了 [Web 开发中的工程实践 https://url.wx-coder.cn/jXxlM ](https://url.wx-coder.cn/jXxlM)系列文章中。

![image](https://user-images.githubusercontent.com/5803001/47982572-2d8e7200-e10b-11e8-827c-eec782a37348.png)

# Development

## packages

## BootStrap

# Reference

## Widget Map

```js
const widgetMap = {
  boolean: {
    checkbox: 'CheckboxWidget',
    radio: 'RadioWidget',
    select: 'SelectWidget',
    hidden: 'HiddenWidget'
  },
  string: {
    text: 'TextWidget',
    password: 'PasswordWidget',
    email: 'EmailWidget',
    hostname: 'TextWidget',
    ipv4: 'TextWidget',
    ipv6: 'TextWidget',
    uri: 'URLWidget',
    'data-url': 'FileWidget',
    radio: 'RadioWidget',
    select: 'SelectWidget',
    textarea: 'TextareaWidget',
    hidden: 'HiddenWidget',
    date: 'DateWidget',
    datetime: 'DateTimeWidget',
    'date-time': 'DateTimeWidget',
    'alt-date': 'AltDateWidget',
    'alt-datetime': 'AltDateTimeWidget',
    color: 'ColorWidget',
    file: 'FileWidget'
  },
  number: {
    text: 'TextWidget',
    select: 'SelectWidget',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget'
  },
  integer: {
    text: 'TextWidget',
    select: 'SelectWidget',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget'
  },
  array: {
    select: 'SelectWidget',
    checkboxes: 'CheckboxesWidget',
    files: 'FileWidget',
    hidden: 'HiddenWidget'
  }
};
```
