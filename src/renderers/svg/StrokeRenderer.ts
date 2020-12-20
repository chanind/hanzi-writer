import { counter } from '../../utils';
import * as svg from './svgUtils';
import { extendStart, getPathString } from '../../geometry';
import StrokeRendererBase from '../StrokeRendererBase';
import Stroke from '../../models/Stroke';
import SVGRenderTarget from './RenderTarget';
import { ColorObject } from '../../typings/types';

const STROKE_WIDTH = 200;

type StrokeRenderProps = {
  strokeColor: ColorObject;
  radicalColor: ColorObject | null;
  displayPortion: number;
  opacity: number;
};

/** This is a stroke composed of several stroke parts **/
export default class StrokeRenderer extends StrokeRendererBase {
  _oldProps: StrokeRenderProps | undefined = undefined;

  _animationPath: SVGPathElement | undefined;
  _clip: SVGClipPathElement | undefined;
  _strokePath: SVGPathElement | undefined;

  constructor(stroke: Stroke) {
    super(stroke);
  }

  mount(target: SVGRenderTarget) {
    this._animationPath = svg.createElm('path') as SVGPathElement;
    this._clip = svg.createElm('clipPath') as SVGClipPathElement;
    this._strokePath = svg.createElm('path') as SVGPathElement;
    const maskId = `mask-${counter()}`;
    svg.attr(this._clip, 'id', maskId);

    svg.attr(this._strokePath, 'd', this.stroke.path);
    this._animationPath.style.opacity = '0';
    svg.attr(this._animationPath, 'clip-path', svg.urlIdRef(maskId));

    const extendedMaskPoints = extendStart(this.stroke.points, STROKE_WIDTH / 2);
    svg.attr(this._animationPath, 'd', getPathString(extendedMaskPoints));
    svg.attrs(this._animationPath, {
      stroke: '#FFFFFF',
      'stroke-width': STROKE_WIDTH.toString(),
      fill: 'none',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'miter',
      'stroke-dasharray': `${this._pathLength},${this._pathLength}`,
    });

    this._clip.appendChild(this._strokePath);
    target.defs.appendChild(this._clip);
    target.svg.appendChild(this._animationPath);
    return this;
  }

  render(props: StrokeRenderProps) {
    if (props === this._oldProps || !this._animationPath) {
      return;
    }

    if (props.displayPortion !== this._oldProps?.displayPortion) {
      this._animationPath.style.strokeDashoffset = this._getStrokeDashoffset(
        props.displayPortion,
      ).toString();
    }

    const color = this._getColor(props);

    if (!this._oldProps || color !== this._getColor(this._oldProps)) {
      const { r, g, b, a } = color;
      svg.attrs(this._animationPath, { stroke: `rgba(${r},${g},${b},${a})` });
    }

    if (props.opacity !== this._oldProps?.opacity) {
      this._animationPath.style.opacity = props.opacity.toString();
    }
    this._oldProps = props;
  }
}
