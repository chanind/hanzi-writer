const Mutation = require('../Mutation');


describe('Mutation', () => {
  it('resolves immediately if there is no (or 0) duration passed', async () => {
    const renderState = {
      state: {},
      updateState: jest.fn(),
    };

    const mut = new Mutation('a.b', {c: 7});
    let isResolved = false;

    mut.run(renderState).then(() => {
      isResolved = true;
    });

    expect(renderState.updateState).toHaveBeenCalledTimes(1);
    expect(renderState.updateState).toHaveBeenCalledWith({ a: { b: { c: 7 } } });

    await Promise.resolve();
    expect(isResolved).toBe(true);
  });

  it('resolves immediately if there are no changes with the current state', async () => {
    const renderState = {
      state: {a: {b: 7 } },
      updateState: jest.fn(),
    };

    const mut = new Mutation('a.b', 7, { duration: 20 });
    let isResolved = false;

    mut.run(renderState).then(() => {
      isResolved = true;
    });

    await Promise.resolve();
    expect(isResolved).toBe(true);
    expect(renderState.updateState).not.toHaveBeenCalled();
  });

  it('tweens to the target state over duration', async () => {
    const renderState = {
      state: {a: {b: 10 } },
      updateState: jest.fn(),
    };

    const mut = new Mutation('a.b', 20, { duration: 50 });
    let isResolved = false;

    mut.run(renderState).then(() => {
      isResolved = true;
    });

    await Promise.resolve();
    expect(isResolved).toBe(false);
    expect(renderState.updateState).not.toHaveBeenCalled();

    clock.tick(45);

    expect(isResolved).toBe(false);
    expect(renderState.updateState).toHaveBeenCalled();
    renderState.updateState.mock.calls.forEach(mockCall => {
      expect(mockCall[0].a.b).toBeGreaterThan(10);
      expect(mockCall[0].a.b).toBeLessThan(20);
    });

    await Promise.resolve();
    expect(isResolved).toBe(false);

    clock.tick(25);
    expect(renderState.updateState).toHaveBeenLastCalledWith({ a: { b: 20 } });

    await Promise.resolve();
    expect(isResolved).toBe(true);
  });

  it('updates state on cancel if force: true', async () => {
    const renderState = {
      state: {a: {b: 7 } },
      updateState: jest.fn(),
    };

    const mut = new Mutation('a.b', 10, { force: true });

    mut.cancel(renderState);
    expect(renderState.updateState).toHaveBeenCalledTimes(1);
    expect(renderState.updateState).toHaveBeenLastCalledWith({ a: { b: 10 } });
  });

  it('does not update state on cancel if force: false', async () => {
    const renderState = {
      state: {a: {b: 7 } },
      updateState: jest.fn(),
    };

    const mut = new Mutation('a.b', 10);

    mut.cancel(renderState);
    expect(renderState.updateState).not.toHaveBeenCalled();
  });
});
