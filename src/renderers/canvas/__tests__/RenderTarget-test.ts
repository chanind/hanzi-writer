import RenderTarget from '../RenderTarget';

describe('RenderTarget', () => {
  it('can render a canvas into a div on the page', () => {
    document.body.innerHTML = '<div id="target"></canvas>';
    const target = RenderTarget.init('target', '200px', '120px');
    const canvas = document.querySelector<HTMLCanvasElement>('#target canvas');
    expect(canvas!.width).toBe(200);
    expect(canvas!.height).toBe(120);
    expect(target.node).toBe(canvas);
  });

  it('can use an existing canvas on the page', () => {
    document.body.innerHTML = '<canvas id="target"></canvas>';
    const target = RenderTarget.init('target', '200px', '120px');
    const canvas = document.querySelector<HTMLCanvasElement>('canvas#target');
    expect(canvas!.width).toBe(200);
    expect(canvas!.height).toBe(120);
    expect(target.node).toBe(canvas);
  });

  it("Errors if the element can't be found", () => {
    document.body.innerHTML = '<canvas id="target"></canvas>';
    expect(() => {
      RenderTarget.init('wrong-target', '200px', '120px');
    }).toThrow('HanziWriter target element not found: wrong-target');
  });
});
