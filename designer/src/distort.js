import { makeNoise2D, makeNoise3D } from 'open-simplex-noise';

const randInt = (min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => (
  Math.floor(Math.random() * (max - min + 1) + min)
);

// Two simplex noise generators, for calculating the x and y displacement of each point
const makeDistortion = ({ scale, intensity }) => {
  const noise = {
    x: makeNoise2D(randInt()),
    y: makeNoise2D(randInt()),
  };
  return {
    x: (x, y) => noise.x(x * scale, y * scale) * intensity,
    y: (x, y) => noise.y(x * scale, y * scale) * intensity,
  };
};

const makeDistortionAnimated = ({ scale, intensity, speed }) => {
  const noise = {
    x: makeNoise3D(randInt()),
    y: makeNoise3D(randInt()),
  };
  return {
    x: (x, y, time) => noise.x(x * scale, y * scale, time * speed) * intensity,
    y: (x, y, time) => noise.y(x * scale, y * scale, time * speed) * intensity,
  };
};

// Given a list of lines, distort each point in the line
const makeDistortLines = (distortion, lines) => (
  lines.map((line) => (
    line.map(({ x, y }) => ({
      x: x + distortion.x(x, y),
      y: y + distortion.y(x, y),
    })))));

const makeDistortLinesAnimated = (distortion, lines) => (time) => (
  lines.map((line) => (
    line.map(({ x, y }) => ({
      x: x + distortion.x(x, y, time),
      y: y + distortion.y(x, y, time),
    })))));

const makeDistort = ({ scale, intensity }) => (lines) => (
  makeDistortLines(makeDistortion({ scale, intensity }), lines));

const makeDistortAnimated = ({ scale, intensity, speed }) => (lines) => (
  makeDistortLinesAnimated(makeDistortionAnimated({ scale, intensity, speed }), lines));

export { makeDistort, makeDistortAnimated };
