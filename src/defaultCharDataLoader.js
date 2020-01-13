const VERSION = '2.0';
const getCharDataUrl = (char) => `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${VERSION}/${char}.json`;

module.exports = (char, onLoad, onError) => {
  // load char data from hanziwriter cdn (currently hosted on jsdelivr)
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
