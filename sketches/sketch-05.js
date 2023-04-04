
const canvasSketch = require('canvas-sketch'); // Se importa el módulo canvas-sketch
const random = require('canvas-sketch-util/random'); // Se importa el módulo random del paquete canvas-sketch-util

const settings = { // Se define un objeto settings con las dimensiones del canvas
  dimensions: [ 1080, 1080 ]
};

let manager; // Se declara una variable para contener el administrador de canvas

let text = 'A'; // Se declara una variable para contener el texto que se va a mostrar en el canvas
let fontSize = 1200; // Se declara una variable para contener el tamaño de la fuente
let fontFamily = 'serif'; // Se declara una variable para contener el tipo de fuente

const typeCanvas = document.createElement('canvas'); // Se crea un nuevo canvas utilizando el método createElement del objeto document
const typeContext = typeCanvas.getContext('2d'); // Se obtiene el contexto de dibujo 2D del nuevo canvas

const sketch = ({ context, width, height }) => { // Se define una función de dibujo que recibe como argumento el contexto, ancho y alto del canvas
  const cell = 20; // Se define una constante que representa el tamaño de la celda del mosaico
  const cols = Math.floor(width  / cell); // Se calcula el número de columnas del mosaico
  const rows = Math.floor(height / cell); // Se calcula el número de filas del mosaico
  const numCells = cols * rows; // Se calcula el número total de celdas en el mosaico

  typeCanvas.width  = cols; // Se establece el ancho del nuevo canvas para que sea igual al número de columnas del mosaico
  typeCanvas.height = rows; // Se establece la altura del nuevo canvas para que sea igual al número de filas del mosaico

  return ({ context, width, height }) => { // Se devuelve una función de dibujo que recibe como argumento el contexto, ancho y alto del canvas
    typeContext.fillStyle = 'black'; // Se establece el color de relleno del nuevo canvas
    typeContext.fillRect(0, 0, cols, rows); // Se dibuja un rectángulo negro en el nuevo canvas

    fontSize = cols * 1.2; // Se establece el tamaño de la fuente en función del número de columnas del mosaico

    typeContext.fillStyle = 'white'; // Se establece el color de la fuente en blanco
    typeContext.font = `${fontSize}px ${fontFamily}`; // Se establece el tamaño y tipo de fuente
    typeContext.textBaseline = 'top'; // Se establece la alineación vertical del texto

    const metrics = typeContext.measureText(text); // Se obtiene la información de métricas del texto
    const mx = metrics.actualBoundingBoxLeft * -1; // Se calcula el valor del margen izquierdo del texto
    const my = metrics.actualBoundingBoxAscent * -1; // Se calcula el valor del margen superior del texto
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight; // Se calcula el ancho total del texto
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent; // Se calcula la altura total del texto

		// Calcula la posición x a la que se debe trasladar el texto para que quede centrado en el canvas horizontalmente
    const tx = (cols - mw) * 0.5 - mx;

    // Calcula la posición y a la que se debe trasladar el texto para que quede centrado en el canvas verticalmente
    const ty = (rows - mh) * 0.5 - my;

    // Aplica la transformación de traslación al contexto del canvas para centrar el texto
    typeContext.save();
    typeContext.translate(tx, ty);

    // Dibuja un rectángulo que representa el bounding box del texto
    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    // Dibuja el texto en el canvas
    typeContext.fillText(text, 0, 0);
		typeContext.restore();

		const typeData = typeContext.getImageData(0, 0, cols, rows).data;


		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.textBaseline = 'middle';
		context.textAlign = 'center';

		// context.drawImage(typeCanvas, 0, 0);

		for (let i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * cell;
			const y = row * cell;

			const r = typeData[i * 4 + 0];
			const g = typeData[i * 4 + 1];
			const b = typeData[i * 4 + 2];
			const a = typeData[i * 4 + 3];

			const glyph = getGlyph(r);

			context.font = `${cell * 2}px ${fontFamily}`;
			if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

			context.fillStyle = 'white';

			context.save();
			context.translate(x, y);
			context.translate(cell * 0.5, cell * 0.5);

			// context.fillRect(0, 0, cell, cell);

			context.fillText(glyph, 0, 0);
			
			context.restore();

		}
	};
};

const getGlyph = (v) => {
	if (v < 50) return '';
	if (v < 100) return '.';
	if (v < 150) return '-';
	if (v < 200) return '+';

	const glyphs = '_= /'.split('');

	return random.pick(glyphs);
};


const onKeyUp = (e) => {
	text = e.key.toUpperCase();
	manager.render();
};

document.addEventListener('keyup', onKeyUp);


const start = async () => {
	manager = await canvasSketch(sketch, settings);
};

start();