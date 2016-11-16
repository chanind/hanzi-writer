// corresponds to the integer in the gh-pages branch under the cdn folder
// make sure to check out a new version of the master branch in gh-pages when changing the data format
// otherwise this may break any existing hanzi-writer deploys in the wild
const DATA_VERSION = 2;
const getCharDataUrl = (char) => `http://chanind.github.io/hanzi-writer/cdn/${DATA_VERSION}/data/${char}.json`;

export default function(char, onLoad) {
  // load char data from hanziwriter.org cdn (currently hosted on github pages)
  const xhr = new XMLHttpRequest();
  if (xhr.overrideMimeType) { // IE 9 and 10 don't seem to support this...
    xhr.overrideMimeType('application/json');
  }
  xhr.open('GET', getCharDataUrl(char), true);
  xhr.onreadystatechange = () => {
    // TODO: error handling
    if (xhr.readyState === 4 && xhr.status === 200) {
      onLoad(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}
