import { createElm, attrs } from './svgUtils';
import RenderTargetBase from '../RenderTargetBase';

export default class RenderTarget extends RenderTargetBase<SVGSVGElement | SVGElement> {
  static init(elmOrId: Element | string, width = '100%', height = '100%') {
    const element = (() => {
      if (typeof elmOrId === 'string') {
        return document.getElementById(elmOrId);
      }
      return elmOrId;
    })();

    if (!element) {
      throw new Error(`HanziWriter target element not found: ${elmOrId}`);
    }
    const nodeType = element.nodeName.toUpperCase();

    const svg = (() => {
      if (nodeType === 'SVG' || nodeType === 'G') {
        return element;
      } else {
        const svg = createElm('svg');
        element.appendChild(svg);
        return svg;
      }
    })() as SVGSVGElement;

    attrs(svg, { width, height });
    const defs = createElm('defs');
    svg.appendChild(defs);

    return new RenderTarget(svg, defs);
  }

  svg: SVGSVGElement | SVGElement;
  defs: SVGElement;
  _pt: DOMPoint | undefined;

  constructor(svg: SVGElement | SVGSVGElement, defs: SVGElement) {
    super(svg);

    this.svg = svg;
    this.defs = defs;

    if ('createSVGPoint' in svg) {
      this._pt = svg.createSVGPoint();
    }
  }

  createSubRenderTarget() {
    const group = createElm('g');
    this.svg.appendChild(group);
    return new RenderTarget(group, this.defs);
  }

  _getMousePoint(evt: MouseEvent) {
    if (this._pt) {
      this._pt.x = evt.clientX;
      this._pt.y = evt.clientY;
      if ('getScreenCTM' in this.node) {
        const localPt = this._pt.matrixTransform(this.node.getScreenCTM()?.inverse());
        return { x: localPt.x, y: localPt.y };
      }
    }
    return super._getMousePoint.call(this, evt);
  }

  _getTouchPoint(evt: TouchEvent) {
    if (this._pt) {
      this._pt.x = evt.touches[0].clientX;
      this._pt.y = evt.touches[0].clientY;
      if ('getScreenCTM' in this.node) {
        const localPt = this._pt.matrixTransform(
          (this.node as SVGSVGElement).getScreenCTM()?.inverse(),
        );
        return { x: localPt.x, y: localPt.y };
      }
    }
    return super._getTouchPoint(evt);
  }
}
