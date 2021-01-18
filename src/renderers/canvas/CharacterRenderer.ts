import Character from '../../models/Character';
import { StrokeRenderState } from '../../RenderState';
import { ColorObject } from '../../typings/types';
import StrokeRenderer from './StrokeRenderer';

export default class CharacterRenderer {
  _strokeRenderers: StrokeRenderer[];

  constructor(character: Character) {
    this._strokeRenderers = character.strokes.map((stroke) => new StrokeRenderer(stroke));
  }

  render(
    ctx: CanvasRenderingContext2D,
    props: {
      opacity: number;
      strokes: Record<number, StrokeRenderState>;
      strokeColor: ColorObject;
      radicalColor?: ColorObject | null;
    },
  ) {
    if (props.opacity < 0.05) return;

    const { opacity, strokeColor, radicalColor, strokes } = props;

    for (let i = 0; i < this._strokeRenderers.length; i++) {
      this._strokeRenderers[i].render(ctx, {
        strokeColor,
        radicalColor,
        opacity: strokes[i].opacity * opacity,
        displayPortion: strokes[i].displayPortion || 0,
      });
    }
  }
}
