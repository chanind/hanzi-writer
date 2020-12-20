import CharacterRenderer from './CharacterRenderer';
import UserStrokeRenderer, { UserStrokeProps } from './UserStrokeRenderer';
import * as svg from './svgUtils';
import Character from '../../models/Character';
import Positioner from '../../Positioner';
import SVGRenderTarget from './RenderTarget';
import HanziWriterRendererBase from '../HanziWriterRendererBase';
import { RenderStateObject } from '../../RenderState';

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
    const { xOffset, yOffset, height, scale } = this._positioner;

    svg.attr(
      group,
      'transform',
      `translate(${xOffset}, ${height - yOffset}) scale(${scale}, ${-1 * scale})`,
    );
    this._outlineCharRenderer.mount(positionedTarget);
    this._mainCharRenderer.mount(positionedTarget);
    this._highlightCharRenderer.mount(positionedTarget);
    this._positionedTarget = positionedTarget;
  }

  render(props: RenderStateObject) {
    const { main, outline, highlight } = props.character;
    const {
      outlineColor,
      radicalColor,
      highlightColor,
      strokeColor,
      drawingWidth,
      drawingColor,
    } = props.options;

    this._outlineCharRenderer.render({
      opacity: outline.opacity,
      strokes: outline.strokes,
      strokeColor: outlineColor,
    });

    this._mainCharRenderer.render({
      opacity: main.opacity,
      strokes: main.strokes,
      strokeColor,
      radicalColor: radicalColor,
    });

    this._highlightCharRenderer.render({
      opacity: highlight.opacity,
      strokes: highlight.strokes,
      strokeColor: highlightColor,
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
      if (!stroke) {
        continue;
      }
      const userStrokeProps: UserStrokeProps = {
        strokeWidth: drawingWidth,
        strokeColor: drawingColor,
        ...stroke,
      };

      const strokeRenderer = (() => {
        if (this._userStrokeRenderers[userStrokeId]) {
          return this._userStrokeRenderers[userStrokeId]!;
        }
        const newStrokeRenderer = new UserStrokeRenderer();
        newStrokeRenderer.mount(this._positionedTarget!);
        this._userStrokeRenderers[userStrokeId] = newStrokeRenderer;
        return newStrokeRenderer;
      })();

      strokeRenderer.render(userStrokeProps);
    }
  }

  destroy() {
    svg.removeElm(this._positionedTarget!.svg);
    this._positionedTarget!.defs.innerHTML = '';
  }
}
