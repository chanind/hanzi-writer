// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ren'.
const ren = require('hanzi-writer-data/人.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ta'.
const ta = require('hanzi-writer-data/他.json');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LoadingMan... Remove this comment to see the full error message
const LoadingManager = require('../LoadingManager');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('LoadingManager', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('loadCharData', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resolves when data is loaded via async callback', async () => {
      const manager = new LoadingManager({
        charDataLoader: (char: any, onComplete: any, onErr: any) => {
          setTimeout(() => onComplete(ren), 1);
        },
      });
      const data = await manager.loadCharData('人');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data).toBe(ren);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(manager.loadingFailed).toBe(false);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resolves when data is loaded via sync callback', async () => {
      const manager = new LoadingManager({
        charDataLoader: (char: any, onComplete: any, onErr: any) => { onComplete(ren); },
      });
      const data = await manager.loadCharData('人');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data).toBe(ren);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(manager.loadingFailed).toBe(false);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resolves when data is loaded via promise', async () => {
      const manager = new LoadingManager({
        charDataLoader: (char: any, onComplete: any, onErr: any) => Promise.resolve(ren),
      });
      const data = await manager.loadCharData('人');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data).toBe(ren);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(manager.loadingFailed).toBe(false);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resolves when data is loaded via sync return', async () => {
      const manager = new LoadingManager({
        charDataLoader: (char: any, onComplete: any, onErr: any) => ren,
      });
      const data = await manager.loadCharData('人');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data).toBe(ren);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(manager.loadingFailed).toBe(false);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('passes data to onLoadCharDataSuccess if provided', async () => {
      let successVal;
      const manager = new LoadingManager({
        charDataLoader: (char: any, onComplete: any, onErr: any) => ren,
        onLoadCharDataSuccess: (returnedData: any) => { successVal = returnedData; },
      });
      const data = await manager.loadCharData('人');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data).toBe(ren);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(successVal).toBe(ren);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(manager.loadingFailed).toBe(false);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('throws an error if loading fails via onErr callback and no callback is provided', async () => {
      const manager = new LoadingManager({
        charDataLoader: (char: any, onComplete: any, onErr: any) => { onErr('OMG'); },
      });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(manager.loadCharData('人')).rejects.toThrow(new Error('Failed to load char data for 人'));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(manager.loadingFailed).toBe(true);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('rethrows if loading fails via onErr callback passing an Error and no callback is provided', async () => {
      const manager = new LoadingManager({
        charDataLoader: (char: any, onComplete: any, onErr: any) => { onErr(new Error('OMG')); },
      });
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      await expect(manager.loadCharData('人')).rejects.toThrow(new Error('OMG'));
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(manager.loadingFailed).toBe(true);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('resolves if loading fails via onErr callback and a callback is provided', async () => {
      let failureReason;
      const manager = new LoadingManager({
        charDataLoader: (char: any, onComplete: any, onErr: any) => { onErr('everything is terrible'); },
        onLoadCharDataError: (reason: any) => { failureReason = reason; },
      });
      const data = await manager.loadCharData('人');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(manager.loadingFailed).toBe(true);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data).toBe(undefined);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(failureReason).toBe('everything is terrible');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('debounces if multiple loads are called at the same time', async () => {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'jest'.
      const onLoadCharDataSuccess = jest.fn();
      const onCompleteFns: any = [];
      const manager = new LoadingManager({
        onLoadCharDataSuccess,
        charDataLoader: (char: any, onComplete: any) => {
          onCompleteFns.push(onComplete);
        },
      });

      const loadPromise1 = manager.loadCharData('人');
      const loadPromise2 = manager.loadCharData('他');
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(loadPromise1).not.toBe(loadPromise2);

      let hasPromise1Resolved = false;
      loadPromise1.then(() => {
        hasPromise1Resolved = true;
      });

      onCompleteFns[0].call(null, ren);
      onCompleteFns[1].call(null, ta);

      const data = await loadPromise2;

      // ren should not resolve, since we requested something else before it finished loading
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(hasPromise1Resolved).toBe(false);

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(data).toBe(ta);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataSuccess.mock.calls.length).toBe(1);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(onLoadCharDataSuccess.mock.calls[0][0]).toBe(ta);
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
      expect(manager.loadingFailed).toBe(false);
    });
  });
});
