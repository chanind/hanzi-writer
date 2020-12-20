import ren from 'hanzi-writer-data/人.json';
import ta from 'hanzi-writer-data/他.json';
import LoadingManager from '../LoadingManager';

describe('LoadingManager', () => {
  describe('loadCharData', () => {
    it('resolves when data is loaded via async callback', async () => {
      const manager = new LoadingManager({
        charDataLoader: (_char, onComplete) => {
          setTimeout(() => onComplete(ren), 1);
        },
      });
      const data = await manager.loadCharData('人');
      expect(data).toBe(ren);
      expect(manager.loadingFailed).toBe(false);
    });

    it('resolves when data is loaded via sync callback', async () => {
      const manager = new LoadingManager({
        charDataLoader: (_char, onComplete) => {
          onComplete(ren);
        },
      });
      const data = await manager.loadCharData('人');
      expect(data).toBe(ren);
      expect(manager.loadingFailed).toBe(false);
    });

    it('resolves when data is loaded via promise', async () => {
      const manager = new LoadingManager({
        charDataLoader: () => Promise.resolve(ren),
      });
      const data = await manager.loadCharData('人');
      expect(data).toBe(ren);
      expect(manager.loadingFailed).toBe(false);
    });

    it('resolves when data is loaded via sync return', async () => {
      const manager = new LoadingManager({
        charDataLoader: () => ren,
      });
      const data = await manager.loadCharData('人');
      expect(data).toBe(ren);
      expect(manager.loadingFailed).toBe(false);
    });

    it('passes data to onLoadCharDataSuccess if provided', async () => {
      let successVal;
      const manager = new LoadingManager({
        charDataLoader: () => ren,
        onLoadCharDataSuccess: (returnedData) => {
          successVal = returnedData;
        },
      });
      const data = await manager.loadCharData('人');
      expect(data).toBe(ren);
      expect(successVal).toBe(ren);
      expect(manager.loadingFailed).toBe(false);
    });

    it('throws an error if loading fails via onErr callback and no callback is provided', async () => {
      const manager = new LoadingManager({
        charDataLoader: (char, onComplete, onErr) => {
          onErr('OMG');
        },
      });
      await expect(manager.loadCharData('人')).rejects.toThrow(
        new Error('Failed to load char data for 人'),
      );
      expect(manager.loadingFailed).toBe(true);
    });

    it('rethrows if loading fails via onErr callback passing an Error and no callback is provided', async () => {
      const manager = new LoadingManager({
        charDataLoader: (char, onComplete, onErr) => {
          onErr(new Error('OMG'));
        },
      });
      await expect(manager.loadCharData('人')).rejects.toThrow(new Error('OMG'));
      expect(manager.loadingFailed).toBe(true);
    });

    it('resolves if loading fails via onErr callback and a callback is provided', async () => {
      let failureReason;
      const manager = new LoadingManager({
        charDataLoader: (char, onComplete, onErr) => {
          onErr('everything is terrible');
        },
        onLoadCharDataError: (reason) => {
          failureReason = reason;
        },
      });
      const data = await manager.loadCharData('人');
      expect(manager.loadingFailed).toBe(true);
      expect(data).toBe(undefined);
      expect(failureReason).toBe('everything is terrible');
    });

    it('debounces if multiple loads are called at the same time', async () => {
      const onLoadCharDataSuccess = jest.fn();
      const onCompleteFns: Array<(arg: any) => void> = [];
      const manager = new LoadingManager({
        onLoadCharDataSuccess,
        charDataLoader: (char, onComplete) => {
          onCompleteFns.push(onComplete);
        },
      });

      const loadPromise1 = manager.loadCharData('人');
      const loadPromise2 = manager.loadCharData('他');
      expect(loadPromise1).not.toBe(loadPromise2);

      let hasPromise1Resolved = false;
      loadPromise1.then(() => {
        hasPromise1Resolved = true;
      });

      onCompleteFns[0].call(null, ren);
      onCompleteFns[1].call(null, ta);

      const data = await loadPromise2;

      // ren should not resolve, since we requested something else before it finished loading
      expect(hasPromise1Resolved).toBe(false);

      expect(data).toBe(ta);
      expect(onLoadCharDataSuccess.mock.calls.length).toBe(1);
      expect(onLoadCharDataSuccess.mock.calls[0][0]).toBe(ta);
      expect(manager.loadingFailed).toBe(false);
    });
  });
});
