export function conditionFactory (options: {
    fact?: any,
    value?: any,
    operator?: string,
}) {
    return {
        fact: options.fact || null,
        value: options.value || null,
        operator: options.operator || 'equal',
    }
}
