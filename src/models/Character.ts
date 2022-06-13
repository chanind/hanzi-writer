import Stroke from './Stroke';
import type { CharacterJson } from '../typings/types';
import { getPathCommands, getPathCommandParams } from '../utils';

export default class Character {
  symbol: string;
  strokes: Stroke[];

  /** Parses a given object and creates a new Character */
  static fromObject(
    symbol: string,
    charJson: CharacterJson,
    /** Function that transforms the character's data before generating strokes & creating the character */
    processCharacter:
      | ((charData: CharacterJson) => CharacterJson)
      | null = defaultProcessCharData,
  ) {
    const newCharJson = processCharacter?.(charJson) || charJson;
    const strokes = generateStrokes(newCharJson);
    return new Character(symbol, strokes);
  }

  constructor(symbol: string, strokes: Stroke[]) {
    this.symbol = symbol;
    this.strokes = strokes;
  }
}

const generateStrokes = ({ radStrokes, strokes, medians }: CharacterJson) => {
  const isInRadical = (strokeNum: number) => (radStrokes?.indexOf(strokeNum) ?? -1) >= 0;
  return strokes.map((path, index) => {
    const points = medians[index].map((pointData) => {
      const [x, y] = pointData;
      return { x, y };
    });
    return new Stroke(path, points, index, isInRadical(index));
  });
};

/** Inverts the Y axis. This is for backwards compatibility with "hanzi-writer-data@v2" */
const defaultProcessCharData = (charData: CharacterJson): CharacterJson => {
  const newStrokes = charData.strokes.map((stroke) => {
    const newStroke = getPathCommands(stroke).reduce((acc, command) => {
      const { cmd, values } = getPathCommandParams(command);
      if (cmd === 'M' || cmd === 'L') {
        const [x, y] = values;
        return acc + `${cmd} ${x} ${900 - y} `;
      }
      if (cmd === 'Q') {
        const [x1, y1, x2, y2] = values;
        return acc + `${cmd} ${x1} ${900 - y1} ${x2} ${900 - y2} `;
      }
      if (cmd === 'C') {
        const [x1, y1, x2, y2, x, y] = values;
        return acc + `${cmd} ${x1} ${900 - y1} ${x2} ${900 - y2} ${x} ${900 - y} `;
      }
      if (cmd === 'Z') {
        return acc + 'Z';
      }
      return acc + `${cmd} ${values.join(' ')}`;
    }, '');

    return newStroke;
  });

  return {
    ...charData,
    strokes: newStrokes,
    medians: charData.medians.map((median) => {
      return median.map(([x, y]) => [x, 900 - y]);
    }),
  };
};
