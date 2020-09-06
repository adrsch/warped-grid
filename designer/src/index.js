import React from 'react';
import ReactDOM from 'react-dom';
import Designer from './Designer';

const display = document.createElement('div');
display.style.display = 'flex';
display.style.justifyContent = 'center';
document.body.appendChild(display);

const svg = document.createElement('div');
display.appendChild(svg);

const canvas = document.createElement('canvas');
canvas.width = 0;
canvas.height = 0;
display.appendChild(canvas);

const main = document.createElement('main');
main.style.display = 'flex';
main.style.justifyContent = 'center';
document.body.appendChild(main);

const container = document.createElement('div');
main.appendChild(container);

const designer = document.createElement('div');
designer.style.maxWidth = '600px';
container.appendChild(designer);

ReactDOM.render(<Designer svg={svg} canvas={canvas} />, designer);
