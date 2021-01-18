import RenderTargetBase from '../RenderTargetBase';

export default class RenderTarget extends RenderTargetBase<HTMLCanvasElement> {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  static init(elmOrId: string | HTMLCanvasElement, width = '100%', height = '100%') {
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

    const canvas = (() => {
      if (nodeType === 'CANVAS') {
        return element as HTMLCanvasElement;
      }
      const canvas = document.createElement('canvas');
      element.appendChild(canvas);
      return canvas;
    })();

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    return new RenderTarget(canvas);
  }

  getContext() {
    return this.node.getContext('2d');
  }
}
