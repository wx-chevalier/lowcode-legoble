import { Button, Icon } from 'antd';
import * as React from 'react';
import { PureComponent } from 'react';

import HotkeysInput from '../HotkeysInput';
import { IMousetrapClass } from '../types';

import * as styles from './MultipleHotkeysInput.less';

interface DefaultProps {
  value: string[];
  defaultValue: string[];
  onChange: (value: string[]) => void;
}

interface Props extends Partial<DefaultProps> {
  Mousetrap?: IMousetrapClass;
  placeholder?: string;
  addButtonText?: string;
}

type InnerProps = Props & DefaultProps;

interface State {
  value: string[];
}

export default class MultipleHotkeysInput extends PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    value: [],
    defaultValue: [],
    onChange: () => {}
  };

  readonly props: InnerProps;

  private inputRefs: Record<string, HotkeysInput | null>;

  constructor(props: InnerProps) {
    super(props);

    const { value, defaultValue } = props;

    let stateValue: string[];
    if (Array.isArray(value)) {
      stateValue = value;
    } else if (Array.isArray(defaultValue)) {
      stateValue = defaultValue;
    } else {
      stateValue = [];
    }

    this.state = { value: stateValue };
    this.inputRefs = {};
  }

  componentWillUpdate(nextProps: InnerProps) {
    const { value } = this.props;
    if (value !== nextProps.value && nextProps.value !== null) {
      // eslint-disable-next-line react/no-will-update-set-state
      this.setState({
        value: nextProps.value
      });
    }
  }

  focusFirst() {
    const input = this.inputRefs['0'];
    if (input) {
      input.focus();
    }
  }

  render() {
    const { value } = this.state;
    const { Mousetrap, placeholder, addButtonText } = this.props;
    return (
      <div className={styles.container}>
        {value.map((keys, i) => (
          <div className={styles.row} key={i}>
            <HotkeysInput
              Mousetrap={Mousetrap}
              placeholder={placeholder}
              value={keys}
              onChange={(v: string) => this.setHotkeys(v, i)}
              ref={(ref: HotkeysInput | null) => this.updateInputRef(ref, i)}
            />
            <Button
              className={styles.remove}
              shape="circle"
              icon="close"
              title="点击删除此快捷键"
              onClick={() => this.removeHotkeys(i)}
            />
          </div>
        ))}
        <div>
          <Button onClick={() => this.appendHotkeys('')}>
            <Icon type="plus" />
            {addButtonText || '添加一个快捷键'}
          </Button>
        </div>
      </div>
    );
  }

  private appendHotkeys = (hotkeys: string) => {
    const { value } = this.state;
    const { onChange } = this.props;

    const newValue = value.concat([hotkeys]);

    this.setState({ value: newValue });

    if (onChange) {
      onChange(newValue);
    }

    // 自动聚焦到最后添加的那个输入框
    setTimeout(() => {
      const {
        value: { length: inputsNum }
      } = this.state;
      const lastInput = this.inputRefs[inputsNum - 1];
      if (lastInput) {
        lastInput.focus();
      }
    }, 10);
  };

  private setHotkeys = (hotkeys: string, i: number) => {
    const { value } = this.state;
    const { onChange } = this.props;

    const newValue = value.slice(0);
    newValue[i] = hotkeys;

    this.setState({ value: newValue });

    if (onChange) {
      onChange(newValue);
    }
  };

  private removeHotkeys = (i: number) => {
    const { value } = this.state;
    const { onChange } = this.props;

    const newValue = value.slice(0);
    newValue.splice(i, 1);

    this.setState({ value: newValue });

    if (onChange) {
      onChange(newValue);
    }
  };

  private updateInputRef = (ref: HotkeysInput | null, i: number) => {
    this.inputRefs[i] = ref;
  };
}
