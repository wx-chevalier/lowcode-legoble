# lego-form

[lego-form](https://github.com/wx-chevalier/Legoble/tree/master/lego-form) is a dynamic form solution with visually configuration, built on [json-schema-form](). It supports multiple widgets styled with antd, flexible event/trigger system and also a part of [Legoble](https://github.com/wx-chevalier/Legoble).

Try it in [Online Demo](https://stackblitz.com/edit/lego-form).

---

lego-form 是动态表单解决方案，借鉴了著名的 [json-schema-form]()，其设计与理论归纳在了 [Web 开发中的工程实践 https://url.wx-coder.cn/jXxlM ](https://url.wx-coder.cn/jXxlM)系列文章中。

![](https://i.postimg.cc/HnXYkbZS/image.png)

# Development

## packages

- publish

```sh
$ npm run pub
```

## bootStrap

# Reference

## Widget Map | 组件映射

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

# About

## Roadmap

- 可视化拖拽
- 动态布局
- 条件触发器
- 补齐组件

## Motivation & Credits

- [react-jsonschema-form-conditionals #Project](https://github.com/RxNT/react-jsonschema-form-conditionals)

- [react-jsonschema-form-pagination](https://github.com/RxNT/react-jsonschema-form-pagination): Separation of huge schemas into navs

- [react-jsonschema-form-material-ui #Project#](https://github.com/vip-git/react-jsonschema-form-material-ui): React - Material UI components for building Web forms from JSON Schema.

- [react-jsonschema-form-extras](https://github.com/RxNT/react-jsonschema-form-extras): This project provides light integration over established React components, trying to keep configurations compatible with original project.
