import * as React from 'react';

import JSONEditor from 'jsoneditor/dist/jsoneditor-minimalist';
import 'jsoneditor/dist/jsoneditor.css';

import './index.less';

/**
 * @typedef {{
 * tree: string,
 * view: string,
 * form: string,
 * code: string,
 * text: string,
 * allValues: Array<string>
 * }} TJsonEditorModes
 */
type modeType = 'tree' | 'view' | 'form' | 'code' | 'text';

const modes: { [key: string]: string | string[] } = {
  tree: 'tree',
  view: 'view',
  form: 'form',
  code: 'code',
  text: 'text'
};

const values = Object.values(modes);

modes.allValues = values as string[];

interface JsonEditorProps {
  ace: object;
  modes: modeType[];
  allowedModes: modeType[];
  ajv: object;
  history: boolean;
  htmlElementProps: object;
  mode: modeType;
  name: string;
  navigationBar: boolean;
  search: boolean;
  schema: object;
  schemaRefs: object;
  statusBar: boolean;
  value: object;
  tag: string;
  theme: string;

  onChange: (obj: object | null) => void;
  onError: () => void;
  onModeChange: () => void;
  innerRef: (element: JSX.Element) => void;
}

export default class JsonEditor extends React.Component<Partial<JsonEditorProps>> {
  static defaultProps = {
    tag: 'div',
    mode: modes.tree,
    history: false,
    search: true,
    navigationBar: true,
    statusBar: true
  };

  /**
   * @type TJsonEditorModes
   */
  static modes = modes;

  htmlElementRef = null;
  jsonEditor: any = null;
  err: any = null;

  constructor(props: JsonEditorProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.setRef = this.setRef.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.focus = this.focus.bind(this);
  }

  componentDidMount() {
    const { allowedModes, innerRef, htmlElementProps, tag, onChange, ...rest } = this.props;

    this.createEditor({
      ...rest,
      modes: allowedModes
    });
  }

  componentWillReceiveProps({
    allowedModes,
    schema,
    name,
    theme,
    schemaRefs,
    innerRef,
    htmlElementProps,
    tag,
    onChange,
    value,
    ...rest
  }: JsonEditorProps) {
    if (this.jsonEditor) {
      if (theme !== this.props.theme) {
        this.createEditor({
          ...rest,
          theme,
          modes: allowedModes
        });
      } else {
        if (schema !== this.props.schema || schemaRefs !== this.props.schemaRefs) {
          this.jsonEditor.setSchema(schema, schemaRefs);
        }

        if (name !== this.jsonEditor.getName()) {
          this.jsonEditor.setName(name);
        }

        if (value !== this.props.value) {
          this.jsonEditor.set(value);
        }
      }
    }
  }

  shouldComponentUpdate({ htmlElementProps }: JsonEditorProps) {
    return htmlElementProps !== this.props.htmlElementProps;
  }

  componentWillUnmount() {
    if (this.jsonEditor) {
      this.jsonEditor.destroy();
      this.jsonEditor = null;
    }
  }

  setRef(element: any) {
    this.htmlElementRef = element;
    if (this.props.innerRef) {
      this.props.innerRef(element);
    }
  }

  createEditor({ value, ...rest }: any) {
    if (this.jsonEditor) {
      this.jsonEditor.destroy();
    }

    this.jsonEditor = new JSONEditor(this.htmlElementRef, {
      onChange: this.handleChange,
      ...rest
    });

    this.jsonEditor.set(value);
  }

  handleChange() {
    if (this.props.onChange) {
      try {
        const text = this.jsonEditor.getText();
        if (text === '') {
          this.props.onChange(null);
        }

        const currentJson = this.jsonEditor.get();
        if (this.props.value !== currentJson) {
          this.props.onChange(currentJson);
        }
      } catch (err) {
        this.err = err;
      }
    }
  }

  collapseAll() {
    if (this.jsonEditor) {
      this.jsonEditor.collapseAll();
    }
  }

  expandAll() {
    if (this.jsonEditor) {
      this.jsonEditor.expandAll();
    }
  }

  focus() {
    if (this.jsonEditor) {
      this.jsonEditor.focus();
    }
  }

  render() {
    const { htmlElementProps, tag } = this.props;

    return React.createElement(tag!, {
      ...htmlElementProps,
      ref: this.setRef
    });
  }
}
