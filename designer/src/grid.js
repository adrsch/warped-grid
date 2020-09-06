// Creates a grid specified as a list of lines, with each line a list of coordinate pairs
// Each line is made up of points spaced as given
const createGrid = ({
  top,
  left,
  width,
  height,
  xSpacing,
  ySpacing,
  pointSpacing,
}) => {
  const vertical = [...Array(Math.ceil(height / ySpacing)).keys()]
    .map((yNum) => yNum * ySpacing)
    .map((y) => [...Array(Math.ceil(width / pointSpacing) + 1).keys()]
      .map((xNum) => xNum * pointSpacing)
      .map((x) => ({ x: x + left, y: y + top })));
  const horizontal = [...Array(Math.ceil(width / xSpacing)).keys()]
    .map((xNum) => xNum * xSpacing)
    .map((x) => [...Array(Math.ceil(height / pointSpacing) + 1).keys()]
      .map((yNum) => yNum * pointSpacing)
      .map((y) => ({ x: x + left, y: y + top })));
  return [...vertical, ...horizontal];
};

export default createGrid;
