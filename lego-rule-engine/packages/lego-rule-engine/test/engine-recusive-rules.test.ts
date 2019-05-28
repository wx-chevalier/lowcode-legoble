import {engineFactory} from '../src'
import {ruleFactory} from './support/rule-factory'
import {Engine} from '../src/engine'

describe('Engine: recursive rules', () => {
    let engine: Engine
    let event = {type: 'middle-income-adult'}
    let nestedAnyCondition = {
        all: [
            {
                'fact': 'age',
                'operator': 'lessThan',
                'value': 65,
            },
            {
                'fact': 'age',
                'operator': 'greaterThan',
                'value': 21,
            },
            {
                any: [
                    {
                        'fact': 'income',
                        'operator': 'lessThanInclusive',
                        'value': 100,
                    },
                    {
                        'fact': 'family-size',
                        'operator': 'lessThanInclusive',
                        'value': 3,
                    },
                ],
            },
        ],
    }

    let eventSpy = jest.fn()

    function setup (conditions = nestedAnyCondition) {
        eventSpy = jest.fn()

        engine = engineFactory()
        let rule = ruleFactory({conditions, event})
        engine.addRule(rule)
        engine.on('success', eventSpy)
    }

    describe('"all" with nested "any"', () => {
        test('evaluates true when facts pass rules', async () => {
            setup()
            engine.addFact('age', 30)
            engine.addFact('income', 30)
            engine.addFact('family-size', 2)
            await engine.run()
            expect(eventSpy).toHaveBeenCalledTimes(1)
        })

        test('evaluates false when facts do not pass rules', async () => {
            setup()
            engine.addFact('age', 30)
            engine.addFact('income', 200)
            engine.addFact('family-size', 8)
            await engine.run()
            expect(eventSpy).not.toHaveBeenCalledTimes(1)
        })
    })

    let nestedAllCondition = {
        any: [
            {
                'fact': 'age',
                'operator': 'lessThan',
                'value': 65,
            },
            {
                'fact': 'age',
                'operator': 'equal',
                'value': 70,
            },
            {
                all: [
                    {
                        'fact': 'income',
                        'operator': 'lessThanInclusive',
                        'value': 100,
                    },
                    {
                        'fact': 'family-size',
                        'operator': 'lessThanInclusive',
                        'value': 3,
                    },
                ],
            },
        ],
    }

    describe('"any" with nested "all"', () => {
        test('evaluates true when facts pass rules', async () => {
            setup(nestedAllCondition as any)
            engine.addFact('age', 90)
            engine.addFact('income', 30)
            engine.addFact('family-size', 2)
            await engine.run()
            expect(eventSpy).toHaveBeenCalledTimes(1)
        })

        test('evaluates false when facts do not pass rules', async () => {
            setup(nestedAllCondition as any)
            engine.addFact('age', 90)
            engine.addFact('income', 200)
            engine.addFact('family-size', 2)
            await engine.run()
            expect(eventSpy).not.toHaveBeenCalledTimes(1)
        })
    })

    let thriceNestedCondition = {
        any: [
            {
                all: [
                    {
                        any: [
                            {
                                'fact': 'income',
                                'operator': 'lessThanInclusive',
                                'value': 100,
                            },
                        ],
                    },
                    {
                        'fact': 'family-size',
                        'operator': 'lessThanInclusive',
                        'value': 3,
                    },
                ],
            },
        ],
    }

    describe('"any" with "all" within "any"', () => {
        test('evaluates true when facts pass rules', async () => {
            setup(thriceNestedCondition as any)
            engine.addFact('income', 30)
            engine.addFact('family-size', 1)
            await engine.run()
            expect(eventSpy).toHaveBeenCalledTimes(1)
        })

        test('evaluates false when facts do not pass rules', async () => {
            setup(thriceNestedCondition as any)
            engine.addFact('income', 30)
            engine.addFact('family-size', 5)
            await engine.run()
            expect(eventSpy).not.toHaveBeenCalledTimes(1)
        })
    })
})
