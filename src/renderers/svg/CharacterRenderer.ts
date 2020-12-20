import { isMsBrowser } from '../../utils';
import StrokeRenderer from './StrokeRenderer';
import SVGRenderTarget from './RenderTarget';
import Character from '../../models/Character';
import { ColorObject } from '../../typings/types';
import { StrokeRenderState } from '../../RenderState';

type SvgCharacterRenderProps = {
  opacity: number;
  strokes: Record<number, StrokeRenderState>;
  strokeColor: ColorObject;
  radicalColor?: ColorObject | null;
};

export default class CharacterRenderer {
  _oldProps: SvgCharacterRenderProps | undefined = undefined;
  _strokeRenderers: StrokeRenderer[];

  // set on mount()
  _group: SVGElement | SVGSVGElement | undefined;

  constructor(character: Character) {
    this._strokeRenderers = character.strokes.map((stroke) => new StrokeRenderer(stroke));
  }

  mount(target: SVGRenderTarget) {
    const subTarget = target.createSubRenderTarget();
    this._group = subTarget.svg;
    this._strokeRenderers.forEach((strokeRenderer) => {
      strokeRenderer.mount(subTarget);
    });
  }

  render(props: SvgCharacterRenderProps) {
    if (props === this._oldProps || !this._group) {
      return;
    }
    const { opacity, strokes, strokeColor, radicalColor = null } = props;
    if (opacity !== this._oldProps?.opacity) {
      this._group.style.opacity = opacity.toString();
      // MS browsers seem to have a bug where if SVG is set to display:none, it sometimes breaks.
      // More info: https://github.com/chanind/hanzi-writer/issues/164
      // this is just a perf improvement, so disable for MS browsers
      if (!isMsBrowser) {
        if (opacity === 0) {
          this._group.style.display = 'none';
        } else if (this._oldProps?.opacity === 0) {
          this._group.style.removeProperty('display');
        }
      }
    }
    const colorsChanged =
      !this._oldProps ||
      strokeColor !== this._oldProps.strokeColor ||
      radicalColor !== this._oldProps.radicalColor;

    if (colorsChanged || strokes !== this._oldProps?.strokes) {
      for (let i = 0; i < this._strokeRenderers.length; i++) {
        if (
          !colorsChanged &&
          this._oldProps?.strokes &&
          strokes[i] === this._oldProps.strokes[i]
        ) {
          continue;
        }
        this._strokeRenderers[i].render({
          strokeColor,
          radicalColor,
          opacity: strokes[i].opacity,
          displayPortion: strokes[i].displayPortion,
        });
      }
    }
    this._oldProps = props;
  }
}
