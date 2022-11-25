import ta from 'hanzi-writer-data/他.json';
import { CharacterJson } from 'typings/types';
import Character from '../models/Character';

describe('Character', () => {
  describe('fromObject', () => {
    it("does not transform stroke paths if 'null' is provided in the 'processCharacter' param", () => {
      const character = Character.fromObject('他', ta, null);
      for (let i = 0; i < ta.strokes.length; i++) {
        expect(character.strokes[i].path).toEqual(ta.strokes[i]);
      }
    });
    it('correctly parses a given object', () => {
      const res = Character.fromObject('他', ta);
      expect(res.strokes).toHaveLength(5);
      expect(res.strokes[0].isInRadical).toBe(true);
      expect(res.strokes[1].isInRadical).toBe(true);
      expect(res.strokes[2].isInRadical).toBe(false);
      expect(res.strokes[3].isInRadical).toBe(false);
      expect(res.strokes[4].isInRadical).toBe(false);
    });
    it("applies 'scaleX(-1)' transform to path strings by default", () => {
      const strokeTransforms = [
        {
          before: 'L 400 500 C 100 200 100 300 100 400 Q 100 200 100 300 Z',
          after: `L 400 400 C 100 700 100 600 100 500 Q 100 700 100 600 Z`,
        },
        {
          before: 'L 1 150 M 1 250 C 1 350 3 450 5 650 Q 1 750 3 850 Z',
          after: 'L 1 750 M 1 650 C 1 550 3 450 5 250 Q 1 150 3 50 Z',
        },
        // Verify paths with commas also get correctly scaled
        {
          before: 'L 1,150 M 1,250 C 1,350,3,450,5,650 Q 1,750,3,850 Z',
          after: 'L 1 750 M 1 650 C 1 550 3 450 5 250 Q 1 150 3 50 Z',
        },
      ];

      const basicCharJson: CharacterJson = {
        strokes: strokeTransforms.map((transform) => transform.before),
        medians: [[], [], []],
        radStrokes: undefined,
      };

      const res = Character.fromObject('他', basicCharJson);

      for (let i = 0; i < strokeTransforms.length; i++) {
        expect(res.strokes[i].path).toEqual(strokeTransforms[i].after);
      }
    });
  });
});
