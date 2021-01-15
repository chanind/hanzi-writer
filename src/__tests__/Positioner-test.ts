import Positioner from '../Positioner';

describe('Positioner', () => {
  it('calculates scale and offset to transform characters to fix in the box on screen', () => {
    const positioner = new Positioner({ width: 400, height: 400, padding: 20 });

    expect(positioner.xOffset).toBe(20);
    expect(positioner.yOffset).toBe(63.59375);
    expect(positioner.scale).toBe(0.3515625);
    expect(positioner.height).toBe(400);
  });

  it('converts points from the external reference frame to the character reference frame', () => {
    const positioner = new Positioner({ width: 400, height: 400, padding: 20 });
    expect(positioner.convertExternalPoint({ x: 30, y: 50 })).toEqual({
      x: 28.444444444444443,
      y: 814.6666666666666,
    });
  });
});
