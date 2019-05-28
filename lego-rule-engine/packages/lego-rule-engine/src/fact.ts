import * as hash from 'object-hash';
import * as debug from 'debug';
import * as deepClone from 'clone';

import { Almanac } from './almanac';
let verbose = debug('json-rules-engine-verbose');

export interface FactOptions {
  cache?: boolean;
  priority?: number;
}

export class Fact {
  static CONSTANT = 'CONSTANT';
  static DYNAMIC = 'DYNAMIC';

  calculationMethod: Function | undefined;

  type: string;
  id: string;
  value: any;
  priority: number;
  options: any;
  cacheKeyMethod: (id: string, params: any) => { params: any; id: any };

  /**
   * Returns a new fact instance
   * @param  {string} id - fact unique identifer
   * @param  {object} options
   * @param  {boolean} options.cache - whether to cache the fact's value for future rules
   * @param  {primitive|function} valueOrMethod - constant primitive, or method to call when computing the fact's value
   * @return {Fact}
   */
  constructor(id: string, valueOrMethod: any, options?: FactOptions) {
    this.id = id;
    let defaultOptions = { cache: true };
    let optionsScoped: FactOptions | undefined = deepClone(options) || {};

    if (typeof options === 'undefined') {
      optionsScoped = defaultOptions;
    }

    if (typeof valueOrMethod !== 'function') {
      this.value = valueOrMethod;
      this.type = Fact.CONSTANT;
    } else {
      this.calculationMethod = valueOrMethod;
      this.type = Fact.DYNAMIC;
    }

    if (!this.id) {
      throw new Error('factId required');
    }

    if (typeof this.value === 'undefined' && typeof this.calculationMethod === 'undefined') {
      throw new Error('facts must have a value or method');
    }

    this.priority = parseInt(String(optionsScoped.priority) || String(1), 10);
    this.options = Object.assign({}, defaultOptions, optionsScoped);
    this.cacheKeyMethod = Fact.defaultCacheKeys;

    return this;
  }

  /**
   * Return a cache key (MD5 string) based on parameters
   * @param  {object} obj - properties to generate a hash key from
   * @return {string} MD5 string based on the hash'd object
   */
  static hashFromObject(obj: any): string {
    verbose(`fact::hashFromObject generating cache key from:`, obj);
    return hash(obj);
  }

  /**
   * Default properties to use when caching a fact
   * Assumes every fact is a pure function, whose computed value will only
   * change when input params are modified
   * @param  {string} id - fact unique identifer
   * @param  {object} params - parameters passed to fact calcution method
   * @return {object} id + params
   */
  static defaultCacheKeys(id: string, params: any): { params: any; id: string } {
    return { params, id };
  }

  isConstant() {
    return this.type === Fact.CONSTANT;
  }

  isDynamic() {
    return this.type === Fact.DYNAMIC;
  }

  /**
   * Return the fact value, based on provided parameters
   * @param  {object} params
   * @param  {Almanac} almanac
   * @return {any} calculation method results
   */
  calculate(params?: any, almanac?: Almanac): any {
    // if constant fact w/set value, return immediately
    if (this.hasOwnProperty('value')) {
      return this.value;
    }

    if (this.calculationMethod) {
      return this.calculationMethod(params, almanac);
    }
  }

  /**
   * Generates the fact's cache key(MD5 string)
   * Returns nothing if the fact's caching has been disabled
   * @param  {object} params - parameters that would be passed to the computation method
   * @return {string} cache key
   */
  getCacheKey(params: any): string | undefined {
    if (this.options.cache === true) {
      let cacheProperties = this.cacheKeyMethod(this.id, params);
      return Fact.hashFromObject(cacheProperties);
    }
    return undefined;
  }
}
