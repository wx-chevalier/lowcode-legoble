import { FactOptions, Fact } from '../src/fact';

describe('Fact', () => {
  function subject(id?: string, definition?: any, options?: FactOptions) {
    return new Fact(id as string, definition, options);
  }
  describe('Fact::constructor', () => {
    test('works for constant facts', () => {
      let fact = subject('factId', 10);
      expect(fact.id).toBe('factId');
      expect(fact.value).toBe(10);
    });

    test('works for dynamic facts', () => {
      let fact = subject('factId', () => 10);
      expect(fact.id).toBe('factId');
      expect(fact.calculate()).toBe(10);
    });

    test('allows options to be passed', () => {
      let opts = { test: true, cache: false };
      let fact = subject('factId', 10, opts);
      expect(fact.options).toEqual(opts);
    });

    describe('validations', () => {
      test('throws if no id provided', () => {
        expect(subject).toThrowError(/factId required/);
      });

      test('throws if no definition provided', () => {
        expect(subject.bind(null, 'factId')).toThrowError(/facts must have a value or method/);
      });
    });
  });

  describe('Fact::types', () => {
    test('initializes facts with method values as dynamic', () => {
      let fact = subject('factId', () => {
        /**/
      });
      expect(fact.type).toBe(Fact.DYNAMIC);
      expect(fact.isDynamic()).toBe(true);
    });

    test('initializes facts with non-methods as constant', () => {
      let fact = subject('factId', 2);
      expect(fact.type).toBe(Fact.CONSTANT);
      expect(fact.isConstant()).toBe(true);
    });
  });
});
