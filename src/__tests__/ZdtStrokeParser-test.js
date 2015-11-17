jest.dontMock('../ZdtStrokeParser');
const ZdtStrokeParser = require('../ZdtStrokeParser').default;
import Point from '../models/Point';
import Stroke from '../models/Stroke';
import StrokePart from '../models/StrokePart';
import Character from '../models/Character';

describe('ZdtStrokeParser', () => {
  console.log(ZdtStrokeParser);
  console.log(new ZdtStrokeParser);
  const zdtStrokeParser = new ZdtStrokeParser();

  it('should parse simple zdt string data into characters', () => {
    const yi = zdtStrokeParser.generateCharacter("一", [
      "#8PR:102,153;142,148;170,146;217,148;249,148;250,147;250,142;223,123;212,123;202,126;156,132;108,136;61,141;19,145;19,150;30,160;40,164;49,164;60,160;76,157;95,154\n",
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

  it('should correctly parse multi-part strokes', () => {
    const fu = zdtStrokeParser.generateCharacter("乀", [
      "#8NR:36,81;111,61;117,50;138,61;116,67;54,85;48,87;43,89",
      "#2PR:116,68;138,61;126,71;127,75;129,84;132,93;135,102;139,112;142,121;148,132;153,142;159,151;164,161;171,169;179,178;188,186;197,192;209,199;221,203;236,208;256,211;256,214;248,213;242,215;237,218;234,221;231,225;224,223;216,219;208,215;196,208;186,201;176,192;169,185;162,177;157,168;150,156;144,146;138,130;131,112;125,96;121,82;\n",
    ]);

    expect(fu.getSymbol()).toBe('乀');
    expect(fu.getNumStrokes()).toBe(1);
    
    const strokePart1 = new StrokePart(8, [
      new Point(36,81),
      new Point(111,61),
      new Point(117,50),
      new Point(138,61),
      new Point(116,67),
      new Point(54,85),
      new Point(48,87),
      new Point(43,89),
    ]);
    const strokePart2 = new StrokePart(2, [
      new Point(116,68),
      new Point(138,61),
      new Point(126,71),
      new Point(127,75),
      new Point(129,84),
      new Point(132,93),
      new Point(135,102),
      new Point(139,112),
      new Point(142,121),
      new Point(148,132),
      new Point(153,142),
      new Point(159,151),
      new Point(164,161),
      new Point(171,169),
      new Point(179,178),
      new Point(188,186),
      new Point(197,192),
      new Point(209,199),
      new Point(221,203),
      new Point(236,208),
      new Point(256,211),
      new Point(256,214),
      new Point(248,213),
      new Point(242,215),
      new Point(237,218),
      new Point(234,221),
      new Point(231,225),
      new Point(224,223),
      new Point(216,219),
      new Point(208,215),
      new Point(196,208),
      new Point(186,201),
      new Point(176,192),
      new Point(169,185),
      new Point(162,177),
      new Point(157,168),
      new Point(150,156),
      new Point(144,146),
      new Point(138,130),
      new Point(131,112),
      new Point(125,96),
      new Point(121,82),
    ]);
    const expectedFu = new Character('乀', [new Stroke([strokePart1, strokePart2], 0)]);
    expect(JSON.stringify(fu)).toBe(JSON.stringify(expectedFu));
  });
});