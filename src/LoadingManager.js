const { callIfExists } = require('./utils');


function LoadingManager(options) {
  this._loadCounter = 0;
  this._options = options;
  this._isLoading = false;
  this._loadingPromise = null;

  // use this to attribute to determine if there was a problem with loading
  this.loadingFailed = false;
}

LoadingManager.prototype._debouncedLoad = function(char, count) {
  // these wrappers ignore all responses except the most recent.
  const wrappedResolve = (data) => {
    if (count === this._loadCounter) this._resolve(data);
  };
  const wrappedReject = (reason) => {
    if (count === this._loadCounter) this._reject(reason);
  };

  const returnedData = this._options.charDataLoader(char, wrappedResolve, wrappedReject);
  if (returnedData) wrappedResolve(returnedData);
};

LoadingManager.prototype._setupLoadingPromise = function() {
  this._loadingPromise = new Promise((resolve, reject) => {
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
      err.reason = reason;
      throw err;
    }
  });
};

LoadingManager.prototype.loadCharData = function(char) {
  this._loadingChar = char;
  if (!this._isLoading) {
    this._setupLoadingPromise();
  }
  this.loadingFailed = false;
  this._isLoading = true;
  this._loadCounter += 1;
  this._debouncedLoad(char, this._loadCounter);
  return this._loadingPromise;
};

module.exports = LoadingManager;
