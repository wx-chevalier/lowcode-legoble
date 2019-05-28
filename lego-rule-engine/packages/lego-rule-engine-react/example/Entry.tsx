import { Button } from 'antd';
import * as React from 'react';
import { PureComponent } from 'react';
import { GlobalHotkeys, MultipleHotkeysInput } from '../src';

import * as styles from './style.less';

interface HotkeysRecord {
  time: string;
  hotkeys: string;
}

interface State {
  configHotkeys: string[];
  effectHotkeys: string[];
  triggeredTimes: number;
  triggeredHotkeys: HotkeysRecord[];
}

export default class App extends PureComponent {
  state: State = {
    configHotkeys: [''],
    effectHotkeys: [],
    triggeredTimes: 0,
    triggeredHotkeys: []
  };

  private hotkeysInput: MultipleHotkeysInput | null = null;

  componentDidMount() {
    setTimeout(() => {
      if (this.hotkeysInput) {
        this.hotkeysInput.focusFirst();
      }
    });
  }

  onModalClose = () => {
    this.setState({
      showModal: false
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <div>
            <h3>配置热键</h3>
            <div>
              <MultipleHotkeysInput
                ref={ref => {
                  this.hotkeysInput = ref;
                }}
                placeholder="请输入热键"
                value={this.state.configHotkeys}
                addButtonText="添加一个热键"
                onChange={hotkeys => {
                  this.setState({
                    configHotkeys: hotkeys
                  });
                }}
              />
            </div>
            <div style={{ margin: '24px auto' }}>
              <Button
                type="primary"
                onClick={e => {
                  this.setState((prevState: State) => ({
                    effectHotkeys: prevState.configHotkeys
                  }));
                }}
              >
                保存配置
              </Button>
            </div>
            <p style={{ margin: '24px auto' }}>
              当前输入的热键：{this.state.configHotkeys.join(', ')}
            </p>
          </div>
        </div>
        <div className={styles.right}>
          <GlobalHotkeys
            hotkeys={this.state.effectHotkeys}
            onTrigger={(event, hotkeys) => {
              event.preventDefault();
              this.setState((prevState: State) => ({
                triggeredTimes: prevState.triggeredTimes + 1,
                triggeredHotkeys: [
                  {
                    time: new Date().toLocaleString(),
                    hotkeys
                  }
                ].concat(prevState.triggeredHotkeys)
              }));
            }}
          />

          <p>当前生效的热键：{this.state.effectHotkeys.join(', ')}</p>
          <p>你已经触发了 {this.state.triggeredTimes} 次热键。</p>
          {this.state.triggeredTimes > 0 &&
            this.state.triggeredHotkeys.map(({ hotkeys, time }) => (
              <p>
                在 {time} 触发了 {hotkeys}
              </p>
            ))}
        </div>
      </div>
    );
  }
}
