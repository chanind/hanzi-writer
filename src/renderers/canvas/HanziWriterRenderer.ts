import Character from '../../models/Character';
import Positioner from '../../Positioner';
import HanziWriterRendererBase from '../HanziWriterRendererBase';
import CanvasRenderTarget from '../canvas/RenderTarget';
import CharacterRenderer from './CharacterRenderer';
import renderUserStroke from './renderUserStroke';
import { RenderStateObject } from '../../RenderState';
import { noop } from '../../utils';

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
    const { width, height, scale, xOffset, yOffset } = this._positioner;
    const ctx = this._target!.getContext()!;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(xOffset, height - yOffset);
    ctx.transform(1, 0, 0, -1, 0, 0);
    ctx.scale(scale, scale);
    cb(ctx);
    ctx.restore();
    // @ts-expect-error Verify if this is still needed for the "wechat miniprogram".
    if (ctx.draw) {
      // @ts-expect-error
      ctx.draw();
    }
  }

  render(props: RenderStateObject) {
    const { outline, main, highlight } = props.character;
    const {
      outlineColor,
      strokeColor,
      radicalColor,
      highlightColor,
      drawingColor,
      drawingWidth,
    } = props.options;

    this._animationFrame((ctx) => {
      this._outlineCharRenderer.render(ctx, {
        opacity: outline.opacity,
        strokes: outline.strokes,
        strokeColor: outlineColor,
      });
      this._mainCharRenderer.render(ctx, {
        opacity: main.opacity,
        strokes: main.strokes,
        strokeColor: strokeColor,
        radicalColor: radicalColor,
      });
      this._highlightCharRenderer.render(ctx, {
        opacity: highlight.opacity,
        strokes: highlight.strokes,
        strokeColor: highlightColor,
      });

      const userStrokes = props.userStrokes || {};

      for (const userStrokeId in userStrokes) {
        const userStroke = userStrokes[userStrokeId];
        if (userStroke) {
          const userStrokeProps = {
            strokeWidth: drawingWidth,
            strokeColor: drawingColor,
            ...userStroke,
          };
          renderUserStroke(ctx, userStrokeProps);
        }
      }
    });
  }
}
