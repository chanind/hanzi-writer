// corresponds to the integer in the gh-pages branch under the cdn folder
// make sure to check out a new version of the master branch in gh-pages when changing the data format
// otherwise this may break any existing hanzi-writer deploys in the wild
const VERSION = '2.0';
const getCharDataUrl = (char) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${VERSION}/${char}.json`;

module.exports = (char, onLoad, onError) => {
  // load char data from hanziwriter.org cdn (currently hosted on github pages)
  const xhr = new global.XMLHttpRequest();
  if (xhr.overrideMimeType) { // IE 9 and 10 don't seem to support this...
    xhr.overrideMimeType('application/json');
  }
  xhr.open('GET', getCharDataUrl(char), true);
  xhr.onerror = (event) => {
    onError(xhr, event);
  };
  xhr.onreadystatechange = () => {
    // TODO: error handling
    if (xhr.readyState !== 4) return;

    if (xhr.status === 200) {
      onLoad(JSON.parse(xhr.responseText));
    } else if (xhr.status !== 0 && onError) {
      onError(xhr);
    }
  };
  xhr.send(null);
};
