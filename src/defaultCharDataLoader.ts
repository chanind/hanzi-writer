import { CharacterJson } from "./typings/types";

const VERSION = "2.0";

const getCharDataUrl = (char: string) =>
  `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${VERSION}/${char}.json`;

export default function defaultCharDataLoader(
  char: string,
  onLoad: (parsedJson: CharacterJson) => void,
  onError: (error?: Error | string) => void,
) {
  // load char data from hanziwriter cdn (currently hosted on jsdelivr)
  fetch(getCharDataUrl(char))
    .then((response) => {
      if (!response.ok) {
        return Promise.reject();
      }
      return response.json();
    })
    .then(onLoad)
    .catch(onError);
}
