import RenderTarget from "../RenderTarget";

describe("RenderTarget", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
  });

  it("correctly initializes with an id selector", () => {
    const target = RenderTarget.init("target");
    expect(target.node).toBeTruthy();
    expect(target.node.nodeName.toUpperCase()).toBe("SVG");
  });

  it("correctly initializes with an element as an argument", () => {
    const targetElement = document.querySelector("#target")!;
    const target = RenderTarget.init(targetElement);
    expect(target.node).toBeTruthy();
    expect(target.node.nodeName.toUpperCase()).toBe("SVG");
  });

  it("doesn't create a new SVG element when an SVG target is given", () => {
    const bodyHtml = `<svg id="target"></svg>`;
    document.body.innerHTML = bodyHtml;
    const targetElement = document.querySelector("#target")!;
    const target = RenderTarget.init(targetElement);
    expect(target.node).toEqual(targetElement);
  });
});
