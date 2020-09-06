const defaults = {
  top: 0,
  left: 0,
  width: 320,
  height: 240,
  xSpacing: 10,
  ySpacing: 10,
  pointSpacing: 50,
  scale: 0.01,
  intensity: 100,
  speed: 0.1,
  style: 'fill:none;stroke:gray;',
  backgroundElements: [],
  foregroundElements: [],
  smoothing: 0.2,
  singleQuotes: true,
  draw: (ctx, points) => { ctx.fill(); ctx.stroke(); }, // eslint-disable-line no-unused-vars
};

export default defaults;
