import CharacterRenderer from "./CharacterRenderer";
import UserStrokeRenderer, { UserStrokeProps } from "./UserStrokeRenderer";
import * as svg from "./svgUtils";
import Character from "../../models/Character";
import Positioner from "../../Positioner";
import SVGRenderTarget from "./RenderTarget";
import HanziWriterRendererBase from "../HanziWriterRendererBase";
import { RenderStateObject } from "../../RenderState";

export default class HanziWriterRenderer
  implements HanziWriterRendererBase<SVGElement | SVGSVGElement, SVGRenderTarget> {
  _character: Character;
  _positioner: Positioner;
  _mainCharRenderer: CharacterRenderer;
  _outlineCharRenderer: CharacterRenderer;
  _highlightCharRenderer: CharacterRenderer;
  _userStrokeRenderers: Record<string, UserStrokeRenderer | undefined>;
  _positionedTarget: SVGRenderTarget | undefined;

  constructor(character: Character, positioner: Positioner) {
    this._character = character;
    this._positioner = positioner;
    this._mainCharRenderer = new CharacterRenderer(character);
    this._outlineCharRenderer = new CharacterRenderer(character);
    this._highlightCharRenderer = new CharacterRenderer(character);
    this._userStrokeRenderers = {};
  }

  mount(target: SVGRenderTarget) {
    const positionedTarget = target.createSubRenderTarget();
    const group = positionedTarget.svg;
    svg.attr(
      group,
      "transform",
      `
    translate(${this._positioner.xOffset}, ${
        this._positioner.height - this._positioner.yOffset
      })
    scale(${this._positioner.scale}, ${-1 * this._positioner.scale})
  `,
    );
    this._outlineCharRenderer.mount(positionedTarget);
    this._mainCharRenderer.mount(positionedTarget);
    this._highlightCharRenderer.mount(positionedTarget);
    this._positionedTarget = positionedTarget;
  }

  render(props: RenderStateObject) {
    this._outlineCharRenderer.render({
      opacity: props.character.outline.opacity,
      strokes: props.character.outline.strokes,
      strokeColor: props.options.outlineColor,
    });
    this._mainCharRenderer.render({
      opacity: props.character.main.opacity,
      strokes: props.character.main.strokes,
      strokeColor: props.options.strokeColor,
      radicalColor: props.options.radicalColor,
    });
    this._highlightCharRenderer.render({
      opacity: props.character.highlight.opacity,
      strokes: props.character.highlight.strokes,
      strokeColor: props.options.highlightColor,
    });

    const userStrokes = props.userStrokes || {};

    for (const userStrokeId in this._userStrokeRenderers) {
      if (!userStrokes[userStrokeId]) {
        this._userStrokeRenderers[userStrokeId]?.destroy();
        delete this._userStrokeRenderers[userStrokeId];
      }
    }

    for (const userStrokeId in userStrokes) {
      const stroke = userStrokes[userStrokeId];
      if (!stroke) return;
      const userStrokeProps: UserStrokeProps = {
        strokeWidth: props.options.drawingWidth,
        strokeColor: props.options.drawingColor,
        ...stroke,
      };
      let strokeRenderer = this._userStrokeRenderers[userStrokeId];
      if (!strokeRenderer) {
        strokeRenderer = new UserStrokeRenderer();
        strokeRenderer.mount(this._positionedTarget!);
        this._userStrokeRenderers[userStrokeId] = strokeRenderer;
      }
      strokeRenderer.render(userStrokeProps);
    }
  }

  destroy() {
    svg.removeElm(this._positionedTarget!.svg);
    this._positionedTarget!.defs.innerHTML = "";
  }
}
