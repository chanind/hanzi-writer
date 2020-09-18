import Character from "../../models/Character";
import Positioner from "../../Positioner";
import HanziWriterRendererBase from "../HanziWriterRendererBase";
import CanvasRenderTarget from "../canvas/RenderTarget";
import CharacterRenderer from "./CharacterRenderer";
import renderUserStroke from "./renderUserStroke";
import { RenderStateObject } from "../../RenderState";
import { noop } from "../../utils";

export default class HanziWriterRenderer
  implements HanziWriterRendererBase<HTMLCanvasElement, CanvasRenderTarget> {
  _character: Character;
  _positioner: Positioner;
  _mainCharRenderer: CharacterRenderer;
  _outlineCharRenderer: CharacterRenderer;
  _highlightCharRenderer: CharacterRenderer;
  _target: CanvasRenderTarget | undefined;

  constructor(character: Character, positioner: Positioner) {
    this._character = character;
    this._positioner = positioner;
    this._mainCharRenderer = new CharacterRenderer(character);
    this._outlineCharRenderer = new CharacterRenderer(character);
    this._highlightCharRenderer = new CharacterRenderer(character);
  }

  mount(target: CanvasRenderTarget) {
    this._target = target;
  }

  destroy = noop;

  _animationFrame(cb: (ctx: CanvasRenderingContext2D) => void) {
    const ctx = this._target!.getContext()!;
    ctx.clearRect(0, 0, this._positioner.width, this._positioner.height);

    ctx.save();
    ctx.translate(
      this._positioner.xOffset,
      this._positioner.height - this._positioner.yOffset,
    );
    ctx.transform(1, 0, 0, -1, 0, 0);
    ctx.scale(this._positioner.scale, this._positioner.scale);
    cb(ctx);
    ctx.restore();

    // @ts-expect-error
    if (ctx.draw) {
      // @ts-expect-error
      ctx.draw();
    }
  }

  render(props: RenderStateObject) {
    this._animationFrame((ctx) => {
      this._outlineCharRenderer.render(ctx, {
        opacity: props.character.outline.opacity,
        strokes: props.character.outline.strokes,
        strokeColor: props.options.outlineColor,
      });
      this._mainCharRenderer.render(ctx, {
        opacity: props.character.main.opacity,
        strokes: props.character.main.strokes,
        strokeColor: props.options.strokeColor,
        radicalColor: props.options.radicalColor,
      });
      this._highlightCharRenderer.render(ctx, {
        opacity: props.character.highlight.opacity,
        strokes: props.character.highlight.strokes,
        strokeColor: props.options.highlightColor,
      });

      const userStrokes = props.userStrokes || {};

      for (const userStrokeId in userStrokes) {
        const userStroke = userStrokes[userStrokeId];
        if (userStroke) {
          const userStrokeProps = {
            strokeWidth: props.options.drawingWidth,
            strokeColor: props.options.drawingColor,
            ...userStroke,
          };
          renderUserStroke(ctx, userStrokeProps);
        }
      }
    });
  }
}
