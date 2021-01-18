import { CharacterJson, LoadingManagerOptions } from './typings/types';

type CustomError = Error & { reason: string };

export default class LoadingManager {
  _loadCounter = 0;
  _isLoading = false;
  _resolve: ((data: CharacterJson) => void) | undefined;
  _reject: ((error?: Error | CustomError | string) => void) | undefined;
  _options: LoadingManagerOptions;

  /** Set when calling LoadingManager.loadCharData  */
  _loadingChar: string | undefined;
  /** use this to attribute to determine if there was a problem with loading */
  loadingFailed = false;

  constructor(options: LoadingManagerOptions) {
    this._options = options;
  }

  _debouncedLoad(char: string, count: number) {
    // these wrappers ignore all responses except the most recent.
    const wrappedResolve = (data: CharacterJson) => {
      if (count === this._loadCounter) {
        this._resolve?.(data);
      }
    };
    const wrappedReject = (reason?: Error | string) => {
      if (count === this._loadCounter) {
        this._reject?.(reason);
      }
    };

    const returnedData = this._options.charDataLoader(
      char,
      wrappedResolve,
      wrappedReject,
    );

    if (returnedData) {
      if ('then' in returnedData) {
        returnedData.then(wrappedResolve).catch(wrappedReject);
      } else {
        wrappedResolve(returnedData);
      }
    }
  }

  _setupLoadingPromise() {
    return new Promise(
      (
        resolve: (data: CharacterJson) => void,
        reject: (err?: Error | CustomError | string) => void,
      ) => {
        this._resolve = resolve;
        this._reject = reject;
      },
    )
      .then((data: CharacterJson) => {
        this._isLoading = false;
        this._options.onLoadCharDataSuccess?.(data);
        return data;
      })
      .catch((reason) => {
        this._isLoading = false;
        this.loadingFailed = true;

        // If the user has provided an "onLoadCharDataError", call this function
        // Otherwise, throw the promise
        if (this._options.onLoadCharDataError) {
          this._options.onLoadCharDataError(reason);
          return;
        }

        // If error callback wasn't provided, throw an error so the developer will be aware something went wrong
        if (reason instanceof Error) {
          throw reason;
        }

        const err = new Error(
          `Failed to load char data for ${this._loadingChar}`,
        ) as CustomError;

        err.reason = reason;

        throw err;
      });
  }

  loadCharData(char: string) {
    this._loadingChar = char;
    const promise = this._setupLoadingPromise();
    this.loadingFailed = false;
    this._isLoading = true;
    this._loadCounter++;
    this._debouncedLoad(char, this._loadCounter);
    return promise;
  }
}
