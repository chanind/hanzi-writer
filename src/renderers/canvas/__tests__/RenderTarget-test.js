const RenderTarget = require('../RenderTarget');


describe('RenderTarget', () => {

  it('can render a canvas into a div on the page', () => {
    document.body.innerHTML = '<div id="target"></div>';
    const target = RenderTarget.init('target', '200px', '120px');
    const canvas = document.querySelector('#target canvas');
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(120);
    expect(target.node).toBe(canvas);
  });

  it('can use an existing canvas on the page', () => {
    document.body.innerHTML = '<canvas id="target"></div>';
    const target = RenderTarget.init('target', '200px', '120px');
    const canvas = document.querySelector('canvas#target');
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(120);
    expect(target.node).toBe(canvas);
  });

});
