const ren = require('hanzi-writer-data/人.json');
const Positioner = require('../Positioner');
const CharDataParser = require('../CharDataParser');


const char = new CharDataParser().generateCharacter('人', ren);


describe('Positioner', () => {
  it('calculates scale and offset to transform characters to fix in the box on screen', () => {
    const positioner = new Positioner({ width: 400, height: 400, padding: 20 });

    expect(positioner.getXOffset()).toBe(20);
    expect(positioner.getYOffset()).toBe(63.59375);
    expect(positioner.getScale()).toBe(0.3515625);
    expect(positioner.getHeight()).toBe(400);
  });

  it('converts points from the external reference frame to the character reference frame', () => {
    const positioner = new Positioner({ width: 400, height: 400, padding: 20 });
    expect(positioner.convertExternalPoint({x: 30, y: 50})).toEqual({x: 28.444444444444443, y: 814.6666666666666});
  });
});
