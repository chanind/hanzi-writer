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
  const wrappedReject = (...args) => {
    if (count === this._loadCounter) this._reject(...args);
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
  }, (...args) => {
    this._isLoading = false;
    this.loadingFailed = true;
    callIfExists(this._options.onLoadCharDataError, ...args);
  });
};

LoadingManager.prototype.loadCharData = function(char) {
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
