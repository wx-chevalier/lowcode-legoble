export function createElement(config: any) {
  const { type = 'auto', style = '', className = '', element = 'div' } = config;
  const doc = window.document;
  const tempEle = doc.createElement(element);
  switch (type) {
    case 'auto':
      {
        if (style) {
          tempEle.setAttribute('style', `${style}`);
        }
        if (className) {
          tempEle.setAttribute('class', `${className}`);
        }
      }
      break;
  }
  return tempEle;
}

export function appendRoot(config: object) {
  const doc = window.document;
  const { zindex } = config as any;
  const rootEle = createElement({
    style: `pointer-events:none;position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:${zindex};`,
    className: 'ls_root_container'
  });
  doc.body.appendChild(rootEle);

  return rootEle;
}

export function getEleStyle(
  dom: HTMLElement,
  {
    enterIframeSwitch,
    enterIframe
  }: {
    enterIframeSwitch: boolean;
    enterIframe: HTMLDivElement;
  }
): any {
  let left = 0;
  let top = 0;
  if (enterIframeSwitch) {
    const { left: __left, top: __top } = enterIframe.getBoundingClientRect();
    left = left + __left;
    top = top + __top;
  }
  const { left: _left, top: _top } = dom.getBoundingClientRect();
  left = left + _left;
  top = top + _top;
  return { width: dom.offsetWidth, height: dom.offsetHeight, left: left, top: top };
}
