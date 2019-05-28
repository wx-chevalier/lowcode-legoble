import * as React from 'react';
import { PureComponent } from 'react';
import HotkeysListener from '../HotkeysListener';

import { KEY_ALL } from '../keys';
import { HotkeysEventExt, HotkeysHandler, IMousetrapClass } from '../types';
import * as styles from './HotkeysInput.less';

interface DefaultProps {
  value: string;
  defaultValue: string;
  onChange: (hotkey: string) => void;
}

interface Props extends Partial<DefaultProps> {
  Mousetrap?: IMousetrapClass;
  placeholder?: string;
}

type InnerProps = Props & DefaultProps;

interface State {
  value: string;
}

export default class HotkeysInput extends PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    value: '',
    defaultValue: '',
    onChange: () => {}
  };

  readonly props: InnerProps;

  private input: HTMLInputElement | null;

  private listener: HotkeysListener | null;

  constructor(props: InnerProps) {
    super(props);

    let stateValue: string;
    if (props.value !== null) {
      stateValue = props.value;
    } else if (props.defaultValue !== null) {
      stateValue = props.defaultValue;
    } else {
      stateValue = '';
    }

    this.state = { value: stateValue };
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

  componentWillUnmount() {
    this.resetRecorder();
  }

  focus = () => {
    if (this.input) {
      this.input.focus();
    }
  };

  setValue = (keyName: string) => {
    const { onChange } = this.props;
    const value = keyName === 'BACKSPACE' ? '' : keyName;
    this.setState({ value });

    if (onChange) {
      onChange(value);
    }
  };

  resetRecorder = () => {
    if (this.listener) {
      this.listener.off(KEY_ALL, this.onKeyPressed);
      this.listener.reset();
      this.listener = null;
    }
  };

  updateInputRef = (ref: HTMLInputElement | null) => {
    this.input = ref;

    this.resetRecorder();

    if (ref) {
      const { Mousetrap } = this.props;
      this.listener = Mousetrap ? new HotkeysListener(ref, Mousetrap) : new HotkeysListener(ref);
      this.listener.on(KEY_ALL, this.onKeyPressed);
    }
  };

  onKeyPressed: HotkeysHandler = (e: KeyboardEvent, { hotkey }: HotkeysEventExt) => {
    this.setValue(hotkey);
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  render() {
    const { placeholder } = this.props;
    const { value } = this.state;
    return (
      <input
        className={styles.input}
        type="text"
        onChange={noop}
        placeholder={placeholder}
        value={value}
        ref={this.updateInputRef}
      />
    );
  }
}

function noop() {}
