import renderUserStroke from '../renderUserStroke';

describe('renderUserStroke', () => {
  let ctx;

  beforeEach(() => {
    ctx = document.createElement('canvas').getContext('2d');
  });

  it('renders a user stroke path', () => {
    const props = {
      strokeColor: { r: 12, g: 101, b: 20, a: 0.3 },
      strokeWidth: 2,
      opacity: 0.7,
      points: [
        { x: 0, y: 0 },
        { x: 17, y: 3 },
        { x: 9, y: 18 },
      ],
    };
    renderUserStroke(ctx, props);
    expect(ctx.__getEvents()).toMatchSnapshot();
  });

  it('skips rendering if opacity is close to 0', () => {
    const props = {
      strokeColor: { r: 12, g: 101, b: 20, a: 0.3 },
      strokeWidth: 2,
      opacity: 0.01,
      points: [
        { x: 0, y: 0 },
        { x: 17, y: 3 },
        { x: 9, y: 18 },
      ],
    };
    renderUserStroke(ctx, props);
    expect(ctx.__getEvents()).toEqual([]);
  });
});
