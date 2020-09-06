import makeBezier from './bezier';
import createGrid from './grid';
import { makeDistort, makeDistortAnimated } from './distort';
import defaults from './defaults';

const ctxBezier = (smoothing) => (ctx) => (
  makeBezier((cps, cpe, point) => {
    ctx.bezierCurveTo(cps.x, cps.y, cpe.x, cpe.y, point.x, point.y);
  })(smoothing));

const ctxLine = (ctx) => (point) => {
  ctx.lineTo(point.x, point.y);
};

const ctxPath = (ctx) => (points, ctxCommand, draw) => {
  ctx.beginPath();
  points.forEach((point, i, a) => (
    (i === 0) ? ctx.moveTo(point.x, point.y) : ctxCommand(point, i, a)));
  draw(ctx, points);
};

const ctxFillStroke = (ctx) => {
  ctx.fill();
  ctx.stroke();
};

const findBounds = (points) => {
  const min = { ...points[0] };
  const max = { ...points[0] };
  points.forEach((point) => {
    if (min.x > point.x) { min.x = point.x; }
    if (min.y > point.y) { min.y = point.y; }
    if (max.x < point.x) { max.x = point.x; }
    if (max.y < point.y) { max.y = point.y; }
  });
  return ({ min, max });
};

const ctxLocalGradient = (colorStops) => (ctx, points) => {
  const { min, max } = findBounds(points);
  const linearGradient = ctx.createLinearGradient(min.x, max.y, max.x, max.y);
  ctx.fillStyle = linearGradient;
  colorStops.forEach(([stop, color]) => linearGradient.addColorStop(stop, color));
  ctxFillStroke(ctx);
};

const ctxMakeConnect = (ctx, ctxCommand, draw) => {
  const path = ctxPath(ctx);
  const command = ctxCommand(ctx);
  return (lines) => lines.forEach((line) => path(line, command, draw));
};

const createDistortedGridCtx = (ctx, {
  top = defaults.top,
  left = defaults.left,
  width = defaults.width,
  height = defaults.height,
  xSpacing = defaults.xSpacing,
  ySpacing = defaults.ySpacing,
  pointSpacing = defaults.pointSpacing,
  scale = defaults.scale,
  intensity = defaults.intensity,
  smoothing = defaults.smoothing,
  draw = defaults.draw,
} = {}) => {
  const connect = ctxMakeConnect(
    ctx,
    (smoothing !== 0) ? ctxBezier(smoothing) : ctxLine,
    draw,
  );
  const distort = makeDistort({ scale, intensity });
  const grid = createGrid({
    top,
    left,
    width,
    height,
    xSpacing,
    ySpacing,
    pointSpacing,
  });
  connect(distort(grid));
};

const createDistortedGridCtxAnimated = (ctx, {
  top = defaults.top,
  left = defaults.left,
  width = defaults.width,
  height = defaults.height,
  xSpacing = defaults.xSpacing,
  ySpacing = defaults.ySpacing,
  pointSpacing = defaults.pointSpacing,
  scale = defaults.scale,
  intensity = defaults.intensity,
  smoothing = defaults.smoothing,
  draw = defaults.draw,
  speed = defaults.speed,
} = {}) => {
  const connect = ctxMakeConnect(
    ctx,
    (smoothing !== 0) ? ctxBezier(smoothing) : ctxLine,
    draw,
  );
  const distort = makeDistortAnimated({ scale, intensity, speed });
  const grid = createGrid({
    top,
    left,
    width,
    height,
    xSpacing,
    ySpacing,
    pointSpacing,
  });
  const distortedGrid = distort(grid);
  return (time) => {
    connect(distortedGrid(time));
  };
};

export {
  createDistortedGridCtx,
  createDistortedGridCtxAnimated,
  ctxFillStroke,
  ctxLocalGradient,
};
