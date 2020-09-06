import makeBezier from './bezier';
import createGrid from './grid';
import { makeDistort, makeDistortAnimated } from './distort';
import defaults from './defaults';

const svgBezier = makeBezier((cps, cpe, point) => (
  `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`));

const svgLine = (point) => `L ${point[0]} ${point[1]}`;

const svgPath = (points, command, style) => {
  const d = points.reduce((acc, point, i, a) => (
    (i === 0) ? `M ${point.x},${point.y}` : `${acc} ${command(point, i, a)}`
  ), '');
  return `<path d='${d}' style="${style}" />`;
};

const svgMakeConnect = (command, style) => (lines) => lines.reduce((acc, cur) => acc + svgPath(cur, command, style), '');

const svgLinearGradient = ({
  startColor = '#ff0',
  startOpacity = 0.3,
  stopColor = '#f00',
  stopOpacity = 1,
  id = 'grad',
} = {}) => `<linearGradient id='${id}' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' style='stop-color:${startColor};stop-opacity:${startOpacity}' /><stop offset='100%' style='stop-color:${stopColor};stop-opacity:${stopOpacity}' /></linearGradient>`; // eslint-disable-line

const createSvg = (w, h, contents) => `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${contents.join('')}</svg>`; // eslint-disable-line

const prepareSvg = (svg, htmlSafe) => ((htmlSafe) ? svg
  .replace(/"/g, '\'')
  .replace(/\n/g, '')
  .replace(/#/g, '%23')
  : svg);

const createDistortedGridSvg = ({
  top = defaults.top,
  left = defaults.left,
  width = defaults.width,
  height = defaults.height,
  xSpacing = defaults.xSpacing,
  ySpacing = defaults.ySpacing,
  pointSpacing = defaults.pointSpacing,
  scale = defaults.scale,
  intensity = defaults.intensity,
  style = defaults.style,
  backgroundElements = defaults.backgroundElements,
  foregroundElements = defaults.foregroundElements,
  smoothing = defaults.smoothing,
  htmlSafe = defaults.htmlSafe,
} = {}) => {
  const connect = svgMakeConnect(
    (smoothing !== 0) ? svgBezier(smoothing) : svgLine,
    style,
  );
  const distort = makeDistort({ scale, intensity });
  const grid = createGrid({
    top, left, width, height, xSpacing, ySpacing, pointSpacing,
  });
  const distortedGrid = connect(distort(grid));
  const svg = createSvg(width, height, [
    ...backgroundElements,
    distortedGrid,
    ...foregroundElements,
  ]);
  return prepareSvg(svg, htmlSafe);
};

const createDistortedGridSvgAnimated = ({
  top = defaults.top,
  left = defaults.left,
  width = defaults.width,
  height = defaults.height,
  xSpacing = defaults.xSpacing,
  ySpacing = defaults.ySpacing,
  pointSpacing = defaults.pointSpacing,
  scale = defaults.scale,
  intensity = defaults.intensity,
  style = defaults.style,
  backgroundElements = defaults.backgroundElements,
  foregroundElements = defaults.foregroundElements,
  smoothing = defaults.smoothing,
  speed = defaults.speed,
  htmlSafe = defaults.htmlSafe,
} = {}) => {
  const connect = svgMakeConnect(
    (smoothing !== 0) ? svgBezier(smoothing) : svgLine,
    style,
  );
  const distort = makeDistortAnimated({ scale, intensity, speed });
  const grid = createGrid({
    top, left, width, height, xSpacing, ySpacing, pointSpacing,
  });
  const distortedGrid = distort(grid);
  return (time) => {
    const svg = createSvg(width, height, [
      ...backgroundElements,
      connect(distortedGrid(time)),
      ...foregroundElements,
    ]);
    return prepareSvg(svg, htmlSafe);
  };
};

export { createDistortedGridSvg, createDistortedGridSvgAnimated, svgLinearGradient };
