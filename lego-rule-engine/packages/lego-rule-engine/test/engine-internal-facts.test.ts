import { SuccessEventFact } from '../src/engine-facts';

describe('SuccessEventFact', () => {
  test('stores events', () => {
    let subject = SuccessEventFact();
    subject({ event: 1 } as any);
    subject({ event: 2 } as any);
    subject({ event: 3 } as any);
    expect(subject()).toContain(1);
    expect(subject()).toContain(2);
    expect(subject()).toContain(3);
  });

  test('stores events independently of other instances', () => {
    let subject = SuccessEventFact();
    let subject2 = SuccessEventFact();
    subject({ event: 1 } as any);
    subject2({ event: 2 as any } as any);
    subject2({ event: 3 } as any);
    expect(subject()).toContain(1);
    expect(subject().length).toBe(1);
    expect(subject2()).toContain(2);
    expect(subject2()).toContain(3);
    expect(subject2().length).toBe(2);
  });
});
