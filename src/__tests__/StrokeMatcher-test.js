const ren = require('hanzi-writer-data/人.json');
const StrokeMatcher = require('../StrokeMatcher');
const Point = require('../models/Point');
const Stroke = require('../models/Stroke');
const UserStroke = require('../models/UserStroke');
const CharDataParser = require('../CharDataParser');


const char = new CharDataParser().generateCharacter('人', ren);
const matcher = new StrokeMatcher();

describe('StrokeMatcher', () => {
  it('matches if the user stroke roughly matches the stroke medians', () => {
    const stroke = new Stroke('', [new Point(0, 0), new Point(10, 50)], 0);

    const userStroke = new UserStroke(1, new Point(2, 1), new Point(9999, 9999));
    userStroke.appendPoint(new Point(5, 25), new Point(9999, 9999));
    userStroke.appendPoint(new Point(10, 51), new Point(9999, 9999));

    expect(matcher.strokeMatches(userStroke, stroke)).toBe(true);
  });

  it('does not match if the user stroke is in the wrong direction', () => {
    const stroke = new Stroke('', [new Point(0, 0), new Point(10, 50)], 0);

    const userStroke = new UserStroke(1, new Point(10, 51), new Point(9999, 9999));
    userStroke.appendPoint(new Point(5, 25), new Point(9999, 9999));
    userStroke.appendPoint(new Point(2, 1), new Point(9999, 9999));

    expect(matcher.strokeMatches(userStroke, stroke)).toBe(false);
  });

  it('does not match if the user stroke is too far away', () => {
    const stroke = new Stroke('', [new Point(0, 0), new Point(10, 50)], 0);

    const userStroke = new UserStroke(1, new Point(2 + 200, 1 + 200), new Point(9999, 9999));
    userStroke.appendPoint(new Point(5 + 200, 25 + 200), new Point(9999, 9999));
    userStroke.appendPoint(new Point(10 + 200, 51 + 200), new Point(9999, 9999));

    expect(matcher.strokeMatches(userStroke, stroke)).toBe(false);
  });

  it('matches using real data 1', () => {
    const stroke = char.strokes[0];
    const userStroke = {
      points: [
        new Point(409.6, 746.4),
        new Point(409.6, 746.4),
        new Point(409.6, 746.4),
        new Point(409.6, 743.5555555555555),
        new Point(409.6, 735.0222222222222),
        new Point(409.6, 723.6444444444444),
        new Point(406.75555555555553, 709.4222222222222),
        new Point(401.06666666666666, 695.2),
        new Point(395.3777777777778, 675.2888888888889),
        new Point(392.53333333333336, 658.2222222222222),
        new Point(384, 635.4666666666667),
        new Point(378.31111111111113, 615.5555555555555),
        new Point(372.6222222222222, 592.8),
        new Point(366.93333333333334, 570.0444444444445),
        new Point(358.4, 547.2888888888889),
        new Point(347.02222222222224, 516),
        new Point(338.4888888888889, 498.93333333333334),
        new Point(335.64444444444445, 487.55555555555554),
        new Point(329.9555555555556, 476.1777777777778),
        new Point(324.26666666666665, 464.8),
        new Point(318.5777777777778, 450.5777777777778),
        new Point(312.8888888888889, 433.5111111111111),
        new Point(304.35555555555555, 422.1333333333333),
        new Point(295.8222222222222, 405.06666666666666),
        new Point(290.1333333333333, 393.68888888888887),
        new Point(287.2888888888889, 388),
        new Point(275.9111111111111, 370.93333333333334),
        new Point(273.06666666666666, 362.4),
        new Point(267.3777777777778, 353.8666666666667),
        new Point(261.68888888888887, 348.1777777777778),
        new Point(258.84444444444443, 342.4888888888889),
        new Point(256, 336.8),
        new Point(253.15555555555557, 333.9555555555556),
        new Point(247.46666666666667, 328.26666666666665),
        new Point(244.62222222222223, 325.4222222222222),
        new Point(241.77777777777777, 319.73333333333335),
        new Point(236.0888888888889, 314.0444444444444),
        new Point(233.24444444444444, 311.2),
        new Point(227.55555555555554, 305.5111111111111),
        new Point(224.7111111111111, 299.8222222222222),
        new Point(219.0222222222222, 294.1333333333333),
        new Point(210.48888888888888, 285.6),
        new Point(204.8, 279.9111111111111),
        new Point(196.26666666666668, 268.53333333333336),
        new Point(193.42222222222222, 265.68888888888887),
        new Point(182.04444444444445, 254.3111111111111),
        new Point(173.51111111111112, 245.77777777777777),
        new Point(167.82222222222222, 237.24444444444444),
        new Point(164.9777777777778, 234.4),
        new Point(156.44444444444446, 225.86666666666667),
        new Point(147.9111111111111, 220.17777777777778),
        new Point(142.22222222222223, 214.48888888888888),
        new Point(139.37777777777777, 211.64444444444445),
        new Point(130.84444444444443, 205.95555555555555),
        new Point(122.31111111111112, 200.26666666666668),
        new Point(119.46666666666667, 197.42222222222222),
        new Point(113.77777777777777, 194.57777777777778),
        new Point(110.93333333333334, 191.73333333333332),
        new Point(105.24444444444444, 188.88888888888889),
        new Point(99.55555555555556, 186.04444444444445),
        new Point(93.86666666666666, 180.35555555555555),
        new Point(88.17777777777778, 177.51111111111112),
        new Point(82.4888888888889, 171.82222222222222),
        new Point(76.8, 168.9777777777778),
        new Point(71.11111111111111, 166.13333333333333),
        new Point(68.26666666666667, 163.2888888888889),
        new Point(65.42222222222222, 157.6),
        new Point(62.577777777777776, 154.75555555555556),
        new Point(56.888888888888886, 154.75555555555556),
        new Point(56.888888888888886, 151.9111111111111),
        new Point(54.044444444444444, 151.9111111111111),
      ],
    };
    expect(matcher.strokeMatches(userStroke, stroke)).toBe(true);
  });

  it('matches using real data 2', () => {
    const stroke = char.strokes[1];
    const userStroke = {
      points: [
        new Point(583.1111111111111, 516),
        new Point(583.1111111111111, 516),
        new Point(583.1111111111111, 516),
        new Point(585.9555555555555, 513.1555555555556),
        new Point(594.4888888888889, 501.77777777777777),
        new Point(620.0888888888888, 473.3333333333333),
        new Point(648.5333333333333, 436.35555555555555),
        new Point(691.2, 388),
        new Point(736.7111111111111, 333.9555555555556),
        new Point(790.7555555555556, 279.9111111111111),
        new Point(850.4888888888889, 217.33333333333334),
        new Point(890.3111111111111, 180.35555555555555),
        new Point(938.6666666666666, 137.6888888888889),
        new Point(975.6444444444444, 109.24444444444444),
        new Point(992.7111111111111, 97.86666666666666),
        new Point(998.4, 95.02222222222223),
        new Point(998.4, 95.02222222222223),
      ],
    };
    expect(matcher.strokeMatches(userStroke, stroke)).toBe(true);
  });

  it('does not match using real data 1', () => {
    const stroke = char.strokes[0];
    const userStroke = {
      points: [
        new Point(133.6888888888889, 595.6444444444444),
        new Point(133.6888888888889, 595.6444444444444),
        new Point(136.53333333333333, 595.6444444444444),
        new Point(150.75555555555556, 595.6444444444444),
        new Point(199.11111111111111, 595.6444444444444),
        new Point(281.6, 595.6444444444444),
        new Point(392.53333333333336, 595.6444444444444),
        new Point(475.02222222222224, 595.6444444444444),
        new Point(546.1333333333333, 595.6444444444444),
        new Point(588.8, 595.6444444444444),
        new Point(608.7111111111111, 595.6444444444444),
        new Point(614.4, 595.6444444444444),
        new Point(617.2444444444444, 595.6444444444444),
        new Point(620.0888888888888, 595.6444444444444),
        new Point(620.0888888888888, 595.6444444444444),
        new Point(620.0888888888888, 595.6444444444444),
        new Point(620.0888888888888, 595.6444444444444),
      ],
    };
    expect(matcher.strokeMatches(userStroke, stroke)).toBe(false);
  });

  it('does not match using real data 2', () => {
    const stroke = char.strokes[0];
    const userStroke = {
      points: [
        new Point(31.288888888888888, 285.6),
        new Point(28.444444444444443, 285.6),
        new Point(34.13333333333333, 288.44444444444446),
        new Point(54.044444444444444, 302.6666666666667),
        new Point(102.4, 333.9555555555556),
        new Point(201.95555555555555, 393.68888888888887),
        new Point(287.2888888888889, 450.5777777777778),
        new Point(386.84444444444443, 516),
        new Point(452.26666666666665, 555.8222222222222),
        new Point(506.31111111111113, 584.2666666666667),
        new Point(560.3555555555556, 612.7111111111111),
        new Point(603.0222222222222, 635.4666666666667),
        new Point(642.8444444444444, 658.2222222222222),
        new Point(676.9777777777778, 678.1333333333333),
        new Point(705.4222222222222, 692.3555555555556),
        new Point(719.6444444444444, 698.0444444444445),
        new Point(725.3333333333334, 700.8888888888889),
        new Point(728.1777777777778, 703.7333333333333),
        new Point(733.8666666666667, 706.5777777777778),
        new Point(733.8666666666667, 706.5777777777778),
      ],
    };
    expect(matcher.strokeMatches(userStroke, stroke)).toBe(false);
  });

  it('does not match using real data 3', () => {
    const stroke = char.strokes[0];
    const userStroke = {
      points: [
        new Point(395.3777777777778, 712.2666666666667),
        new Point(395.3777777777778, 712.2666666666667),
        new Point(395.3777777777778, 703.7333333333333),
        new Point(395.3777777777778, 692.3555555555556),
        new Point(395.3777777777778, 686.6666666666666),
        new Point(392.53333333333336, 672.4444444444445),
        new Point(386.84444444444443, 658.2222222222222),
        new Point(384, 646.8444444444444),
        new Point(381.15555555555557, 635.4666666666667),
        new Point(378.31111111111113, 626.9333333333333),
        new Point(375.46666666666664, 621.2444444444444),
        new Point(372.6222222222222, 615.5555555555555),
        new Point(372.6222222222222, 615.5555555555555),
        new Point(372.6222222222222, 612.7111111111111),
        new Point(369.77777777777777, 612.7111111111111),
        new Point(369.77777777777777, 612.7111111111111),
      ],
    };
    expect(matcher.strokeMatches(userStroke, stroke)).toBe(false);
  });

  it('does not match using real data 4', () => {
    const stroke = char.strokes[0];
    const userStroke = {
      points: [
        new Point(961.4222222222222, 680.9777777777778),
        new Point(961.4222222222222, 680.9777777777778),
        new Point(961.4222222222222, 680.9777777777778),
        new Point(961.4222222222222, 678.1333333333333),
        new Point(961.4222222222222, 675.2888888888889),
        new Point(961.4222222222222, 669.6),
        new Point(955.7333333333333, 655.3777777777777),
        new Point(952.8888888888889, 638.3111111111111),
        new Point(944.3555555555556, 615.5555555555555),
        new Point(935.8222222222222, 587.1111111111111),
        new Point(924.4444444444445, 555.8222222222222),
        new Point(913.0666666666667, 524.5333333333333),
        new Point(896, 473.3333333333333),
        new Point(881.7777777777778, 427.8222222222222),
        new Point(873.2444444444444, 393.68888888888887),
        new Point(864.7111111111111, 368.0888888888889),
        new Point(844.8, 305.5111111111111),
        new Point(836.2666666666667, 268.53333333333336),
        new Point(822.0444444444445, 231.55555555555554),
        new Point(810.6666666666666, 203.11111111111111),
        new Point(802.1333333333333, 177.51111111111112),
        new Point(790.7555555555556, 154.75555555555556),
        new Point(782.2222222222222, 134.84444444444443),
        new Point(773.6888888888889, 117.77777777777777),
        new Point(765.1555555555556, 103.55555555555556),
        new Point(756.6222222222223, 86.4888888888889),
        new Point(750.9333333333333, 77.95555555555555),
        new Point(745.2444444444444, 69.42222222222222),
        new Point(742.4, 63.733333333333334),
        new Point(739.5555555555555, 63.733333333333334),
        new Point(739.5555555555555, 60.888888888888886),
        new Point(739.5555555555555, 60.888888888888886),
        new Point(736.7111111111111, 60.888888888888886),
        new Point(736.7111111111111, 60.888888888888886),
        new Point(736.7111111111111, 60.888888888888886),
        new Point(733.8666666666667, 60.888888888888886),
        new Point(733.8666666666667, 60.888888888888886),
        new Point(733.8666666666667, 60.888888888888886),
        new Point(733.8666666666667, 60.888888888888886),
        new Point(733.8666666666667, 63.733333333333334),
        new Point(733.8666666666667, 63.733333333333334),
        new Point(733.8666666666667, 63.733333333333334),
        new Point(733.8666666666667, 66.57777777777778),
        new Point(733.8666666666667, 66.57777777777778),
      ],
    };
    expect(matcher.strokeMatches(userStroke, stroke)).toBe(false);
  });
});
