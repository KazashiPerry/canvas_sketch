// Importamos las librerías que necesitamos
const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");

// Configuramos los parámetros generales del sketch
const settings = {
  dimensions: [1080, 1080], // dimensiones del canvas
  animate: true, // habilita animación
};

// Configuramos los parámetros del dibujo
const params = {
  cols:10, // número de columnas en la grilla
  rows: 10, // número de filas en la grilla
  scaleMin: 1, // valor mínimo de escala de los trazos
  scaleMax: 30, // valor máximo de escala de los trazos
  freq: 0.001, // frecuencia del ruido
  amp: 0.2, // amplitud del ruido
  frame: 0, // frame inicial
  animate: true, // habilita animación
  lineCap: "butt", // tipo de extremo de los trazos
};

// Definimos la función de dibujo
const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridw = width * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    // Recorremos cada celda de la grilla
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      const f = params.animate ? frame : params.frame;

      // Obtenemos un valor de ruido para esta celda
      const n = random.noise3D(x , y, f * 10, params.freq);

      // Calculamos el ángulo de rotación para esta celda en función del ruido
      const angle = n * Math.PI * params.amp;

      // Calculamos la escala para esta celda en función del ruido
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      // Guardamos el estado actual del contexto de dibujo
      context.save();
      context.translate(x, y); // trasladamos el origen al centro de la celda
      context.translate(margx, margy); // aplicamos un margen a la grilla
      context.translate(cellw * 0.5, cellh * 0.5); // trasladamos el origen al centro de la celda
      context.rotate(angle); // rotamos en función del ruido

      // Configuramos el grosor y extremo de los trazos


      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.stroke();

      context.restore();
    }
  };
};

  const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder ( { title:"Grid" } );
  folder.addInput(params, "lineCap", { options: { butt: "butt", round: "round", square: "square"}})
  folder.addInput(params, "cols", { min: 2, max: 50, step: 1});
  folder.addInput(params, "rows", { min: 2, max: 50, step: 1});
  folder.addInput(params, "scaleMin", { min: 1, max: 100, step: 1});
  folder.addInput(params, "scaleMax", { min: 1, max: 100, step: 1});  

  folder = pane.addFolder( { title: "Noise" } );
  folder.addInput(params, "freq", { min: -0.01, max: 0.01 });
  folder.addInput(params, "amp", { min: 0, max: 1 });
  folder.addInput(params, "animate");
  folder.addInput(params, "frame", { min: 0, max: 999 })
};

createPane();
canvasSketch(sketch, settings);
