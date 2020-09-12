// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callIfExis... Remove this comment to see the full error message
const { callIfExists } = require('./utils');


// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LoadingMan... Remove this comment to see the full error message
function LoadingManager(options: any) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._loadCounter = 0;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._options = options;
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this._isLoading = false;

  // use this to attribute to determine if there was a problem with loading
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.loadingFailed = false;
}

LoadingManager.prototype._debouncedLoad = function(char: any, count: any) {
  // these wrappers ignore all responses except the most recent.
  const wrappedResolve = (data: any) => {
    if (count === this._loadCounter) this._resolve(data);
  };
  const wrappedReject = (reason: any) => {
    if (count === this._loadCounter) this._reject(reason);
  };

  const returnedData = this._options.charDataLoader(char, wrappedResolve, wrappedReject);
  if (returnedData) wrappedResolve(returnedData);
};

LoadingManager.prototype._setupLoadingPromise = function() {
  return new Promise((resolve, reject) => {
    this._resolve = resolve;
    this._reject = reject;
  }).then((data) => {
    this._isLoading = false;
    callIfExists(this._options.onLoadCharDataSuccess, data);
    return data;
  }, (reason) => {
    this._isLoading = false;
    this.loadingFailed = true;
    callIfExists(this._options.onLoadCharDataError, reason);
    // If error callback wasn't provided, throw an error so the developer will be aware something went wrong
    if (!this._options.onLoadCharDataError) {
      if (reason instanceof Error) throw reason;
      const err = new Error(`Failed to load char data for ${this._loadingChar}`);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'reason' does not exist on type 'Error'.
      err.reason = reason;
      throw err;
    }
  });
};

LoadingManager.prototype.loadCharData = function(char: any) {
  this._loadingChar = char;
  const promise = this._setupLoadingPromise();
  this.loadingFailed = false;
  this._isLoading = true;
  this._loadCounter++;
  this._debouncedLoad(char, this._loadCounter);
  return promise;
};

module.exports = LoadingManager;
