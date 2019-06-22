import Simmer from 'simmerjs';
import { pack, unpack } from 'jsonpack';
import isEqual from 'lodash.isequal';

const BLANK_FEATURE = {
  selector: '',
  content: '',
  position: null,
  size: null
};

export class LegoIdentifier {
  simmer: any;

  constructor() {
    this.simmer = new Simmer(window.document, {
      depth: 100,
      errorHandling: false
    });
  }

  detect(el = document) {
    let feature = {};

    feature.selector = this._detect(el, 'selector');
    feature.content = this._detect(el, 'content');
    feature.position = this._detect(el, 'position');
    feature.size = this._detect(el, 'size');

    return pack(feature);
  }

  query(
    featureString = pack(BLANK_FEATURE),
    type,
    options = {
      loose: false
    }
  ) {
    const feature = unpack(featureString);

    // query for the 1st time
    const el = this._query(feature, type, options);

    if (isEqual(el, null)) {
      return this._correct(feature, type, options);
    } else {
      return el;
    }
  }

  _detect(el = document, type) {
    let result;

    switch (type) {
      case 'content':
        try {
          result = el.innerText;
        } catch (e) {
          result = '';
        }
        break;

      case 'position':
        result = [el.offsetLeft, el.offsetTop];
        break;

      case 'size':
        let style = window.getComputedStyle(el);
        result = [parseInt(style['width']), parseInt(style['height'])];
        break;

      case 'selector':
      default:
        result = this.simmer(el);
        break;
    }

    return result;
  }

  _match(feature, type, options) {
    let alwaysMatch = false;
    let visible = true;

    // find the CURRENT el via the selector which is saved BEFORE
    // to see whether it's CURRENT feature equals to BEFORE
    const el = document.querySelector(feature.selector);

    if (type === 'selector') {
      // if in loose mode, always return match = true
      alwaysMatch = !!options.loose;

      // check whether the el is visible
      if (el !== null) {
        let rect = el.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
          visible = false;
        }
      }
    }

    return visible && (alwaysMatch || isEqual(this._detect(el, type), feature[type]));
  }

  _query(feature, type, options) {
    let result = null;

    // feature saved BEFORE
    const el = document.querySelector(feature.selector);

    if (this._match(feature, 'selector', options)) {
      switch (type) {
        case 'content':
        case 'position':
        case 'size':
          if (this._match(feature, type, options)) {
            result = el;
          }

          break;

        case 'selector':
        default:
          result = el;
      }
    }

    return result;
  }

  _correct(feature, type, options) {
    let result = null;

    if (feature.selector.indexOf('nth-child') > -1) {
      const { length, selectorParts } = _parseListSelector(feature.selector);

      for (let i = 0; i < length; i++) {
        feature.selector = selectorParts[0] + (i + 1) + selectorParts[1];

        let siblingEl = this._query(feature, type, options);

        if (!isEqual(siblingEl, null)) {
          return siblingEl;
        }
      }
    } else {
      result = null;
    }

    return result;
  }
}
