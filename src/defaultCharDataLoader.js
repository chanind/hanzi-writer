// corresponds to the integer in the gh-pages branch under the cdn folder
// make sure to check out a new version of the master branch in gh-pages when changing the data format
// otherwise this may break any existing hanzi-writer deploys in the wild
const DATA_VERSION = 1;
const getCharDataUrl = (char) => `http://chanind.github.io/hanzi-writer/cdn/${DATA_VERSION}/data/${char}.json`;

export default function(char, onLoad) {
  // load char data from hanziwriter.org cdn (currently hosted on github pages)
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', getCharDataUrl(char), true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      onLoad(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}
