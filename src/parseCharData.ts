import Stroke from "./models/Stroke";
import Character from "./models/Character";
import { CharacterJson } from "./typings/types";

function generateStrokes(charJson: CharacterJson) {
  const isInRadical = (strokeNum: number) =>
    (charJson.radStrokes?.indexOf(strokeNum) ?? -1) >= 0;

  return charJson.strokes.map((path, index) => {
    const points = charJson.medians[index].map((pointData) => {
      const [x, y] = pointData;
      return { x, y };
    });
    return new Stroke(path, points, index, isInRadical(index));
  });
}

export default function parseCharData(symbol: string, charJson: CharacterJson) {
  const strokes = generateStrokes(charJson);
  return new Character(symbol, strokes);
}
