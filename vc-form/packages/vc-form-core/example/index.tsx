import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as smoothscroll from 'smoothscroll-polyfill';
import Simple from './simple/Simple';

smoothscroll.polyfill();

ReactDOM.render(<Simple />, document.getElementById('root'));
