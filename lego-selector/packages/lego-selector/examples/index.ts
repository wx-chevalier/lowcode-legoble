import { LegoSelector } from '../src';

const playIframe = document.createElement('iframe');
playIframe.setAttribute('__ls__iframe__', '0');
document.body.append(playIframe);

const iframeDocument = playIframe.contentDocument!;

iframeDocument.open();
iframeDocument.write('<div>111</div><div>222</div><div>333</div>');
iframeDocument.close();

const playIframe1 = document.createElement('iframe');
playIframe1.setAttribute('__ls__iframe__', '0');
document.body.append(playIframe1);

const iframeDocument1 = playIframe1.contentDocument!;

iframeDocument1.open();
iframeDocument1.write('<div>444</div><div>555</div><div>666</div>');
iframeDocument1.close();

const config = {
  onSelect: (dom: HTMLElement) => {
    console.log('点击选中的 DOM：', dom);
  }
};

const ls = new LegoSelector(config);

ls.start();
