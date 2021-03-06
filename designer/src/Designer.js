import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { SketchPicker } from 'react-color';
import { createDistortedGridSvg } from '../../warped-grid/dist/svg';
import { createDistortedGridCtx, createDistortedGridCtxAnimated } from '../../warped-grid/dist/ctx';
import defaults from '../../warped-grid/dist/defaults';

const Designer = ({ canvas, svg }) => {
  const [picker, setPicker] = React.useState(false);
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
  const [background, setBackground] = React.useState('rgba(0,0,0,1)');
  const [stroke, setStroke] = React.useState('rgba(200,200,200,1)');
  const [speed, setSpeed] = React.useState(defaults.speed);

  const [intervalId, setIntervalId] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const renderGrid = () => {
    if (Object.values(errors).reduce((acc, cur) => acc || cur, false)) return;
    if (format === 'svg') {
      canvas.width = 0;
      canvas.height = 0;
      svg.innerHTML = createDistortedGridSvg({
        width: Number(width),
        height: Number(height),
        top: Number(top),
        left: Number(left),
        xSpacing: Number(xSpacing),
        ySpacing: Number(ySpacing),
        pointSpacing: Number(pointSpacing),
        scale: Number(scale),
        intensity: Number(intensity),
        smoothing: Number(smoothing),
        style: `fill:none;stroke:${stroke};`,
        backgroundElements: [`<rect width="${width}" height="${height}" stroke="none" fill="${background}"/>`],
      });
    }
    if (format === 'canvas') {
      svg.innerHTML = '';
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = stroke;
      createDistortedGridCtx(ctx, {
        width: Number(width),
        height: Number(height),
        top: Number(top),
        left: Number(left),
        xSpacing: Number(xSpacing),
        ySpacing: Number(ySpacing),
        pointSpacing: Number(pointSpacing),
        scale: Number(scale),
        intensity: Number(intensity),
        smoothing: Number(smoothing),
        draw: (_ctx) => { _ctx.stroke(); },
      });
    }
    if (format === 'animated' && !intervalId) {
      svg.innerHTML = '';
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const animateGrid = createDistortedGridCtxAnimated(ctx, {
        width: Number(width),
        height: Number(height),
        top: Number(top),
        left: Number(left),
        xSpacing: Number(xSpacing),
        ySpacing: Number(ySpacing),
        pointSpacing: Number(pointSpacing),
        scale: Number(scale),
        intensity: Number(intensity),
        smoothing: Number(smoothing),
        draw: (_ctx) => { _ctx.stroke(); },
        speed: Number(speed),
      });
      let time = 0;
      setIntervalId(setInterval(() => {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = stroke;
        animateGrid(time);
        time++;
      }, 30));
    }
  };
  const handleChangeFormat = (e) => {
    setFormat(e.target.value);
    // Reset speed & remove errors from it
    setSpeed(0.1);
    setErrors({ ...errors, speed: false });
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(false);
    }
  };

  const handleChangeColor = (setField) => (color) => {
    setField(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(false);
    }
  };

  const handleOpenPicker = (pickerName) => () => {
    setPicker(pickerName);
  };

  const handleClosePicker = () => {
    setPicker(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(false);
    }
  };

  const handleChangeNumber = (
    name,
    setField,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
  ) => (e) => {
    setErrors({
      ...errors,
      [name]: (
        isNaN(e.target.value)
        || e.target.value < min
        || e.target.value > max
        || e.target.value === ''
      ),
    });
    setField(e.target.value);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(false);
    }
  };

  renderGrid();

  const Spacer = (props) => <div > {props.children} </div>;
  return (
    <div style={{ marginTop: '15px' }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Render as</FormLabel>
        <RadioGroup 
          aria-label="format" 
          name="format" 
          value={format} 
          onChange={handleChangeFormat}
          style={{ margin: '5px' }}
        >
          <FormControlLabel value="svg" control={<Radio />} label="Static (SVG)" />
          <FormControlLabel value="canvas" control={<Radio />} label="Static (PNG)" />
          <FormControlLabel value="animated" control={<Radio />} label="Animated" />
        </RadioGroup>
        {format === 'animated' && <TextField
          error={errors.speed}
          label="Speed"
          value={speed}
          style={{ margin: '5px' }}
          onChange={handleChangeNumber('speed', setSpeed, 0, 1)}
        />}
      </FormControl>
      <div>
        <FormLabel
          style={{ margin: '15px', marginLeft: '5px', marginBottom: '5px' }}
          component="legend"
        >
          Grid
        </FormLabel>
        <TextField
          style={{ margin: '5px' }}
          error={errors.width}
          label="Width"
          value={width}
          onChange={handleChangeNumber('width', setWidth, 0, 10000)}
        />
        <TextField
          style={{ margin: '5px' }}
          error={errors.height}
          label="Height"
          value={height}
          onChange={handleChangeNumber('height', setHeight, 0, 10000)}
        />
      </div>
      <div>
        <TextField
          style={{ margin: '5px' }}
          error={errors.left}
          label="Offset from left"
          value={left}
          onChange={handleChangeNumber('left', setLeft, -10000, 10000)}
        />
        <TextField
          style={{ margin: '5px' }}
          error={errors.top}
          label="Offset from top"
          value={top}
          onChange={handleChangeNumber('top', setTop, -10000, 10000)}
        />
      </div>
      <div>
        <TextField
          style={{ margin: '5px' }}
          error={errors.ySpacing}
          label="Horizontal line spacing"
          value={ySpacing}
          onChange={handleChangeNumber('ySpacing', setYSpacing, 0)}
        />
        <TextField
          style={{ margin: '5px' }}
          error={errors.xSpacing}
          label="Vertical line spacing"
          value={xSpacing}
          onChange={handleChangeNumber('xSpacing', setXSpacing, 0)}
        />
      </div>
      <div>
        <FormLabel
          style={{ margin: '15px', marginLeft: '5px', marginBottom: '5px' }}
          component="legend"
        >
          Warp
        </FormLabel>
        <TextField
          style={{ margin: '5px' }}
          error={errors.intensity}
          label="Intensity"
          value={intensity}
          onChange={handleChangeNumber('intensity', setIntensity)}
        />
        <TextField
          style={{ margin: '5px' }}
          error={errors.scale}
          label="Scale"
          value={scale}
          onChange={handleChangeNumber('scale', setScale)}
        />
      </div>
      <div>
        <TextField
          style={{ margin: '5px' }}
          error={errors.pointSpacing}
          label="Warp anchor spacing"
          value={pointSpacing}
          onChange={handleChangeNumber('pointSpacing', setPointSpacing, 0)}
        />
        <TextField
          style={{ margin: '5px' }}
          error={errors.smoothing}
          label="Line smoothing"
          value={smoothing}
          onChange={handleChangeNumber('smoothing', setSmoothing, 0, 10)}
        />
      </div>
      <div>
        <FormLabel
          style={{ margin: '15px', marginLeft: '5px', marginBottom: '5px' }}
          component="legend"
        >
          Colors
        </FormLabel>
        <Button
          style={{ margin: '5px' }}
          variant="outlined" 
          onClick={handleOpenPicker('stroke')}
        >
          Grid
          <div style={{
            marginLeft: 10,
            width: 15,
            height: 15,
            backgroundColor: stroke,
          }}
          />
        </Button>
        { picker === 'stroke' && (
        <div>
          <div
            onClick={handleClosePicker}
            style={{
              position: 'fixed', top: '0px', left: '0px', bottom: '0px', right: '0px',
            }}
          />
          <SketchPicker color={stroke} onChange={handleChangeColor(setStroke)} />
        </div>
        ) }
        <Button
          style={{ margin: '5px' }}
          variant="outlined" 
          onClick={handleOpenPicker('background')}
        >
          Background
          <div style={{
            marginLeft: 10,
            width: 15,
            height: 15,
            backgroundColor: background,
          }}
          />
        </Button>
        { picker === 'background' && (
        <div>
          <div
            onClick={handleClosePicker}
            style={{
              position: 'fixed', top: '0px', left: '0px', bottom: '0px', right: '0px',
            }}
          />
          <SketchPicker color={background} onChange={handleChangeColor(setBackground)} />
        </div>
        ) }
      </div>
    </div>
  );
};

export default Designer;
