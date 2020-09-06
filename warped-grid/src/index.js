import React from 'react';
import ReactDOM from 'react-dom';
import Designer from './Designer';

const container = document.createElement('div');
container.style.display = 'flex';
container.style.justifyContent = 'center';
document.body.appendChild(container);

const svg = document.createElement('div');
container.appendChild(svg);

const canvas = document.createElement('canvas');
canvas.width = 0;
canvas.height = 0;
container.appendChild(canvas);

const designer = document.createElement('div');
designer.style.maxWidth = '600px';
container.appendChild(designer);

ReactDOM.render(<Designer svg={svg} canvas={canvas} />, designer);
