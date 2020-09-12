const Mutation = require('../Mutation');


// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Mutation', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('resolves immediately if there is no (or 0) duration passed', async () => {
    const renderState = {
      state: {},
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      updateState: jest.fn(),
    };

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const mut = new Mutation('a.b', {c: 7});
    let isResolved = false;

    mut.run(renderState).then(() => {
      isResolved = true;
    });

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).toHaveBeenCalledTimes(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).toHaveBeenCalledWith({ a: { b: { c: 7 } } });

    await Promise.resolve();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(true);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('resolves immediately if there are no changes with the current state', async () => {
    const renderState = {
      state: {a: {b: 7 } },
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      updateState: jest.fn(),
    };

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const mut = new Mutation('a.b', 7, { duration: 20 });
    let isResolved = false;

    mut.run(renderState).then(() => {
      isResolved = true;
    });

    await Promise.resolve();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(true);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).not.toHaveBeenCalled();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('tweens to the target state over duration', async () => {
    const renderState = {
      state: {a: {b: 10 } },
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      updateState: jest.fn(),
    };

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const mut = new Mutation('a.b', 20, { duration: 50 });
    let isResolved = false;

    mut.run(renderState).then(() => {
      isResolved = true;
    });

    await Promise.resolve();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).not.toHaveBeenCalled();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(45);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).toHaveBeenCalled();
    renderState.updateState.mock.calls.forEach((mockCall: any) => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(mockCall[0].a.b).toBeGreaterThan(10);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(mockCall[0].a.b).toBeLessThan(20);
    });

    await Promise.resolve();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(25);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).toHaveBeenLastCalledWith({ a: { b: 20 } });

    await Promise.resolve();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(true);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('can pause and resume during the tween', async () => {
    const renderState = {
      state: {a: {b: 10 } },
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      updateState: jest.fn(),
    };

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const mut = new Mutation('a.b', 20, { duration: 50 });
    let isResolved = false;

    mut.run(renderState).then(() => {
      isResolved = true;
    });

    await Promise.resolve();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).not.toHaveBeenCalled();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(45);
    const partialTweenVals = renderState.updateState.mock.calls.map((call: any) => call[0].a.b);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).toHaveBeenCalled();
    renderState.updateState.mock.calls.forEach((mockCall: any) => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(mockCall[0].a.b).toBeGreaterThan(10);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(mockCall[0].a.b).toBeLessThan(20);
    });

    mut.pause();
    await Promise.resolve();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(1000);
    await Promise.resolve();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(partialTweenVals.length).toBe(renderState.updateState.mock.calls.length);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).toHaveBeenCalled();
    renderState.updateState.mock.calls.forEach((mockCall: any) => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(mockCall[0].a.b).toBeGreaterThan(10);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(mockCall[0].a.b).toBeLessThan(20);
    });

    mut.resume();
    await Promise.resolve();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(25);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).toHaveBeenLastCalledWith({ a: { b: 20 } });

    await Promise.resolve();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(true);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('updates state on cancel if force: true', async () => {
    const renderState = {
      state: {a: {b: 7 } },
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      updateState: jest.fn(),
    };

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const mut = new Mutation('a.b', 10, { force: true });

    mut.cancel(renderState);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).toHaveBeenCalledTimes(1);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).toHaveBeenLastCalledWith({ a: { b: 10 } });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('does not update state on cancel if force: false', async () => {
    const renderState = {
      state: {a: {b: 7 } },
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      updateState: jest.fn(),
    };

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const mut = new Mutation('a.b', 10);

    mut.cancel(renderState);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(renderState.updateState).not.toHaveBeenCalled();
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Mutation.Delay', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('can pause and resume during the delay', async () => {

    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    const delay = new Mutation.Delay(1000);
    let isResolved = false;

    delay.run().then(() => {
      isResolved = true;
    });

    await Promise.resolve();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(200);
    await Promise.resolve();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);

    delay.pause();
    await Promise.resolve();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(2000);
    await Promise.resolve();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);

    delay.resume();
    await Promise.resolve();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(500);
    await Promise.resolve();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(false);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'clock'.
    clock.tick(500);
    await Promise.resolve();

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(isResolved).toBe(true);
  });
});
