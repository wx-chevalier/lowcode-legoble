import * as React from 'react';
import { PureComponent } from 'react';
import HotkeysListener from '../HotkeysListener';
import { HotkeysEventExt, HotkeysHandler, IMousetrapClass } from '../types';

interface Props {
  hotkeys: string | string[];
  onTrigger: (event: KeyboardEvent, hotkeys: string) => void;
  children?: React.ReactNode;
  Mousetrap?: IMousetrapClass;
}

export default class GlobalHotkeys extends PureComponent<Props, {}> {
  private _listener?: HotkeysListener;

  componentDidMount() {
    this.rebind(this.props);
  }

  componentWillUpdate(nextProps: Props) {
    const { hotkeys, Mousetrap } = this.props;

    if (Mousetrap !== nextProps.Mousetrap || !hotkeysAreEqual(hotkeys, nextProps.hotkeys)) {
      this.rebind(nextProps);
    }
  }

  componentWillMount() {
    this.reset();
  }

  reset() {
    if (this._listener) {
      this._listener.reset();
      this._listener = undefined;
    }
  }

  rebind(props: Props) {
    this.reset();

    const listener = new HotkeysListener(document, props.Mousetrap);
    listener.on(props.hotkeys, this.handleHotkeys);

    this._listener = listener;
  }

  render() {
    return this.props.children || null;
  }

  private handleHotkeys: HotkeysHandler = (event: KeyboardEvent, ext: HotkeysEventExt) => {
    const { onTrigger } = this.props;
    if (onTrigger) {
      onTrigger(event, ext.hotkey);
    }
  };
}

function hotkeysAreEqual(a: string | string[], b: string | string[]) {
  const sA = typeof a === 'string' ? a : a.sort().join(',');
  const sB = typeof b === 'string' ? b : b.sort().join(',');
  return sA === sB;
}
