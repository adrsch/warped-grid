import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { createDistortedGridSvg, createDistortedGridSvgAnimated, svgLinearGradient } from '../../warped-grid/dist/svg';
import { createDistortedGridCtx, createDistortedGridCtxAnimated } from '../../warped-grid/dist/ctx';
import defaults from '../../warped-grid/dist/defaults';

const Designer = ({ canvas, svg }) => {
  const [format, setFormat] = React.useState('svg');
  const [top, setTop] = React.useState(defaults.top);
  const [left, setLeft] = React.useState(defaults.left);
  const [width, setWidth] = React.useState(defaults.width);
  const [height, setHeight] = React.useState(defaults.height);
  const [xSpacing, setXSpacing] = React.useState(defaults.xSpacing);
  const [ySpacing, setYSpacing] = React.useState(defaults.ySpacing);
  const [pointSpacing, setPointSpacing] = React.useState(defaults.pointSpacing);
  const [scale, setScale] = React.useState(defaults.scale);
  const [intensity, setIntensity] = React.useState(defaults.intensity);
  const [smoothing, setSmoothing] = React.useState(defaults.smoothing);
  const [backgroundColor, setBackgroundColor] = React.useState('none');
  const [fill, setFill] = React.useState('rgba(0,0,0,0.1)');
  const [stroke, setStroke] = React.useState('rgba(0,0,0,1)');
  const [animated, setAnimated] = React.useState(false);
  const [speed, setSpeed] = React.useState(defaults.speed);

  const renderGrid = () => {
    if (format === 'svg' && animated === false) {
      svg.innerHTML = createDistortedGridSvg({
        width,
        height,
        xSpacing,
        ySpacing,
        pointSpacing,
        scale,
        intensity,
        smoothing,
        style: `fill:${fill};stroke:${stroke};`,
        backgroundElements: [`<rect width="${width}" height="${height}" stroke="none" fill="${backgroundColor}"/>`],
      });
    }
  };

  const handleChangeFormat = (e) => {
    setFormat(event.target.value);
  };


  renderGrid();
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Render as</FormLabel>
      <RadioGroup aria-label="format" name="format" value={format} onChange={handleChangeFormat}>
        <FormControlLabel value="svg" control={<Radio />} label="SVG" />
        <FormControlLabel value="canvas" control={<Radio />} label="Canvas (PNG)" />
      </RadioGroup>
    </FormControl>
  );
};

export default Designer;
