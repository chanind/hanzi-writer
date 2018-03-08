const strokeMatches = require('../strokeMatches');
const Stroke = require('../models/Stroke');
const UserStroke = require('../models/UserStroke');
const CharDataParser = require('../CharDataParser');


const getChar = (charStr) => {
  const charJson = require(`hanzi-writer-data/${charStr}.json`);
  return new CharDataParser().generateCharacter(charStr, charJson);
};

const assertMatches = (charStr, strokeNum, points, isOutlineVisible = false) => {
  const char = getChar(charStr);
  const userStroke = { points };
  expect(strokeMatches(userStroke, char, strokeNum, { isOutlineVisible })).toBe(true);
};

const assertNotMatches = (charStr, strokeNum, points, isOutlineVisible = false) => {
  const char = getChar(charStr);
  const userStroke = { points };
  expect(strokeMatches(userStroke, char, strokeNum, { isOutlineVisible })).toBe(false);
};

describe('strokeMatches', () => {
  it('matches if the user stroke roughly matches the stroke medians', () => {
    const stroke = new Stroke('', [{x: 0, y: 0}, {x: 10, y: 50}], 0);

    const userStroke = new UserStroke(1, {x: 2, y: 1}, {x: 9999, y: 9999});
    userStroke.appendPoint({x: 5, y: 25}, {x: 9999, y: 9999});
    userStroke.appendPoint({x: 10, y: 51}, {x: 9999, y: 9999});

    expect(strokeMatches(userStroke, {strokes: [stroke]}, 0)).toBe(true);
  });

  it('does not match if the user stroke is in the wrong direction', () => {
    const stroke = new Stroke('', [{x: 0, y: 0}, {x: 10, y: 50}], 0);

    const userStroke = new UserStroke(1, {x: 10, y: 51}, {x: 9999, y: 9999});
    userStroke.appendPoint({x: 5, y: 25}, {x: 9999, y: 9999});
    userStroke.appendPoint({x: 2, y: 1}, {x: 9999, y: 9999});

    expect(strokeMatches(userStroke, {strokes: [stroke]}, 0)).toBe(false);
  });

  it('does not match if the user stroke is too far away', () => {
    const stroke = new Stroke('', [{x: 0, y: 0}, {x: 10, y: 50}], 0);

    const userStroke = new UserStroke(1, {x: 2 + 200, y: 1 + 200}, {x: 9999, y: 9999});
    userStroke.appendPoint({x: 5 + 200, y: 25 + 200}, {x: 9999, y: 9999});
    userStroke.appendPoint({x: 10 + 200, y: 51 + 200}, {x: 9999, y: 9999});

    expect(strokeMatches(userStroke, {strokes: [stroke]}, 0)).toBe(false);
  });

  it('is more lenient depending on how large leniency is', () => {
    const stroke = new Stroke('', [{x: 0, y: 0}, {x: 10, y: 50}], 0);

    const userStroke = new UserStroke(1, {x: 2 + 200, y: 1 + 200}, {x: 9999, y: 9999});
    userStroke.appendPoint({x: 5 + 200, y: 25 + 200}, {x: 9999, y: 9999});
    userStroke.appendPoint({x: 10 + 200, y: 51 + 200}, {x: 9999, y: 9999});

    expect(strokeMatches(userStroke, {strokes: [stroke]}, 0, { leniency: 0.2 })).toBe(false);
    expect(strokeMatches(userStroke, {strokes: [stroke]}, 0, { leniency: 20 })).toBe(true);
  });

  it('matches using real data 1', () => {
    assertMatches('人', 0, [{x: 409.6, y: 746.4}, {x: 409.6, y: 746.4}, {x: 409.6, y: 746.4}, {x: 409.6, y: 743.5555555555555}, {x: 409.6, y: 735.0222222222222}, {x: 409.6, y: 723.6444444444444}, {x: 406.75555555555553, y: 709.4222222222222}, {x: 401.06666666666666, y: 695.2}, {x: 395.3777777777778, y: 675.2888888888889}, {x: 392.53333333333336, y: 658.2222222222222}, {x: 384, y: 635.4666666666667}, {x: 378.31111111111113, y: 615.5555555555555}, {x: 372.6222222222222, y: 592.8}, {x: 366.93333333333334, y: 570.0444444444445}, {x: 358.4, y: 547.2888888888889}, {x: 347.02222222222224, y: 516}, {x: 338.4888888888889, y: 498.93333333333334}, {x: 335.64444444444445, y: 487.55555555555554}, {x: 329.9555555555556, y: 476.1777777777778}, {x: 324.26666666666665, y: 464.8}, {x: 318.5777777777778, y: 450.5777777777778}, {x: 312.8888888888889, y: 433.5111111111111}, {x: 304.35555555555555, y: 422.1333333333333}, {x: 295.8222222222222, y: 405.06666666666666}, {x: 290.1333333333333, y: 393.68888888888887}, {x: 287.2888888888889, y: 388}, {x: 275.9111111111111, y: 370.93333333333334}, {x: 273.06666666666666, y: 362.4}, {x: 267.3777777777778, y: 353.8666666666667}, {x: 261.68888888888887, y: 348.1777777777778}, {x: 258.84444444444443, y: 342.4888888888889}, {x: 256, y: 336.8}, {x: 253.15555555555557, y: 333.9555555555556}, {x: 247.46666666666667, y: 328.26666666666665}, {x: 244.62222222222223, y: 325.4222222222222}, {x: 241.77777777777777, y: 319.73333333333335}, {x: 236.0888888888889, y: 314.0444444444444}, {x: 233.24444444444444, y: 311.2}, {x: 227.55555555555554, y: 305.5111111111111}, {x: 224.7111111111111, y: 299.8222222222222}, {x: 219.0222222222222, y: 294.1333333333333}, {x: 210.48888888888888, y: 285.6}, {x: 204.8, y: 279.9111111111111}, {x: 196.26666666666668, y: 268.53333333333336}, {x: 193.42222222222222, y: 265.68888888888887}, {x: 182.04444444444445, y: 254.3111111111111}, {x: 173.51111111111112, y: 245.77777777777777}, {x: 167.82222222222222, y: 237.24444444444444}, {x: 164.9777777777778, y: 234.4}, {x: 156.44444444444446, y: 225.86666666666667}, {x: 147.9111111111111, y: 220.17777777777778}, {x: 142.22222222222223, y: 214.48888888888888}, {x: 139.37777777777777, y: 211.64444444444445}, {x: 130.84444444444443, y: 205.95555555555555}, {x: 122.31111111111112, y: 200.26666666666668}, {x: 119.46666666666667, y: 197.42222222222222}, {x: 113.77777777777777, y: 194.57777777777778}, {x: 110.93333333333334, y: 191.73333333333332}, {x: 105.24444444444444, y: 188.88888888888889}, {x: 99.55555555555556, y: 186.04444444444445}, {x: 93.86666666666666, y: 180.35555555555555}, {x: 88.17777777777778, y: 177.51111111111112}, {x: 82.4888888888889, y: 171.82222222222222}, {x: 76.8, y: 168.9777777777778}, {x: 71.11111111111111, y: 166.13333333333333}, {x: 68.26666666666667, y: 163.2888888888889}, {x: 65.42222222222222, y: 157.6}, {x: 62.577777777777776, y: 154.75555555555556}, {x: 56.888888888888886, y: 154.75555555555556}, {x: 56.888888888888886, y: 151.9111111111111}, {x: 54.044444444444444, y: 151.9111111111111},
    ]);
  });

  it('matches using real data 2', () => {
    assertMatches('人', 1, [{x: 583.1111111111111, y: 516}, {x: 583.1111111111111, y: 516}, {x: 583.1111111111111, y: 516}, {x: 585.9555555555555, y: 513.1555555555556}, {x: 594.4888888888889, y: 501.77777777777777}, {x: 620.0888888888888, y: 473.3333333333333}, {x: 648.5333333333333, y: 436.35555555555555}, {x: 691.2, y: 388}, {x: 736.7111111111111, y: 333.9555555555556}, {x: 790.7555555555556, y: 279.9111111111111}, {x: 850.4888888888889, y: 217.33333333333334}, {x: 890.3111111111111, y: 180.35555555555555}, {x: 938.6666666666666, y: 137.6888888888889}, {x: 975.6444444444444, y: 109.24444444444444}, {x: 992.7111111111111, y: 97.86666666666666}, {x: 998.4, y: 95.02222222222223}, {x: 998.4, y: 95.02222222222223},
    ]);
  });

  it('does not match using real data 1', () => {
    assertNotMatches('人', 0, [{x: 133.6888888888889, y: 595.6444444444444}, {x: 133.6888888888889, y: 595.6444444444444}, {x: 136.53333333333333, y: 595.6444444444444}, {x: 150.75555555555556, y: 595.6444444444444}, {x: 199.11111111111111, y: 595.6444444444444}, {x: 281.6, y: 595.6444444444444}, {x: 392.53333333333336, y: 595.6444444444444}, {x: 475.02222222222224, y: 595.6444444444444}, {x: 546.1333333333333, y: 595.6444444444444}, {x: 588.8, y: 595.6444444444444}, {x: 608.7111111111111, y: 595.6444444444444}, {x: 614.4, y: 595.6444444444444}, {x: 617.2444444444444, y: 595.6444444444444}, {x: 620.0888888888888, y: 595.6444444444444}, {x: 620.0888888888888, y: 595.6444444444444}, {x: 620.0888888888888, y: 595.6444444444444}, {x: 620.0888888888888, y: 595.6444444444444},
    ]);
  });

  it('does not match using real data 2', () => {
    assertNotMatches('人', 0, [{x: 31.288888888888888, y: 285.6}, {x: 28.444444444444443, y: 285.6}, {x: 34.13333333333333, y: 288.44444444444446}, {x: 54.044444444444444, y: 302.6666666666667}, {x: 102.4, y: 333.9555555555556}, {x: 201.95555555555555, y: 393.68888888888887}, {x: 287.2888888888889, y: 450.5777777777778}, {x: 386.84444444444443, y: 516}, {x: 452.26666666666665, y: 555.8222222222222}, {x: 506.31111111111113, y: 584.2666666666667}, {x: 560.3555555555556, y: 612.7111111111111}, {x: 603.0222222222222, y: 635.4666666666667}, {x: 642.8444444444444, y: 658.2222222222222}, {x: 676.9777777777778, y: 678.1333333333333}, {x: 705.4222222222222, y: 692.3555555555556}, {x: 719.6444444444444, y: 698.0444444444445}, {x: 725.3333333333334, y: 700.8888888888889}, {x: 728.1777777777778, y: 703.7333333333333}, {x: 733.8666666666667, y: 706.5777777777778}, {x: 733.8666666666667, y: 706.5777777777778},
    ]);
  });

  it('does not match using real data 3', () => {
    assertNotMatches('人', 0, [{x: 395.3777777777778, y: 712.2666666666667}, {x: 395.3777777777778, y: 712.2666666666667}, {x: 395.3777777777778, y: 703.7333333333333}, {x: 395.3777777777778, y: 692.3555555555556}, {x: 395.3777777777778, y: 686.6666666666666}, {x: 392.53333333333336, y: 672.4444444444445}, {x: 386.84444444444443, y: 658.2222222222222}, {x: 384, y: 646.8444444444444}, {x: 381.15555555555557, y: 635.4666666666667}, {x: 378.31111111111113, y: 626.9333333333333}, {x: 375.46666666666664, y: 621.2444444444444}, {x: 372.6222222222222, y: 615.5555555555555}, {x: 372.6222222222222, y: 615.5555555555555}, {x: 372.6222222222222, y: 612.7111111111111}, {x: 369.77777777777777, y: 612.7111111111111}, {x: 369.77777777777777, y: 612.7111111111111},
    ]);
  });

  it('does not match using real data 4', () => {
    assertNotMatches('人', 0, [{x: 961.4222222222222, y: 680.9777777777778}, {x: 961.4222222222222, y: 680.9777777777778}, {x: 961.4222222222222, y: 680.9777777777778}, {x: 961.4222222222222, y: 678.1333333333333}, {x: 961.4222222222222, y: 675.2888888888889}, {x: 961.4222222222222, y: 669.6}, {x: 955.7333333333333, y: 655.3777777777777}, {x: 952.8888888888889, y: 638.3111111111111}, {x: 944.3555555555556, y: 615.5555555555555}, {x: 935.8222222222222, y: 587.1111111111111}, {x: 924.4444444444445, y: 555.8222222222222}, {x: 913.0666666666667, y: 524.5333333333333}, {x: 896, y: 473.3333333333333}, {x: 881.7777777777778, y: 427.8222222222222}, {x: 873.2444444444444, y: 393.68888888888887}, {x: 864.7111111111111, y: 368.0888888888889}, {x: 844.8, y: 305.5111111111111}, {x: 836.2666666666667, y: 268.53333333333336}, {x: 822.0444444444445, y: 231.55555555555554}, {x: 810.6666666666666, y: 203.11111111111111}, {x: 802.1333333333333, y: 177.51111111111112}, {x: 790.7555555555556, y: 154.75555555555556}, {x: 782.2222222222222, y: 134.84444444444443}, {x: 773.6888888888889, y: 117.77777777777777}, {x: 765.1555555555556, y: 103.55555555555556}, {x: 756.6222222222223, y: 86.4888888888889}, {x: 750.9333333333333, y: 77.95555555555555}, {x: 745.2444444444444, y: 69.42222222222222}, {x: 742.4, y: 63.733333333333334}, {x: 739.5555555555555, y: 63.733333333333334}, {x: 739.5555555555555, y: 60.888888888888886}, {x: 739.5555555555555, y: 60.888888888888886}, {x: 736.7111111111111, y: 60.888888888888886}, {x: 736.7111111111111, y: 60.888888888888886}, {x: 736.7111111111111, y: 60.888888888888886}, {x: 733.8666666666667, y: 60.888888888888886}, {x: 733.8666666666667, y: 60.888888888888886}, {x: 733.8666666666667, y: 60.888888888888886}, {x: 733.8666666666667, y: 60.888888888888886}, {x: 733.8666666666667, y: 63.733333333333334}, {x: 733.8666666666667, y: 63.733333333333334}, {x: 733.8666666666667, y: 63.733333333333334}, {x: 733.8666666666667, y: 66.57777777777778}, {x: 733.8666666666667, y: 66.57777777777778},
    ]);
  });

  it('matches using real data 5', () => {
    assertMatches('国', 1, [{x: 337.2, y: 717}, {x: 347.5, y: 717}, {x: 378.2, y: 717}, {x: 408.9, y: 720.4}, {x: 484, y: 720.4}, {x: 521.6, y: 723.8}, {x: 600.1, y: 737.5}, {x: 695.6, y: 751.1}, {x: 740, y: 761.4}, {x: 852.7, y: 764.8}, {x: 907.3, y: 764.8}, {x: 931.2, y: 764.8}, {x: 955.1, y: 747.7}, {x: 958.5, y: 740.9}, {x: 958.5, y: 717}, {x: 958.5, y: 696.5}, {x: 958.5, y: 669.2}, {x: 958.5, y: 628.2}, {x: 927.7, y: 556.6}, {x: 927.7, y: 556.6}, {x: 924.3, y: 457.6}, {x: 866.3, y: 252.8}, {x: 866.3, y: 208.4}, {x: 866.3, y: 99.2}, {x: 866.3, y: 54.8}, {x: 849.2, y: -3.2}, {x: 842.4, y: -78.3}, {x: 839, y: -92}, {x: 828.8, y: -105.6},
    ]);
  });

  it('matches using real data 6', () => {
    const points = [{x: 412.3, y: 423.4}, {x: 463.5, y: 423.4}, {x: 501.1, y: 423.4}, {x: 518.1, y: 423.4}, {x: 528.4, y: 423.4}, {x: 562.5, y: 423.4}, {x: 576.2, y: 423.4}];
    assertNotMatches('国', 2, points, true);
    assertMatches('国', 3, points, true);
    assertNotMatches('国', 4, points, true);
    assertNotMatches('国', 5, points, true);
  });

  it('matches using real data 7', () => {
    const points = [{x: 197.3, y: 568.8}, {x: 201.1, y: 561.2}, {x: 348, y: 579}, {x: 557.8, y: 605.6}, {x: 768.2, y: 630.1}, {x: 840.5, y: 633.6}, {x: 807.1, y: 524}, {x: 722.1, y: 197.1}];
    assertNotMatches('中', 0, points);
    assertMatches('中', 1, points);
    assertNotMatches('中', 2, points);
  });

  it('matches using real data 8', () => {
    const points = [{x: 234.8, y: 433.4}, {x: 161.3, y: 325.5}, {x: 43.9, y: 119.7}];
    assertNotMatches('小', 0, points);
    assertMatches('小', 1, points);
    assertNotMatches('小', 2, points);
  });

  it('matches using real data 9', () => {
    const points = [{x: 618.7, y: 378.9}, {x: 659.7, y: 385.7}, {x: 704.1, y: 402.8}, {x: 717.7, y: 413}, {x: 758.7, y: 430.1}, {x: 772.3, y: 433.5}];
    assertNotMatches('谁', 5, points);
    assertMatches('谁', 6, points);
  });

  it('matches using real data 10', () => {
    const points = [{x: 239.8, y: 717.5}, {x: 263.7, y: 717.5}, {x: 403.7, y: 755}, {x: 441.2, y: 765.3}, {x: 499.3, y: 785.8}, {x: 509.5, y: 792.6}, {x: 512.9, y: 792.6}, {x: 489, y: 734.6}, {x: 472, y: 710.7}, {x: 441.2, y: 669.7}, {x: 424.2, y: 635.6}, {x: 410.5, y: 533.2}, {x: 390, y: 400.1}, {x: 355.9, y: 290.8}, {x: 352.5, y: 273.8}, {x: 345.7, y: 263.5}, {x: 342.2, y: 249.9}, {x: 335.4, y: 239.6}, {x: 335.4, y: 232.8}, {x: 325.2, y: 232.8}, {x: 321.8, y: 239.6}, {x: 274, y: 284}, {x: 239.8, y: 311.3}, {x: 226.2, y: 342}];
    assertMatches('那', 0, points);
    assertNotMatches('那', 1, points);
  });

  it('matches using real data 11', () => {
    const points = [{x: 40.7, y: 425.9}, {x: 47.6, y: 425.9}, {x: 163.6, y: 484}, {x: 194.3, y: 490.8}, {x: 303.6, y: 538.6}, {x: 344.5, y: 548.8}, {x: 347.9, y: 548.8}, {x: 347.9, y: 538.6}, {x: 303.6, y: 367.9}, {x: 255.8, y: 268.9}, {x: 248.9, y: 241.6}, {x: 228.5, y: 156.3}, {x: 225.1, y: 129}, {x: 225.1, y: 129}, {x: 228.5, y: 129}, {x: 293.3, y: 187}, {x: 310.4, y: 210.9}, {x: 351.3, y: 251.9}, {x: 382.1, y: 272.3}, {x: 392.3, y: 286}];
    assertNotMatches('语', 0, points);
    assertMatches('语', 1, points);
    assertNotMatches('语', 2, points);
  });

  it('matches using real data 12', () => {
    const points = [{x: 512, y: 735.7}, {x: 512, y: 732.2}, {x: 512, y: 732.2}, {x: 522.2, y: 732.2}, {x: 525.7, y: 735.7}, {x: 539.3, y: 739.1}, {x: 553, y: 742.5}, {x: 566.6, y: 749.3}, {x: 587.1, y: 752.7}, {x: 600.7, y: 756.1}, {x: 611, y: 759.6}, {x: 631.5, y: 759.6}, {x: 645.1, y: 763}, {x: 658.8, y: 763}, {x: 669, y: 763}, {x: 669, y: 763}, {x: 672.4, y: 763}, {x: 675.8, y: 763}, {x: 679.3, y: 763}, {x: 682.7, y: 763}, {x: 682.7, y: 759.6}, {x: 682.7, y: 756.1}, {x: 689.5, y: 752.7}, {x: 689.5, y: 749.3}, {x: 689.5, y: 742.5}, {x: 689.5, y: 742.5}, {x: 692.9, y: 739.1}, {x: 692.9, y: 735.7}, {x: 692.9, y: 728.8}, {x: 692.9, y: 722}, {x: 692.9, y: 708.4}, {x: 692.9, y: 691.3}, {x: 689.5, y: 674.2}, {x: 689.5, y: 664}, {x: 682.7, y: 636.7}, {x: 682.7, y: 619.6}, {x: 672.4, y: 599.1}, {x: 669, y: 578.6}, {x: 669, y: 565}, {x: 662.2, y: 551.3}, {x: 662.2, y: 537.7}, {x: 658.8, y: 524}, {x: 648.5, y: 517.2}, {x: 645.1, y: 503.6}, {x: 645.1, y: 503.6}, {x: 641.7, y: 500.1}];
    assertNotMatches('很', 2, points);
    assertMatches('很', 3, points);
    assertNotMatches('很', 4, points);
    assertNotMatches('很', 5, points);
    assertNotMatches('很', 6, points);
  });

  it('matches using real data 13', () => {
    const points = [{x: 325, y: 684.3}, {x: 325, y: 687.7}, {x: 328.4, y: 691.1}, {x: 331.8, y: 694.6}, {x: 366, y: 704.8}, {x: 403.5, y: 708.2}, {x: 461.5, y: 718.5}, {x: 533.2, y: 725.3}, {x: 604.9, y: 738.9}, {x: 697.1, y: 752.6}, {x: 741.4, y: 762.8}, {x: 765.3, y: 773.1}, {x: 775.6, y: 776.5}, {x: 779, y: 776.5}, {x: 782.4, y: 779.9}, {x: 789.2, y: 779.9}, {x: 799.5, y: 779.9}, {x: 826.8, y: 779.9}, {x: 840.4, y: 779.9}, {x: 843.8, y: 779.9}, {x: 847.3, y: 776.5}, {x: 847.3, y: 773.1}, {x: 840.4, y: 762.8}, {x: 833.6, y: 749.2}, {x: 823.4, y: 742.3}, {x: 802.9, y: 725.3}, {x: 775.6, y: 701.4}, {x: 738, y: 684.3}];
    assertNotMatches('写', 0, points);
    assertMatches('写', 1, points);
    assertNotMatches('写', 2, points);
  });

  it('matches using real data 14', () => {
    const points = [{x: 55.4, y: 497.6}, {x: 62.2, y: 504.4}, {x: 96.3, y: 511.3}, {x: 195.3, y: 524.9}, {x: 280.6, y: 535.1}, {x: 362.6, y: 535.1}, {x: 434.2, y: 538.6}, {x: 502.5, y: 542}, {x: 560.5, y: 545.4}, {x: 591.3, y: 545.4}, {x: 604.9, y: 545.4}, {x: 608.3, y: 545.4}, {x: 615.1, y: 538.6}, {x: 615.1, y: 535.1}, {x: 615.1, y: 528.3}, {x: 615.1, y: 514.7}, {x: 615.1, y: 494.2}, {x: 615.1, y: 463.5}, {x: 601.5, y: 429.3}, {x: 584.4, y: 381.5}, {x: 567.4, y: 344}, {x: 546.9, y: 289.4}, {x: 526.4, y: 241.6}, {x: 502.5, y: 190.4}, {x: 492.3, y: 149.4}, {x: 482, y: 101.7}, {x: 482, y: 74.3}, {x: 485.4, y: 53.9}, {x: 495.7, y: 36.8}, {x: 512.7, y: 19.7}, {x: 543.5, y: 2.7}, {x: 601.5, y: -11}, {x: 676.6, y: -17.8}, {x: 758.5, y: -28.1}, {x: 826.8, y: -28.1}, {x: 874.6, y: -28.1}, {x: 918.9, y: -28.1}, {x: 942.8, y: -17.8}, {x: 963.3, y: -4.2}, {x: 977, y: 9.5}, {x: 987.2, y: 23.1}, {x: 990.6, y: 40.2}, {x: 990.6, y: 57.3}, {x: 990.6, y: 88}, {x: 990.6, y: 115.3}, {x: 990.6, y: 135.8}];
    assertNotMatches('九', 0, points);
    assertMatches('九', 1, points);
  });

  it('matches using real data 15', () => {
    const points = [{x: 368.2, y: 684.4}, {x: 371.6, y: 684.4}, {x: 378.4, y: 684.4}, {x: 395.5, y: 684.4}, {x: 412.5, y: 684.4}, {x: 446.7, y: 684.4}, {x: 477.4, y: 684.4}, {x: 518.3, y: 684.4}, {x: 562.7, y: 684.4}, {x: 593.4, y: 684.4}, {x: 613.9, y: 687.8}, {x: 627.6, y: 698.1}, {x: 631, y: 701.5}, {x: 631, y: 698.1}, {x: 631, y: 694.7}, {x: 631, y: 687.8}, {x: 620.7, y: 670.8}, {x: 610.5, y: 653.7}, {x: 603.7, y: 636.6}, {x: 586.6, y: 605.9}, {x: 573, y: 582}, {x: 569.5, y: 558.1}, {x: 569.5, y: 534.2}, {x: 569.5, y: 517.2}, {x: 569.5, y: 493.3}, {x: 569.5, y: 486.5}, {x: 573, y: 472.8}, {x: 579.8, y: 462.6}, {x: 590, y: 448.9}, {x: 603.7, y: 442.1}, {x: 620.7, y: 431.8}, {x: 637.8, y: 421.6}, {x: 648.1, y: 411.4}, {x: 651.5, y: 397.7}, {x: 654.9, y: 384.1}, {x: 654.9, y: 367}, {x: 654.9, y: 353.3}, {x: 654.9, y: 346.5}, {x: 654.9, y: 336.3}, {x: 651.5, y: 329.4}, {x: 641.2, y: 329.4}, {x: 610.5, y: 336.3}];
    assertMatches('阝', 0, points);
    assertNotMatches('阝', 1, points);
  });

  it('matches using real data 16', () => {
    const points = [{x: 386.8, y: 743.4}, {x: 390.3, y: 740}, {x: 407.3, y: 740}, {x: 424.4, y: 740}, {x: 441.5, y: 740}, {x: 458.5, y: 740}, {x: 479, y: 740}, {x: 496.1, y: 740}, {x: 516.6, y: 740}, {x: 530.2, y: 740}, {x: 540.4, y: 740}, {x: 550.7, y: 740}, {x: 564.3, y: 740}, {x: 574.6, y: 740}, {x: 581.4, y: 740}, {x: 588.2, y: 740}, {x: 595.1, y: 740}, {x: 598.5, y: 740}, {x: 605.3, y: 740}, {x: 612.1, y: 740}, {x: 619, y: 740}, {x: 625.8, y: 740}, {x: 632.6, y: 740}, {x: 639.4, y: 740}, {x: 639.4, y: 743.4}, {x: 642.8, y: 743.4}, {x: 646.3, y: 743.4}, {x: 646.3, y: 746.8}, {x: 649.7, y: 750.2}, {x: 653.1, y: 750.2}, {x: 659.9, y: 753.6}, {x: 663.3, y: 753.6}, {x: 666.7, y: 753.6}, {x: 666.7, y: 757}, {x: 666.7, y: 753.6}, {x: 666.7, y: 746.8}, {x: 666.7, y: 736.6}, {x: 666.7, y: 722.9}, {x: 666.7, y: 719.5}, {x: 666.7, y: 716.1}, {x: 666.7, y: 702.4}, {x: 663.3, y: 678.5}, {x: 659.9, y: 647.8}, {x: 656.5, y: 606.9}, {x: 653.1, y: 576.1}, {x: 649.7, y: 552.2}, {x: 649.7, y: 538.6}, {x: 649.7, y: 524.9}, {x: 649.7, y: 524.9}, {x: 646.3, y: 524.9}, {x: 646.3, y: 524.9}, {x: 642.8, y: 524.9}, {x: 639.4, y: 524.9}, {x: 636, y: 528.3}, {x: 636, y: 531.8}, {x: 632.6, y: 531.8}, {x: 632.6, y: 535.2}, {x: 629.2, y: 538.6}, {x: 629.2, y: 542}, {x: 619, y: 545.4}, {x: 608.7, y: 552.2}, {x: 598.5, y: 555.7}, {x: 584.8, y: 555.7}, {x: 574.6, y: 555.7}, {x: 564.3, y: 555.7}, {x: 554.1, y: 555.7}, {x: 547.3, y: 555.7}, {x: 537, y: 555.7}, {x: 526.8, y: 555.7}, {x: 516.6, y: 555.7}, {x: 509.7, y: 555.7}, {x: 499.5, y: 555.7}, {x: 489.2, y: 555.7}, {x: 479, y: 555.7}, {x: 468.8, y: 555.7}, {x: 465.4, y: 555.7}, {x: 461.9, y: 555.7}, {x: 458.5, y: 555.7}, {x: 455.1, y: 555.7}, {x: 451.7, y: 555.7}, {x: 444.9, y: 555.7}, {x: 438, y: 555.7}, {x: 427.8, y: 552.2}, {x: 417.6, y: 552.2}, {x: 417.6, y: 552.2}, {x: 414.2, y: 552.2}, {x: 410.7, y: 552.2}];
    assertNotMatches('弓', 0, points);
    assertNotMatches('弓', 1, points);
    assertNotMatches('弓', 2, points);
  });

  it('matches using real data 17', () => {
    const points = [{x: 526.6, y: 626.7}, {x: 526.6, y: 616.5}, {x: 506.1, y: 599.4}, {x: 495.8, y: 592.6}, {x: 465.1, y: 578.9}];
    assertNotMatches('犭', 0, points);
    assertNotMatches('犭', 1, points);
    assertNotMatches('犭', 2, points);
  });

  it('matches using real data 18', () => {
    const points = [{x: 553.9, y: 708.6}, {x: 547, y: 691.6}, {x: 540.2, y: 681.3}, {x: 540.2, y: 677.9}, {x: 540.2, y: 674.5}];
    assertNotMatches('犭', 0, points);
    assertNotMatches('犭', 1, points);
    assertNotMatches('犭', 2, points);
  });

  it('matches using real data 19', () => {
    const points = [{x: 139.5, y: 456.5}, {x: 142.9, y: 453.1}, {x: 146.3, y: 449.7}, {x: 149.7, y: 446.3}, {x: 163.4, y: 446.3}, {x: 173.6, y: 446.3}, {x: 183.8, y: 446.3}, {x: 197.5, y: 446.3}, {x: 207.7, y: 446.3}, {x: 224.8, y: 453.1}, {x: 235, y: 463.4}, {x: 252.1, y: 477}, {x: 272.6, y: 490.7}, {x: 276, y: 494.1}, {x: 282.8, y: 494.1}, {x: 286.2, y: 490.7}, {x: 289.7, y: 483.8}, {x: 289.7, y: 466.8}, {x: 289.7, y: 453.1}, {x: 289.7, y: 432.6}, {x: 289.7, y: 415.6}, {x: 286.2, y: 391.7}, {x: 286.2, y: 381.4}, {x: 286.2, y: 364.4}, {x: 286.2, y: 354.1}, {x: 286.2, y: 337.1}, {x: 286.2, y: 326.8}, {x: 286.2, y: 320}, {x: 289.7, y: 316.6}, {x: 293.1, y: 313.2}, {x: 303.3, y: 309.8}, {x: 320.4, y: 296.1}, {x: 334, y: 282.5}, {x: 351.1, y: 272.2}, {x: 357.9, y: 265.4}, {x: 357.9, y: 262}, {x: 357.9, y: 258.6}, {x: 361.3, y: 251.7}, {x: 361.3, y: 248.3}, {x: 361.3, y: 241.5}, {x: 361.3, y: 234.7}, {x: 361.3, y: 224.4}, {x: 361.3, y: 214.2}, {x: 351.1, y: 197.1}, {x: 337.4, y: 186.9}, {x: 313.5, y: 173.2}, {x: 282.8, y: 156.2}, {x: 252.1, y: 139.1}, {x: 228.2, y: 122}, {x: 214.6, y: 111.8}];
    assertNotMatches('这', 4, points);
    assertMatches('这', 5, points);
    assertNotMatches('这', 6, points);
  });

  it('matches using real data 20', () => {
    const points = [{x: 483, y: 468.2}, {x: 472.7, y: 440.9}, {x: 462.5, y: 423.8}];
    assertNotMatches('您', 4, points);
    assertMatches('您', 5, points);
    assertNotMatches('您', 6, points);
  });

  it('matches using real data 21', () => {
    const points = [{x: 184.1, y: 534.7}, {x: 214.8, y: 545}, {x: 320.6, y: 575.7}, {x: 371.8, y: 596.2}, {x: 375.2, y: 599.6}];
    assertNotMatches('吗', 0, points);
    assertNotMatches('吗', 1, points);
    assertNotMatches('吗', 2, points);
  });
});
