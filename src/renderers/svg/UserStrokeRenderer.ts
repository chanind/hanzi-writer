import * as svg from './svgUtils';
import { getPathString } from '../../geometry';
import { ColorObject, Point } from '../../typings/types';
import SVGRenderTarget from './RenderTarget';

export type EnhancedDrawingOptions = {
  enhancedDrawing: boolean;
  minDrawingWidthRatio: number;
  maxDrawingWidthRatio: number;
  drawingSpeedSensitivity: number;
};

export type UserStrokeProps = {
  strokeWidth: number;
  strokeColor: ColorObject;
  opacity: number;
  points: Point[];
  enhancedOptions?: EnhancedDrawingOptions;
};

export default class UserStrokeRenderer {
  _oldProps: UserStrokeProps | undefined = undefined;
  _path: SVGElement | undefined;

  mount(target: SVGRenderTarget) {
    this._path = svg.createElm('path');
    target.svg.appendChild(this._path);
  }

  render(props: UserStrokeProps) {
    if (!this._path || props === this._oldProps) {
      return;
    }
    const { enhancedOptions } = props;

    if (!enhancedOptions || !enhancedOptions.enhancedDrawing || props.points.length < 2) {
      this._renderSimpleStroke(props);
    } else {
      this._renderEnhancedStroke(props, enhancedOptions);
    }
    this._oldProps = props;
  }

  _renderSimpleStroke(props: UserStrokeProps) {
    if (!this._path) return;

    const { strokeColor, strokeWidth, opacity, points } = props;

    if (
      strokeColor !== this._oldProps?.strokeColor ||
      strokeWidth !== this._oldProps?.strokeWidth
    ) {
      const { r, g, b, a } = strokeColor;
      svg.attrs(this._path, {
        fill: 'none',
        stroke: `rgba(${r},${g},${b},${a})`,
        'stroke-width': strokeWidth.toString(),
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      });
    }
    if (opacity !== this._oldProps?.opacity) {
      svg.attr(this._path, 'opacity', opacity.toString());
    }
    if (points !== this._oldProps?.points) {
      svg.attr(this._path, 'd', getPathString(points));
    }
  }

  _renderEnhancedStroke(props: UserStrokeProps, enhancedOptions: EnhancedDrawingOptions) {
    if (!this._path) return;

    const { strokeColor, opacity, points, strokeWidth } = props;
    const { minDrawingWidthRatio, maxDrawingWidthRatio, drawingSpeedSensitivity } =
      enhancedOptions;

    const widths = this._calculateVariableWidths(
      points,
      strokeWidth,
      minDrawingWidthRatio,
      maxDrawingWidthRatio,
      drawingSpeedSensitivity,
    );

    const outlinePoints = this._generateStrokeOutline(points, widths);

    if (outlinePoints.length >= 3) {
      const { r, g, b, a } = strokeColor;
      svg.attrs(this._path, {
        fill: `rgba(${r},${g},${b},${a})`,
        stroke: 'none',
        'stroke-width': '0',
      });
      svg.attr(this._path, 'opacity', opacity.toString());
      svg.attr(this._path, 'd', getPathString(outlinePoints, true));
    } else {
      this._renderSimpleStroke(props);
    }
  }

  _calculateVariableWidths(
    points: Point[],
    baseWidth: number,
    minRatio: number,
    maxRatio: number,
    speedSensitivity: number,
  ): number[] {
    if (points.length < 2) return [baseWidth];

    const distances: number[] = [];
    let totalDistance = 0;

    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      distances.push(dist);
      totalDistance += dist;
    }

    const avgDistance = totalDistance / distances.length;

    const widths: number[] = [];
    const minWidth = baseWidth * minRatio;
    const maxWidth = baseWidth * maxRatio;

    for (let i = 0; i < points.length; i++) {
      let speedFactor = 1;

      if (i < distances.length) {
        const dist = distances[i];
        const speedRatio = dist / (avgDistance || 1);
        speedFactor = 1 - (speedRatio - 1) * speedSensitivity;
        speedFactor = Math.max(0.3, Math.min(1.7, speedFactor));
      }

      const totalLength = points.length;
      let taperFactor = 1;

      if (totalLength > 5) {
        const startTaperLength = Math.min(5, Math.floor(totalLength * 0.2));
        const endTaperLength = Math.min(5, Math.floor(totalLength * 0.2));

        if (i < startTaperLength) {
          taperFactor = (i + 1) / startTaperLength;
        } else if (i >= totalLength - endTaperLength) {
          taperFactor = (totalLength - i) / endTaperLength;
        }

        taperFactor = Math.max(0.4, taperFactor);
      }

      const width = baseWidth * speedFactor * taperFactor;
      widths.push(Math.max(minWidth, Math.min(maxWidth, width)));
    }

    return widths;
  }

  _generateStrokeOutline(points: Point[], widths: number[]): Point[] {
    if (points.length < 2 || widths.length < 2) return [];

    const leftPoints: Point[] = [];
    const rightPoints: Point[] = [];

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const halfWidth = widths[i] / 2;

      let dirX: number, dirY: number;

      if (i === 0) {
        dirX = points[1].x - p.x;
        dirY = points[1].y - p.y;
      } else if (i === points.length - 1) {
        dirX = p.x - points[i - 1].x;
        dirY = p.y - points[i - 1].y;
      } else {
        const prevDirX = p.x - points[i - 1].x;
        const prevDirY = p.y - points[i - 1].y;
        const nextDirX = points[i + 1].x - p.x;
        const nextDirY = points[i + 1].y - p.y;

        const prevLen = Math.sqrt(prevDirX * prevDirX + prevDirY * prevDirY);
        const nextLen = Math.sqrt(nextDirX * nextDirX + nextDirY * nextDirY);

        if (prevLen > 0 && nextLen > 0) {
          dirX = (prevDirX / prevLen + nextDirX / nextLen) / 2;
          dirY = (prevDirY / prevLen + nextDirY / nextLen) / 2;
        } else {
          dirX = prevDirX || nextDirX;
          dirY = prevDirY || nextDirY;
        }
      }

      const len = Math.sqrt(dirX * dirX + dirY * dirY);
      if (len > 0) {
        dirX /= len;
        dirY /= len;
      }

      const perpX = -dirY;
      const perpY = dirX;

      leftPoints.push({
        x: p.x + perpX * halfWidth,
        y: p.y + perpY * halfWidth,
      });
      rightPoints.push({
        x: p.x - perpX * halfWidth,
        y: p.y - perpY * halfWidth,
      });
    }

    const result: Point[] = [];

    for (let i = 0; i < leftPoints.length; i++) {
      result.push(leftPoints[i]);
    }

    for (let i = rightPoints.length - 1; i >= 0; i--) {
      result.push(rightPoints[i]);
    }

    return result;
  }

  destroy() {
    svg.removeElm(this._path);
  }
}
