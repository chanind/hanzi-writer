import yi from "hanzi-writer-data/一.json";
import { CharacterJson } from "../../../typings/types";
import StrokeRenderer from "../StrokeRenderer";
import RenderTarget from "../RenderTarget";
import parseCharData from "../../../parseCharData";

const char = parseCharData("一", yi as CharacterJson);

describe("StrokeRenderer", () => {
  let target: RenderTarget;

  beforeEach(() => {
    document.body.innerHTML = '<div id="target"></div>';
    target = RenderTarget.init("target");
  });

  it("renders a path and clipPath", () => {
    const props = {
      strokeColor: { r: 12, g: 101, b: 20, a: 0.3 },
      radicalColor: null,
      strokeWidth: 2,
      opacity: 0.7,
      displayPortion: 0.4,
    };

    const renderer = new StrokeRenderer(char.strokes[0]);
    renderer.mount(target);
    renderer.render(props);

    expect(target.defs.childNodes.length).toBe(1);
    expect(target.defs.childNodes[0].nodeName).toBe("clipPath");
    const maskPath = target.defs.childNodes[0].childNodes[0];
    expect(maskPath.nodeName).toBe("path");
    // @ts-expect-error
    const maskId = target.defs.childNodes[0].getAttribute("id");
    expect(target.svg.childNodes.length).toBe(2); // defs and path
    expect(target.svg.childNodes[1].nodeName).toBe("path");
    // @ts-expect-error
    expect(target.svg.childNodes[1].getAttribute("stroke")).toBe("rgba(12,101,20,0.3)");
    // @ts-expect-error
    expect(target.svg.childNodes[1].getAttribute("clip-path")).toBe(
      `url(http://localhost/#${maskId})`,
    );

    expect(maskPath).toMatchSnapshot();
  });
});
