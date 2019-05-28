import { Fact } from '../src/fact';
import { Almanac } from '../src/almanac';

describe('Almanac', () => {
  let almanac: Almanac;
  let factSpy = jest.fn();

  describe('properties', () => {
    test('has methods for managing facts', () => {
      almanac = new (Almanac as any)();
      expect(almanac).toHaveProperty('factValue');
    });

    test('adds runtime facts', () => {
      almanac = new Almanac(new Map(), { modelId: 'XYZ' });
      expect(almanac.factMap.get('modelId')!.value).toBe('XYZ');
    });
  });

  describe('constructor', () => {
    test('supports runtime facts as key => values', async () => {
      almanac = new Almanac(new Map(), { fact1: 3 });
      expect(await almanac.factValue('fact1')).toBe(3);
    });

    test('supports runtime fact instances', async () => {
      let fact = new Fact('fact1', 3);
      almanac = new Almanac(new Map(), { fact1: fact });
      expect(await almanac.factValue('fact1')).toBe(fact.value);
    });
  });

  describe('arguments', () => {
    beforeEach(() => {
      let fact = new Fact('foo', async (params: any, facts: any) => {
        if (params.userId) return params.userId;
        return 'unknown';
      });
      let factMap = new Map();
      factMap.set(fact.id, fact);
      almanac = new Almanac(factMap);
    });

    test('allows parameters to be passed to the fact', async () => {
      expect(await almanac.factValue('foo')).toBe('unknown');
    });

    test('allows parameters to be passed to the fact', async () => {
      expect(await almanac.factValue('foo', { userId: 1 })).toBe(1);
    });

    test('throws an exception if it encounters an undefined fact', async () => {
      await expect(almanac.factValue('bar')).rejects.toThrow(/Undefined fact: bar/);
    });
  });

  describe('addRuntimeFact', () => {
    test('adds a key/value pair to the factMap as a fact instance', () => {
      almanac = new (Almanac as any)();
      almanac.addRuntimeFact('factId', 'factValue');
      expect(almanac.factMap.get('factId')!.value).toBe('factValue');
    });
  });

  describe('_addConstantFact', () => {
    test('adds fact instances to the factMap', () => {
      let fact = new Fact('factId', 'factValue');
      almanac = new (Almanac as any)();
      almanac._addConstantFact(fact);
      expect(almanac.factMap.get(fact.id)!.value).toBe(fact.value);
    });
  });

  describe('getFact', () => {
    test('retrieves the fact object', () => {
      let facts = new Map();
      let fact = new Fact('id', 1);
      facts.set(fact.id, fact);
      almanac = new Almanac(facts);
      expect(almanac.getFact('id')).toBe(fact);
    });
  });

  describe('_setFactValue()', () => {
    function expectFactResultsCache(expected: any) {
      let promise = almanac.factResultsCache.values().next().value;
      expect(promise).toBeInstanceOf(Promise);
      promise.then((value: any) => expect(value).toBe(expected));
      return promise;
    }

    function setup(f = new Fact('id', 1)) {
      fact = f;
      let facts = new Map();
      facts.set(fact.id, fact);
      almanac = new Almanac(facts);
    }

    let fact: any;
    const FACT_VALUE = 2;

    test('updates the fact results and returns a promise', done => {
      setup();
      almanac._setFactValue(fact, {}, FACT_VALUE);
      expectFactResultsCache(FACT_VALUE)
        .then((_: any) => done())
        .catch(done);
    });

    test('honors facts with caching disabled', done => {
      setup(new Fact('id', 1, { cache: false }));
      let promise = almanac._setFactValue(fact, {}, FACT_VALUE);
      expect(almanac.factResultsCache.values().next().value).toBeUndefined();
      promise
        .then(value => expect(value).toBe(FACT_VALUE))
        .then(_ => done())
        .catch(done);
    });
  });

  describe('factValue()', () => {
    function setup(factOptions: any) {
      factSpy = jest.fn();
      let fact = new Fact(
        'foo',
        async (params: any, facts: any) => {
          factSpy();
          return 'unknown';
        },
        factOptions
      );
      let factMap = new Map();
      factMap.set(fact.id, fact);
      almanac = new Almanac(factMap);
    }

    test('evaluates the fact every time when fact caching is off', () => {
      setup({ cache: false });
      almanac.factValue('foo');
      almanac.factValue('foo');
      almanac.factValue('foo');
      expect(factSpy).toHaveBeenCalledTimes(3);
    });

    test('evaluates the fact once when fact caching is on', () => {
      setup({ cache: true });
      almanac.factValue('foo');
      almanac.factValue('foo');
      almanac.factValue('foo');
      expect(factSpy).toHaveBeenCalledTimes(1);
    });
  });
});
