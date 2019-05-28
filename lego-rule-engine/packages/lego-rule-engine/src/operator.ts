export type FactValueValidator = (factValue: any) => boolean;

export interface CustomOperator {
  cb: (factValue: any, jsonvalue: any) => void;
  name: string;
  factValueValidator: FactValueValidator;

  /**
   * Takes the fact result and compares it to the condition 'value', using the callback
   * @param   {mixed} factValue - fact result
   * @param   {mixed} jsonValue - "value" property of the condition
   * @returns {Boolean} - whether the values pass the operator test
   */
  evaluate(factValue: any, jsonValue: any): boolean;
}

export class Operator implements CustomOperator {
  cb: (factValue: any, jsonvalue: any) => boolean;
  name: string;
  factValueValidator: FactValueValidator;

  /**
   * Constructor
   * @param {string}   name - operator identifier
   * @param {function(factValue, jsonValue)} cb - operator evaluation method
   * @param {function}  [factValueValidator] - optional validator for asserting the data type of the fact
   * @returns {Operator} - instance
   */
  constructor(
    name: string,
    cb: (factValue: any, jsonvalue: any) => boolean,
    factValueValidator?: FactValueValidator
  ) {
    this.name = String(name);
    if (!name) throw new Error('Missing operator name');
    if (typeof cb !== 'function') throw new Error('Missing operator callback');
    this.cb = cb;

    if (!factValueValidator) {
      this.factValueValidator = () => true;
    } else {
      this.factValueValidator = factValueValidator;
    }
  }

  /**
   * Takes the fact result and compares it to the condition 'value', using the callback
   * @param   {mixed} factValue - fact result
   * @param   {mixed} jsonValue - "value" property of the condition
   * @returns {Boolean} - whether the values pass the operator test
   */
  evaluate(factValue: any, jsonValue: any): boolean {
    return this.factValueValidator(factValue) && this.cb(factValue, jsonValue);
  }
}
