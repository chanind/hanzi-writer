import { HanziWriterOptions, CharacterJson } from "./typings/types";

const VERSION = "2.0";

const getCharDataUrl = (char: string) =>
  `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${VERSION}/${char}.json`;

export function defaultCharDataLoader(
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

const defaultOptions: HanziWriterOptions = {
  charDataLoader: defaultCharDataLoader,
  onLoadCharDataError: null,
  onLoadCharDataSuccess: null,
  showOutline: true,
  showCharacter: true,
  renderer: "svg",

  // positioning options

  width: null,
  height: null,
  padding: 20,

  // animation options

  strokeAnimationSpeed: 1,
  strokeFadeDuration: 400,
  strokeHighlightDuration: 200,
  strokeHighlightSpeed: 2,
  delayBetweenStrokes: 1000,
  delayBetweenLoops: 2000,

  // colors

  strokeColor: "#555",
  radicalColor: null,
  highlightColor: "#AAF",
  outlineColor: "#DDD",
  drawingColor: "#333",

  // quiz options

  leniency: 1,
  showHintAfterMisses: 3,
  highlightOnComplete: true,
  highlightCompleteColor: null,

  // undocumented obscure options

  drawingFadeDuration: 300,
  drawingWidth: 4,
  strokeWidth: 2,
  outlineWidth: 2,
  rendererOverride: {},
};

export default defaultOptions;
