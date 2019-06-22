import { appendRoot, getEleStyle } from './utils';

export class LegoSelector {
  selectSwitch: boolean = false; // 选择开关
  enterIframeSwitch: boolean = false; // 是否进入了自定义的 iframe 中
  enterIframe: any;

  targetEle: HTMLElement;
  rootEle: any;
  clientY: number = 0;
  clientX: number = 0;

  maskEventTimer: any;
  maskEventTimerSwitch: boolean = false;

  initConfig: any = {
    zindex: 999,
    showInfo: false,
    style: '',
    tip: '',
    frameName: '__ls__iframe__',
    onSelect: (dom: HTMLElement) => {
      console.log('Select Dom:', dom);
    }
  };
  constructor(initConfig = {}) {
    this.initConfig = {
      ...this.initConfig,
      ...initConfig
    };
    const { frameName } = this.initConfig;
    document.addEventListener('mousemove', e => {
      if (this.selectSwitch) {
        if (this.maskEventTimer) clearTimeout(this.maskEventTimer);
        this.maskEventTimerSwitch = false;
        this.maskEventTimer = setTimeout(() => {
          this.maskEventTimerSwitch = true;
          this.review();
        }, 40);
        const { clientX, clientY } = e;
        this.clientY = clientY;
        this.clientX = clientX;
        const dom: any = document.elementFromPoint(clientX, clientY);
        if (dom && dom.id !== '__ls__mask__') {
          this.enterIframeSwitch = false;
          this.targetEle = dom;
          this.review();
        }
      } else {
        this.clear();
      }
    });
    const iframeArr = document.getElementsByTagName('iframe');

    for (let i = 0; i < iframeArr.length; i++) {
      const iframe = iframeArr[i];

      let iframeBindSwitch = false;

      const attributes = iframe.attributes;

      for (let j = 0; j < attributes.length; j++) {
        if (attributes[j].name == frameName) {
          iframeBindSwitch = true;
        }
      }
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow && iframeBindSwitch) {
        var doc = iframeWindow.document;
        doc.addEventListener('mousemove', e => {
          if (this.selectSwitch) {
            if (this.maskEventTimer) clearTimeout(this.maskEventTimer);
            this.maskEventTimerSwitch = false;
            this.maskEventTimer = setTimeout(() => {
              this.maskEventTimerSwitch = true;
              this.review();
            }, 40);
            this.enterIframe = iframe;
            this.enterIframeSwitch = true;
            const { left: _left, top: _top } = this.enterIframe.getBoundingClientRect();
            const { clientX, clientY } = e;
            this.clientY = e.clientY + _top;
            this.clientX = e.clientX + _left;
            const dom: any = doc.elementFromPoint(clientX, clientY);
            if (dom.id !== '__ls__mask__') {
              this.targetEle = dom;
              this.review();
            }
          } else {
            this.clear();
          }
        });
      }
    }
  }

  public start() {
    this.selectSwitch = true;
  }

  public stop() {
    this.selectSwitch = false;
  }

  public review() {
    if (!this.rootEle) {
      this.rootEle = appendRoot(this.initConfig);
    }

    if (this.rootEle) {
      const { width, height, top, left } = getEleStyle(this.targetEle, {
        enterIframeSwitch: this.enterIframeSwitch,
        enterIframe: this.enterIframe
      });

      const { showInfo, style, tip } = this.initConfig;

      const maskEventTimerSwitch = this.maskEventTimerSwitch;

      this.rootEle.innerHTML = `
          <div style="position:absolute;border:dashed #419bf9;pointer-events:none;border-width:2px 0;width:100%;height:${height}px;left:0px;top:${top}px;"></div>
          <div style="position:absolute;border:dashed #419bf9;pointer-events:none;border-width:0 2px;height:100%;width:${width}px;left:${left}px;top:0px;"></div>
          <div style="position:absolute;pointer-events:none;background:rgba(255, 0, 0, 0.2);height:${height}px;width:${width}px;left:${left}px;top:${top}px;${style}">
            ${
              tip
                ? `<div style="position:absolute;left:0;${
                    top > 40 ? 'top:-40px;padding-bottom:8px;' : 'bottom:-40px;padding-top:8px;'
                  }">
                <div style="position:absolute;width:0;height:0;border-color:transparent;border-style:solid;${
                  top > 40
                    ? 'bottom:3px;border-width:5px 5px 0;border-top-color:rgba(0,0,0,0.75);'
                    : 'top:3px;border-width:0 5px 5px;border-bottom-color:rgba(0,0,0,0.75);'
                }left:16px;"></div>
                <div style='white-space:nowrap;padding:6px 8px;color:#fff;text-align:left;text-decoration:none;background-color:rgba(0,0,0,0.75);border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.15);min-height:20px;'>${tip}</div>
            </div>`
                : ''
            }
          </div>
          ${
            showInfo
              ? `<div style="position:absolute;left:0;top:0;width:100%;height:100%;font-size:12px;pointer-events:none;">
            <div style="background:#000;padding:4px;position:absolute;left:0;top:0;padding:0 10px;">
              <div style="display:inline-block;">
                <span style="color:rgb(158,255,250);">${this.targetEle.tagName}</span>
                <span style="color:rgb(251,140,255);">.${this.targetEle.className}</span>
              </div>
              <div style="display:inline-block;margin:0 0 0 10px;padding:0 0 0 10px;color:#fff;border-left:1px solid #ccc;">
                <span>width：${width}</span>，
                <span>height：${height}</span>
              </div>
              <div style="display:inline-block;margin:0 0 0 10px;padding:0 0 0 10px;color: #fff;border-left: 1px solid #ccc;">
                <span>left：${left}</span>，
                <span>top：${top}</span>
              </div>
            </div>
          </div>`
              : ''
          }
          ${
            maskEventTimerSwitch
              ? `<div id="__ls__mask__" style="cursor:pointer;position:absolute;pointer-events:auto;background:rgba(255, 255, 0,0);height:30px;width:30px;left:${this
                  .clientX - 15}px;top:${this.clientY - 15}px;"/>`
              : ''
          }
          `;
      if (maskEventTimerSwitch) {
        const clickDom = document.getElementById('__ls__mask__');
        clickDom &&
          clickDom.addEventListener('mousedown', () => {
            this.selectSwitch = false;
            this.clear();
            this.initConfig.onSelect(this.targetEle);
          });
      }
    }
  }

  public clear() {
    if (this.rootEle) {
      this.rootEle.innerHTML = '';
    }
  }
}
