jest.dontMock('../ZdtStrokeParser');
import Point from '../models/Point';
import Stroke from '../models/Stroke';
import StrokePart from '../models/StrokePart';
import Character from '../models/Character';

const ZdtStrokeParser = require('../ZdtStrokeParser');

describe('ZdtStrokeParser', () => {
  const zdtStrokeParser = new ZdtStrokeParser();

  it('should parse simple zdt string data into characters', () => {
    const yi = zdtStrokeParser.generateCharacter("一", [
      "#8PR:102,153;142,148;170,146;217,148;249,148;250,147;250,142;223,123;212,123;202,126;156,132;108,136;61,141;19,145;19,150;30,160;40,164;49,164;60,160;76,157;95,154",
    ]);

    expect(yi.getSymbol()).toBe('一');
    expect(yi.getNumStrokes()).toBe(1);
    
    const points = [
      new Point(102,153),
      new Point(142,148),
      new Point(170,146),
      new Point(217,148),
      new Point(249,148),
      new Point(250,147),
      new Point(250,142),
      new Point(223,123),
      new Point(212,123),
      new Point(202,126),
      new Point(156,132),
      new Point(108,136),
      new Point(61,141),
      new Point(19,145),
      new Point(19,150),
      new Point(30,160),
      new Point(40,164),
      new Point(49,164),
      new Point(60,160),
      new Point(76,157),
      new Point(95,154),
    ];
    const expectedYi = new Character('一', [new Stroke([new StrokePart(8, points)], 0)]);
    expect(JSON.stringify(yi)).toBe(JSON.stringify(expectedYi));
  });
});