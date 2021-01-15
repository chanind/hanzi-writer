import ta from 'hanzi-writer-data/他.json';
import parseCharData from '../parseCharData';

describe('parseCharData', () => {
  it('creates a Character object from character json', () => {
    const res = parseCharData('他', ta);
    expect(res.strokes).toHaveLength(5);
    expect(res.strokes[0].isInRadical).toBe(true);
    expect(res.strokes[1].isInRadical).toBe(true);
    expect(res.strokes[2].isInRadical).toBe(false);
    expect(res.strokes[3].isInRadical).toBe(false);
    expect(res.strokes[4].isInRadical).toBe(false);
  });
});
